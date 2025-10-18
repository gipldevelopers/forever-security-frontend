'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { tokenManager } from '../../../utils/token';

export default function CreateService() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    features: [''],
    key_benefits: [''],
    implementation_process: [''],
    seo_title: '',
    seo_description: '',
    seo_keywords: ''
  });

  // Check authentication on component mount
  useState(() => {
    if (!tokenManager.isAuthenticated()) {
      router.push('/admin/login');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // Check authentication
      if (!tokenManager.isAuthenticated()) {
        setError('Please login first');
        router.push('/admin/login');
        return;
      }

      // Filter out empty items from arrays
      const filteredFeatures = formData.features.filter(item => item.trim() !== '');
      const filteredBenefits = formData.key_benefits.filter(item => item.trim() !== '');
      const filteredProcess = formData.implementation_process.filter(item => item.trim() !== '');

      const serviceData = {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        features: filteredFeatures,
        key_benefits: filteredBenefits,
        implementation_process: filteredProcess,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
        seo_keywords: formData.seo_keywords
      };

      const response = await fetch('https://forever-security-backend.onrender.com//api/services', {
        method: 'POST',
        headers: tokenManager.getAuthHeaders(),
        body: JSON.stringify(serviceData)
      });

      if (response.status === 401) {
        tokenManager.clearToken();
        router.push('/admin/login');
        return;
      }

      const result = await response.json();

      if (response.ok) {
        router.push('/admin/services');
      } else {
        setError(result.error || 'Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      setError('Error creating service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generic functions to handle dynamic arrays
  const addArrayItem = (fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: [...formData[fieldName], '']
    });
  };

  const updateArrayItem = (fieldName, index, value) => {
    const newArray = [...formData[fieldName]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [fieldName]: newArray
    });
  };

  const removeArrayItem = (fieldName, index) => {
    if (formData[fieldName].length > 1) {
      const newArray = formData[fieldName].filter((_, i) => i !== index);
      setFormData({
        ...formData,
        [fieldName]: newArray
      });
    }
  };

  // Auto-generate SEO fields based on title
  const generateSEOFields = (title) => {
    if (title && !formData.seo_title) {
      setFormData(prev => ({
        ...prev,
        seo_title: `${title} | Forever Security`,
        seo_description: `Professional ${title.toLowerCase()} services with comprehensive security solutions. Protect your assets with our expert ${title.toLowerCase()} systems.`,
        seo_keywords: `${title.toLowerCase()}, security systems, protection services, ${title.toLowerCase()} solutions`
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create New Service</h1>
          <p className="text-gray-600 mt-2">Add a new security service to your offerings</p>
        </div>
        <Link
          href="/admin/services"
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          Back to Services
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Service Creation Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Service Details</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    generateSEOFields(e.target.value);
                  }}
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., CCTV Surveillance"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Icon
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="📹 (emoji)"
                />
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="text-sm text-gray-500">Popular icons:</span>
                  {['📹', '🔑', '👮', '🚨', '🔥', '🔒', '📊', '🎫', '🏠', '🏢', '🛡️', '📱'].map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-lg p-1 rounded transition-colors ${
                        formData.icon === icon ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-100'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="6"
                className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the service in detail. Include key benefits, features, and what customers can expect."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>
          </div>

          {/* Key Features Section */}
          <DynamicArraySection
            title="Key Features"
            fieldName="features"
            items={formData.features}
            onAdd={() => addArrayItem('features')}
            onUpdate={(index, value) => updateArrayItem('features', index, value)}
            onRemove={(index) => removeArrayItem('features', index)}
            placeholder="e.g., 24/7 Professional Monitoring"
          />

          {/* Key Benefits Section */}
          <DynamicArraySection
            title="Key Benefits"
            fieldName="key_benefits"
            items={formData.key_benefits}
            onAdd={() => addArrayItem('key_benefits')}
            onUpdate={(index, value) => updateArrayItem('key_benefits', index, value)}
            onRemove={(index) => removeArrayItem('key_benefits', index)}
            placeholder="e.g., Protect your family and belongings"
          />

          {/* Implementation Process Section */}
          <DynamicArraySection
            title="Implementation Process"
            fieldName="implementation_process"
            items={formData.implementation_process}
            onAdd={() => addArrayItem('implementation_process')}
            onUpdate={(index, value) => updateArrayItem('implementation_process', index, value)}
            onRemove={(index) => removeArrayItem('implementation_process', index)}
            placeholder="e.g., Free Security Assessment"
          />

          {/* SEO Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">SEO Settings</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title *
                </label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Professional CCTV Surveillance Systems | Forever Security"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.seo_title.length}/60 characters (Recommended for SEO)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description *
                </label>
                <textarea
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  rows="3"
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description for search engines (155-160 characters recommended)"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.seo_description.length}/160 characters (Recommended for SEO)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={formData.seo_keywords}
                  onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., cctv surveillance, security cameras, home security systems"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate keywords with commas
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Service...
                </>
              ) : (
                'Create Service'
              )}
            </button>
            <Link
              href="/admin/services"
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable component for dynamic arrays (Features, Benefits, Process)
function DynamicArraySection({ title, fieldName, items, onAdd, onUpdate, onRemove, placeholder }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {title}
        </label>
        <button
          type="button"
          onClick={onAdd}
          className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1"
        >
          <span>+</span>
          Add {title.split(' ').pop()}
        </button>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 items-center">
            <div className="flex-1 flex gap-3">
              <span className="text-gray-500 w-6 text-sm">{index + 1}.</span>
              <input
                type="text"
                value={item}
                onChange={(e) => onUpdate(index, e.target.value)}
                className="flex-1 text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={placeholder}
              />
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="px-3 py-2 text-red-500 hover:text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Add {title.toLowerCase()} that will be displayed on the service details page
      </p>
    </div>
  );
}