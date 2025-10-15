'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tokenManager } from '../../utils/token';

export default function Dashboard() {
  const [stats, setStats] = useState({
    services: 0,
    blogs: 0,
    testimonials: 0,
    gallery: 0,
    contacts: 0
  });
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Check authentication first
        if (!tokenManager.isAuthenticated()) {
          window.location.href = '/admin/login';
          return;
        }

        // Test if backend is available first
        const testResponse = await fetch('http://localhost:5000/api/services', {
          method: 'GET',
          headers: tokenManager.getAuthHeaders(),
        });

        if (!testResponse.ok) {
          throw new Error('Backend not available');
        }

        setApiStatus('online');

        const responses = await Promise.all([
          fetch('http://localhost:5000/api/services', {
            headers: tokenManager.getAuthHeaders()
          }).then(res => res.json()),
          fetch('http://localhost:5000/api/blogs', {
            headers: tokenManager.getAuthHeaders()
          }).then(res => res.json()),
          fetch('http://localhost:5000/api/testimonials', {
            headers: tokenManager.getAuthHeaders()
          }).then(res => res.json()),
          fetch('http://localhost:5000/api/gallery', {
            headers: tokenManager.getAuthHeaders()
          }).then(res => res.json()),
          fetch('http://localhost:5000/api/contact', {
            headers: tokenManager.getAuthHeaders()
          }).then(res => res.json()),
        ]);

        const servicesData = responses[0];
        const blogsData = responses[1];
        const testimonialsData = responses[2];
        const galleryData = responses[3];
        const contactsData = responses[4];

        // Store blog data for display
        setBlogData(Array.isArray(blogsData) ? blogsData : []);

        setStats({
          services: Array.isArray(servicesData) ? servicesData.length : 0,
          blogs: Array.isArray(blogsData) ? blogsData.length : 0,
          testimonials: Array.isArray(testimonialsData) ? testimonialsData.length : 0,
          gallery: Array.isArray(galleryData) ? galleryData.length : 0,
          contacts: Array.isArray(contactsData) ? contactsData.length : 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setApiStatus('offline');
        // Set demo data when backend is not available
        setStats({
          services: 5,
          blogs: 3,
          testimonials: 8,
          gallery: 12,
          contacts: 15,
        });
        setBlogData([
          { id: 1, title: 'Home Security Tips', status: 'published', created_at: new Date().toISOString() },
          { id: 2, title: 'CCTV Installation Guide', status: 'draft', created_at: new Date().toISOString() },
          { id: 3, title: 'Fire Safety Measures', status: 'published', created_at: new Date().toISOString() }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      title: 'Total Services', 
      value: stats.services, 
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      link: '/admin/services',
      icon: '🛡️'
    },
    { 
      title: 'Blog Posts', 
      value: stats.blogs, 
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      link: '/admin/blogs',
      icon: '📝'
    },
    { 
      title: 'Testimonials', 
      value: stats.testimonials, 
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      link: '/admin/testimonials',
      icon: '💬'
    },
    { 
      title: 'Gallery Images', 
      value: stats.gallery, 
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      link: '/admin/gallery',
      icon: '🖼️'
    },
    { 
      title: 'Contact Messages', 
      value: stats.contacts, 
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      link: '/admin/contact',
      icon: '📧'
    },
  ];

  const recentContacts = [
    { name: 'John Doe', message: 'Security consultation needed', time: '2 hours ago', unread: true },
    { name: 'Jane Smith', message: 'Service inquiry', time: '5 hours ago', unread: true },
    { name: 'Mike Johnson', message: 'Emergency security assessment', time: '1 day ago', unread: false },
  ];

  const quickActions = [
    { title: 'Add Service', description: 'Create new security service', link: '/admin/services/create', color: 'bg-blue-500 hover:bg-blue-600', icon: '➕' },
    { title: 'Write Blog', description: 'Create new blog post', link: '/admin/blogs/create', color: 'bg-green-500 hover:bg-green-600', icon: '✏️' },
    { title: 'Add Testimonial', description: 'Add customer testimonial', link: '/admin/testimonials/create', color: 'bg-amber-500 hover:bg-amber-600', icon: '⭐' },
    { title: 'Upload Image', description: 'Add to gallery', link: '/admin/gallery/create', color: 'bg-purple-500 hover:bg-purple-600', icon: '📸' },
  ];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-amber-100 text-amber-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-blue-100 text-lg">Welcome to Forever Security Admin Panel</p>
            <p className="text-blue-200 text-sm mt-1">
              {apiStatus === 'online' ? 'Connected to backend API' : 'Running in demo mode'}
            </p>
          </div>
          {apiStatus === 'offline' && (
            <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Demo Mode
            </div>
          )}
        </div>
      </div>

      {/* API Status Warning */}
      {apiStatus === 'offline' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-amber-500 mr-3">⚠️</div>
            <div>
              <p className="text-amber-800 font-medium">Backend Server Offline</p>
              <p className="text-amber-700 text-sm">
                Using demo data. Make sure your backend is running on http://localhost:5000
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <Link 
            key={index} 
            href={stat.link}
            className="block transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className={`${stat.color} rounded-xl shadow-md p-6 text-white relative overflow-hidden`}>
              <div className="text-2xl absolute top-4 right-4 opacity-80">
                {stat.icon}
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium opacity-90">
                  {stat.title}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Blog Posts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Recent Blog Posts</h2>
              <Link 
                href="/admin/blogs"
                className="text-blue-500 hover:text-blue-600 font-medium text-sm"
              >
                View All ({stats.blogs})
              </Link>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {blogData.length > 0 ? (
              blogData.slice(0, 5).map((blog) => (
                <div 
                  key={blog.id} 
                  className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {blog.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(blog.status)}`}>
                          {blog.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>ID: {blog.id}</span>
                        <span>Created: {formatDate(blog.created_at)}</span>
                      </div>
                      {blog.excerpt && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {blog.excerpt}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/admin/blogs/edit/${blog.id}`}
                      className="ml-4 text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📝</div>
                <p>No blog posts found</p>
                <Link 
                  href="/admin/blogs/create"
                  className="text-blue-500 hover:text-blue-600 font-medium text-sm mt-2 inline-block"
                >
                  Create your first blog post
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Recent Contacts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.link}
                  className="block transform transition-all duration-300 hover:scale-105"
                >
                  <div className={`${action.color} text-white rounded-lg p-6 text-center shadow-sm hover:shadow-md relative overflow-hidden`}>
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <h3 className="font-semibold text-lg mb-2">
                      {action.title}
                    </h3>
                    <p className="text-white text-opacity-90 text-sm">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Contacts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Recent Contact Messages</h2>
                <Link 
                  href="/admin/contact"
                  className="text-blue-500 hover:text-blue-600 font-medium text-sm"
                >
                  View All
                </Link>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {recentContacts.map((contact, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    contact.unread 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-200'
                  } hover:shadow-sm`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                        {contact.unread && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{contact.message}</p>
                      <span className="text-xs text-gray-500">{contact.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`text-center p-4 rounded-lg border ${
            apiStatus === 'online' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className={`font-bold text-lg ${
              apiStatus === 'online' ? 'text-green-600' : 'text-amber-600'
            }`}>
              {apiStatus === 'online' ? 'Online' : 'Offline'}
            </div>
            <div className="text-gray-600 text-sm">API Server</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-green-600 font-bold text-lg">{stats.blogs}</div>
            <div className="text-gray-600 text-sm">Blog Posts</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-blue-600 font-bold text-lg">{stats.services}</div>
            <div className="text-gray-600 text-sm">Services</div>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-amber-600 font-bold text-lg">{stats.contacts}</div>
            <div className="text-gray-600 text-sm">Messages</div>
          </div>
        </div>

        {/* Authentication Status */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Authentication Status</p>
              <p className="text-xs text-gray-500">
                {tokenManager.isAuthenticated() ? 'Logged in successfully' : 'Not authenticated'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              tokenManager.isAuthenticated() 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {tokenManager.isAuthenticated() ? 'Authenticated' : 'Not Authenticated'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}