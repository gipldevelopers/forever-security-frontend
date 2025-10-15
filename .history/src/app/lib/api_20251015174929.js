// lib/api.js - Updated for Node.js backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiService {
    constructor() {
        this.token = null;
    }

    setToken(token) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('auth_token', token);
                localStorage.setItem('auth_user', JSON.stringify({ username: 'admin' }));
            } else {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
            }
        }
    }

    getToken() {
        if (!this.token && typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
        return this.token;
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        }
    }

    async request(endpoint, options = {}) {
        const cleanBaseUrl = API_BASE_URL.replace(/\/$/, '');
        const cleanEndpoint = endpoint.replace(/^\//, '');
        const url = `${cleanBaseUrl}/${cleanEndpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
        };

        const token = this.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`🔄 API Request: ${url}`, { 
            method: config.method || 'GET',
            hasToken: !!token 
        });

        try {
            const response = await fetch(url, config);
            
            console.log(`📡 Response Status: ${response.status} ${response.statusText}`);

            if (response.status === 401) {
                this.clearToken();
                throw new Error('Authentication failed. Please login again.');
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('❌ Non-JSON response received:', text.substring(0, 200));
                
                if (text.includes('<!DOCTYPE html>') || text.includes('<html>')) {
                    throw new Error(`Server returned HTML page. Check if endpoint exists: ${endpoint}`);
                }
                
                throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!response.ok) {
                console.error(`❌ API Error ${response.status}:`, data);
                throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
            }

            console.log(`✅ API Success: ${endpoint}`, data);
            return data;
            
        } catch (error) {
            console.error(`💥 API Request failed: ${url}`, error);
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please check:
• Backend server is running on port 5000
• URL is correct: ${API_BASE_URL}
• No firewall restrictions
• CORS is properly configured`);
            }
            
            throw new Error(`API request failed: ${error.message}`);
        }
    }

    // Auth methods
    async login(credentials) {
        const response = await this.request('api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        
        if (response.token) {
            this.setToken(response.token);
            if (typeof window !== 'undefined' && response.user) {
                localStorage.setItem('auth_user', JSON.stringify(response.user));
            }
        }
        
        return response;
    }

    async verifyToken() {
        return this.request('api/auth/verify');
    }

    // Dashboard
    async getDashboard() {
        return this.request('api/admin/dashboard');
    }

    // Services methods
    async getAdminServices() {
        return this.request('api/services');
    }

    async getServiceById(serviceId) {
        return this.request(`api/services/${serviceId}`);
    }

    async createService(serviceData) {
        return this.request('api/services', {
            method: 'POST',
            body: JSON.stringify(serviceData),
        });
    }

    async updateService(serviceId, serviceData) {
        return this.request(`api/services/${serviceId}`, {
            method: 'PUT',
            body: JSON.stringify(serviceData),
        });
    }

    async deleteService(serviceId) {
        return this.request(`api/services/${serviceId}`, {
            method: 'DELETE',
        });
    }

    // Blog methods - UPDATED WITH FALLBACK
    async getBlogs(queryParams = '') {
        try {
            return await this.request(`api/blogs${queryParams}`);
        } catch (error) {
            console.error('❌ Paginated blogs failed, trying non-paginated:', error);
            // Fallback to non-paginated endpoint
            return await this.request('api/blogs/all');
        }
    }

    async getAllBlogs() {
        return this.request('api/blogs/all');
    }

    async getBlogById(blogId) {
        return this.request(`api/blogs/${blogId}`);
    }

    async getPublicBlogBySlug(slug) {
        return this.request(`api/blogs/slug/${slug}`);
    }

    async createBlog(blogData) {
        return this.request('api/blogs', {
            method: 'POST',
            body: JSON.stringify(blogData),
        });
    }

    async updateBlog(blogId, blogData) {
        return this.request(`api/blogs/${blogId}`, {
            method: 'PUT',
            body: JSON.stringify(blogData),
        });
    }

    async deleteBlog(blogId) {
        return this.request(`api/blogs/${blogId}`, {
            method: 'DELETE',
        });
    }

// Gallery methods - simplified
async getGallery() {
    return this.request('api/gallery');
}

async deleteImage(imageId) {
    return this.request(`api/gallery/${imageId}`, {
        method: 'DELETE',
    });
}
    // Testimonials methods
async getTestimonials() {
    return this.request('api/testimonials');
}

async getTestimonialById(testimonialId) {
    return this.request(`api/testimonials/${testimonialId}`);
}

async createTestimonial(testimonialData) {
    // Note: This will be handled with FormData in the component
    return this.request('api/testimonials', {
        method: 'POST',
        body: testimonialData, // FormData object
    });
}

async updateTestimonial(testimonialId, testimonialData) {
    return this.request(`api/testimonials/${testimonialId}`, {
        method: 'PUT',
        body: testimonialData, // FormData object
    });
}

async deleteTestimonial(testimonialId) {
    return this.request(`api/testimonials/${testimonialId}`, {
        method: 'DELETE',
    });
}

async toggleTestimonialStatus(testimonialId) {
    return this.request(`api/testimonials/${testimonialId}/toggle`, {
        method: 'PATCH',
    });
}

    export const apiService = {
  // Get all contact submissions
  getContactSubmissions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      return { success: false, error: 'Failed to fetch contact submissions' };
    }
  },

  // Delete contact submission
  deleteContact: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting contact submission:', error);
      return { success: false, error: 'Failed to delete contact submission' };
    }
  },
};
    // Health check
    async healthCheck() {
        return this.request('health');
    }

    // Logout
    async logout() {
        this.clearToken();
        return { success: true };
    }
}

// Create a single instance
const apiService = new ApiService();

export default apiService;
export { apiService };