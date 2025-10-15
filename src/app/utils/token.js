// Token utility functions
export const tokenManager = {
  // Get token from localStorage
  getToken: () => {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('adminToken');
    const timestamp = localStorage.getItem('adminTokenTimestamp');
    
    // Check if token exists and is not expired (24 hours)
    if (token && timestamp) {
      const tokenAge = Date.now() - parseInt(timestamp);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (tokenAge < twentyFourHours) {
        return token;
      } else {
        // Token expired, remove it
        tokenManager.clearToken();
        return null;
      }
    }
    
    return null;
  },

  // Store token
  setToken: (token) => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminTokenTimestamp', Date.now().toString());
  },

  // Clear token
  clearToken: () => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenTimestamp');
    localStorage.removeItem('adminUser');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return tokenManager.getToken() !== null;
  },

  // Get auth headers for API calls
  getAuthHeaders: () => {
    const token = tokenManager.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }
};