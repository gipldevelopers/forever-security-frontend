'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '@/app/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    services: 0,
    blogs: 0,
    testimonials: 0,
    gallery: 0,
    contacts: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [systemStatus, setSystemStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up interval to refresh activities every 20 seconds
    const interval = setInterval(() => {
      fetchRecentActivities();
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Test API connection first
      try {
        const testResult = await apiService.getAllBlogs();
        if (testResult && (testResult.success || Array.isArray(testResult.data))) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (error) {
        console.log('API test failed, using demo mode');
        setApiStatus('offline');
        setDemoData();
        setLoading(false);
        return;
      }

      // Fetch all data in parallel
      await Promise.all([
        fetchStats(),
        fetchRecentActivities(),
        fetchSystemStatus()
      ]);

    } catch (error) {
      console.error('Error in dashboard:', error);
      setApiStatus('offline');
      setDemoData();
    } finally {
      setLoading(false);
      setLastUpdate(new Date());
    }
  };

  const fetchStats = async () => {
    try {
      const statsResponse = await apiService.getDashboardStats();
      if (statsResponse && statsResponse.success) {
        console.log('✅ Using dashboard stats from /api/dashboard/stats');
        setStats(statsResponse.data);
      } else {
        await fetchFallbackStats();
      }
    } catch (error) {
      console.log('❌ Dashboard stats failed, trying fallback');
      await fetchFallbackStats();
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const activitiesResponse = await apiService.getRecentActivities();
      if (activitiesResponse && activitiesResponse.success) {
        console.log(`✅ Loaded ${activitiesResponse.data.length} recent activities`);
        setRecentActivities(activitiesResponse.data);
      } else {
        setRecentActivities(getDemoActivities());
      }
    } catch (error) {
      console.log('Recent activities failed, using demo data');
      setRecentActivities(getDemoActivities());
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const statusResponse = await apiService.getSystemStatus();
      if (statusResponse && statusResponse.success) {
        setSystemStatus(statusResponse.data);
      }
    } catch (error) {
      console.log('System status failed, using default');
      setSystemStatus({ database: 'unknown', tables: 0 });
    }
  };

  const fetchFallbackStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://forever-security-backend.onrender.com/'}/api/admin/dashboard`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('✅ Using fallback dashboard data from /api/admin/dashboard');
          setStats(data.data);
          return;
        }
      }
    } catch (error) {
      console.log('Fallback dashboard also failed');
    }

    // If all else fails, use demo data
    setStats({
      services: 5,
      blogs: 3,
      testimonials: 8,
      gallery: 12,
      contacts: 15,
    });
  };

  const setDemoData = () => {
    setStats({
      services: 5,
      blogs: 3,
      testimonials: 8,
      gallery: 12,
      contacts: 15,
    });
    setRecentActivities(getDemoActivities());
    setSystemStatus({ database: 'connected', tables: 15, api: 'online' });
  };

  const getDemoActivities = () => [
    {
      id: 1,
      type: 'service',
      title: 'New service created: Home Security System',
      description: 'Service added to the system',
      time: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      status: 'created',
      action: 'view',
      link: '/admin/services'
    },
    {
      id: 2,
      type: 'blog',
      title: 'New blog created: Security Tips 2024',
      description: 'Status: published',
      time: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      status: 'published',
      action: 'edit',
      link: '/admin/blogs'
    },
    {
      id: 3,
      type: 'testimonial',
      title: 'New testimonial: Jane Smith',
      description: 'Status: approved',
      time: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      status: 'approved',
      action: 'review',
      link: '/admin/testimonials'
    },
    {
      id: 4,
      type: 'gallery',
      title: 'New image uploaded',
      description: 'security-camera-installation.jpg',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'uploaded',
      action: 'view',
      link: '/admin/gallery'
    },
    {
      id: 5,
      type: 'contact',
      title: 'New contact form: John Doe',
      description: 'Status: new',
      time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: 'new',
      action: 'view',
      link: '/admin/contact'
    },
    {
      id: 6,
      type: 'service',
      title: 'Service updated: CCTV Installation',
      description: 'Service updated in the system',
      time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'updated',
      action: 'view',
      link: '/admin/services'
    }
  ];

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = (now - time) / (1000 * 60);
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return `${Math.floor(diffInDays)} days ago`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
      case 'created':
      case 'uploaded':
        return 'bg-blue-500';
      case 'published':
      case 'approved':
        return 'bg-green-500';
      case 'updated':
        return 'bg-purple-500';
      case 'pending':
      case 'draft':
        return 'bg-amber-500';
      case 'deleted':
        return 'bg-red-500';
      case 'read':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new':
        return 'New';
      case 'created':
        return 'Created';
      case 'published':
        return 'Published';
      case 'approved':
        return 'Approved';
      case 'updated':
        return 'Updated';
      case 'uploaded':
        return 'Uploaded';
      case 'pending':
        return 'Pending';
      case 'draft':
        return 'Draft';
      case 'deleted':
        return 'Deleted';
      case 'read':
        return 'Read';
      default:
        return status;
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'view':
        return 'View';
      case 'edit':
        return 'Edit';
      case 'review':
        return 'Review';
      default:
        return 'View';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'service':
        return '🛡️';
      case 'blog':
        return '📝';
      case 'testimonial':
        return '⭐';
      case 'gallery':
        return '🖼️';
      case 'contact':
        return '📧';
      case 'system':
        return '⚙️';
      default:
        return '📋';
    }
  };

  const statCards = [
    { 
      title: 'Total Services', 
      value: stats.services, 
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      link: '/admin/services'
    },
    { 
      title: 'Blog Posts', 
      value: stats.blogs, 
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      link: '/admin/blogs'
    },
    { 
      title: 'Testimonials', 
      value: stats.testimonials, 
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      link: '/admin/testimonials'
    },
    { 
      title: 'Gallery Images', 
      value: stats.gallery, 
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      link: '/admin/gallery'
    },
    { 
      title: 'Contact Messages', 
      value: stats.contacts, 
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      link: '/admin/contact'
    },
  ];

  const quickActions = [
    { 
      title: 'Add Service', 
      description: 'Create new security service', 
      link: '/admin/services/create', 
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    { 
      title: 'Write Blog', 
      description: 'Create new blog post', 
      link: '/admin/blogs/create', 
      color: 'bg-green-500 hover:bg-green-600'
    },
    { 
      title: 'Add Testimonial', 
      description: 'Add customer testimonial', 
      link: '/admin/testimonials/create', 
      color: 'bg-amber-500 hover:bg-amber-600'
    },
    { 
      title: 'Upload Image', 
      description: 'Add to gallery', 
      link: '/admin/gallery/create', 
      color: 'bg-purple-500 hover:bg-purple-600'
    },
  ];

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
              {apiStatus === 'online' ? 'Connected to live data' : 'Running in demo mode'}
              {lastUpdate && ` • Last updated: ${lastUpdate.toLocaleTimeString()}`}
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
                Using demo data. Make sure your backend is running on {process.env.NEXT_PUBLIC_API_URL || 'https://forever-security-backend.onrender.com/'}
              </p>
              <button
                onClick={fetchDashboardData}
                className="mt-2 text-amber-700 hover:text-amber-800 font-medium text-sm"
              >
                Retry Connection
              </button>
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
            <div className={`${stat.color} rounded-xl shadow-md p-6 text-white`}>
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
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  Auto-refresh in 20s
                </span>
                <button 
                  onClick={fetchRecentActivities}
                  className="text-blue-500 hover:text-blue-600 font-medium text-sm"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 bg-white"
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-lg mt-1">
                      {getTypeIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                          {activity.title}
                        </h3>
                        <span className={`${getStatusColor(activity.status)} text-white text-xs px-2 py-1 rounded-full whitespace-nowrap`}>
                          {getStatusText(activity.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatTime(activity.time)}
                        </span>
                        {activity.link && (
                          <Link 
                            href={activity.link}
                            className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                          >
                            {getActionText(activity.action)} →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activities found</p>
                <button 
                  onClick={fetchRecentActivities}
                  className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
                >
                  Check for new activities
                </button>
              </div>
            )}
          </div>
        </div>

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
                <div className={`${action.color} text-white rounded-lg p-6 text-center shadow-sm hover:shadow-md`}>
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
          <div className={`text-center p-4 rounded-lg border ${
            systemStatus.database === 'connected'
              ? 'bg-green-50 border-green-200'
              : systemStatus.database === 'disconnected'
              ? 'bg-red-50 border-red-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className={`font-bold text-lg ${
              systemStatus.database === 'connected' ? 'text-green-600' : 
              systemStatus.database === 'disconnected' ? 'text-red-600' : 'text-amber-600'
            }`}>
              {systemStatus.database === 'connected' ? 'Connected' : 
               systemStatus.database === 'disconnected' ? 'Disconnected' : 'Unknown'}
            </div>
            <div className="text-gray-600 text-sm">Database</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-blue-600 font-bold text-lg">Active</div>
            <div className="text-gray-600 text-sm">Admin Panel</div>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-amber-600 font-bold text-lg">
              {systemStatus.tables || 'N/A'} Tables
            </div>
            <div className="text-gray-600 text-sm">Database</div>
          </div>
        </div>
        {systemStatus.timestamp && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Last updated: {new Date(systemStatus.timestamp).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}