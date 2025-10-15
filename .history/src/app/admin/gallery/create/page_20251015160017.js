'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Upload, 
  Image as ImageIcon,
  ArrowLeft,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { apiService } from '@/app/lib/api';

export default function CreateGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_alt: '',
    category: 'General',
    is_active: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validation
      if (!formData.title.trim()) {
        setError('Title is required');
        return;
      }

      const imageInput = document.getElementById('image');
      if (!imageInput.files[0]) {
        setError('Please select an image file');
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('image_alt', formData.image_alt.trim());
      submitData.append('category', formData.category);
      submitData.append('is_active', formData.is_active ? 'true' : 'false');
      submitData.append('image', imageInput.files[0]);

      // Get token for authorization
      const token = apiService.getToken();
      if (!token) {
        setError('Please login first');
        router.push('/admin/login');
        return;
      }

      console.log('🔄 Uploading gallery image...');
      console.log('📦 FormData entries:');
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch('http://localhost:5000/api/gallery', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData - let browser set it with boundary
        },
        body: submitData
      });

      const result = await response.json();
      console.log('📡 Server response:', result);

      if (response.ok) {
        setSuccess('Gallery image created successfully!');
        setFormData({
          title: '',
          description: '',
          image_alt: '',
          category: 'General',
          is_active: true
        });
        setImagePreview(null);
        
        // Reset file input
        const fileInput = document.getElementById('image');
        fileInput.value = '';
        
        // Redirect after success
        setTimeout(() => {
          router.push('/admin/gallery');
        }, 2000);
      } else {
        setError(result.error || 'Failed to create gallery image');
      }
    } catch (error) {
      console.error('Error creating gallery image:', error);
      setError('Network error. Please check if backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Image</h1>
              <p className="text-gray-600 mt-2">Upload and configure a new gallery image</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Image Details</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Image Upload *
              </label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-48 w-auto rounded-lg border border-gray-300 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        const fileInput = document.getElementById('image');
                        fileInput.value = '';
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Upload Area */}
              <div className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:border-gray-400 ${imagePreview ? 'hidden' : ''}`}>
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="flex flex-col items-center justify-center gap-2">
                  <label htmlFor="image" className="cursor-pointer">
                    <span className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Choose Image
                    </span>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                  </label>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter image title"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="General">General</option>
                  <option value="Installation">Installation</option>
                  <option value="Systems">Systems</option>
                  <option value="Services">Services</option>
                  <option value="Products">Products</option>
                  <option value="Projects">Projects</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the image (optional)"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Image Alt Text */}
            <div>
              <label htmlFor="image_alt" className="block text-sm font-medium text-gray-700 mb-2">
                Image Alt Text
              </label>
              <input
                type="text"
                id="image_alt"
                name="image_alt"
                value={formData.image_alt}
                onChange={handleInputChange}
                className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Alternative text for accessibility (optional)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Important for SEO and accessibility
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active (Visible on website)
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading Image...
                  </>
                ) : (
                  'Upload Image'
                )}
              </button>
              <Link
                href="/admin/gallery"
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Image Guidelines</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use high-quality images with good resolution</li>
            <li>• Recommended size: 1200x800 pixels or similar aspect ratio</li>
            <li>• File formats: JPG, PNG, WebP</li>
            <li>• Maximum file size: 10MB</li>
            <li>• Add descriptive alt text for accessibility</li>
          </ul>
        </div>
      </div>
    </div>
  );
}