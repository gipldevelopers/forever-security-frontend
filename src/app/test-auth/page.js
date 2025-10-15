"use client";

import { useState, useEffect } from 'react';
import { apiService } from '@/app/lib/api';

export default function TestAuthPage() {
  const [status, setStatus] = useState('Testing...');
  const [token, setToken] = useState(null);

  useEffect(() => {
    testAuthentication();
  }, []);

  const testAuthentication = async () => {
    try {
      console.log('🧪 Starting authentication test...');
      
      // Check current token
      const currentToken = apiService.getToken();
      setToken(currentToken);
      console.log('🔐 Current token:', currentToken);
      
      if (!currentToken) {
        setStatus('❌ No token found. Please login first.');
        return;
      }

      // Test token verification
      setStatus('🔐 Verifying token...');
      const verifyResponse = await apiService.verifyToken();
      console.log('✅ Token verification:', verifyResponse);
      
      // Test protected endpoint
      setStatus('📝 Testing blog access...');
      const blogsResponse = await apiService.getBlogs();
      console.log('✅ Blogs access:', blogsResponse);
      
      setStatus('✅ Authentication successful!');
      
    } catch (error) {
      console.error('❌ Authentication test failed:', error);
      setStatus(`❌ Failed: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      setStatus('🔐 Attempting login...');
      const response = await apiService.login({
        username: 'admin',
        password: 'admin123'
      });
      console.log('✅ Login response:', response);
      setStatus('✅ Login successful!');
      setToken(apiService.getToken());
    } catch (error) {
      console.error('❌ Login failed:', error);
      setStatus(`❌ Login failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-4">
          <p className="mb-2"><strong>Status:</strong> {status}</p>
          <p className="mb-4"><strong>Token:</strong> {token ? 'Available' : 'Missing'}</p>
          
          <div className="space-y-2">
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Login
            </button>
            
            <button
              onClick={testAuthentication}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Test Authentication
            </button>
            
            <button
              onClick={() => {
                apiService.clearToken();
                setToken(null);
                setStatus('Token cleared');
              }}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Clear Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}