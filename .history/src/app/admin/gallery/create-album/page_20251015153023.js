'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Upload, 
  Image as ImageIcon,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Folder
} from 'lucide-react';
import { apiService } from '@/app/lib/api';

export default function CreateAlbumPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
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
        setError('Album title is required');
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('is_active', formData.is_active ? 'true' : 'false');
      
      // Add cover image if selected
      const imageInput = document.getElementById('cover_image');
      if (imageInput.files[0]) {
        submitData.append('cover_image', imageInput.files[0]);
      }

      // Get token for authorization
      const token = apiService.getToken();
      if (!token) {
        setError('Please login first');
        router.push('/admin/login');
        return;
      }

      console.log('🔄 Creating album...');

      const response = await fetch('http://localhost:5000/api/gallery/albums', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const result = await response.json();
      console.log('📡 Server response:', result);

      if (response.ok) {
        setSuccess('Album created successfully!');
        setFormData({
          title: '',
          description: '',
          is_active: true
        });
        setImagePreview(null);
        
        // Reset file input
        const fileInput = document.getElementById('cover_image');
        if (fileInput) fileInput.value = '';
        
        // Redirect after success
        setTimeout(() => {
          router.push('/admin/gallery');
        }, 2000);
      } else {
        setError(result.error || 'Failed to create album');
      }
    } catch (error) {
      console.error('Error creating album:', error);
      setError('Network error. Please check if backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h1 className="text-3xl font-bold text-gray-900">Create New Album</h1>
              <p className="text-gray-600 mt-2">Create a new gallery album to organize your images</p>
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
            <h2 className="text-xl font-semibold text-gray-800">Album Details</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Cover Image (Optional)
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
                        const fileInput = document.getElementById('cover_image');
                        if (fileInput) fileInput.value = '';
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
                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="flex flex-col items-center justify-center gap-2">
                  <label htmlFor="cover_image" className="cursor-pointer">
                    <span className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Choose Cover Image
                    </span>
                    <input
                      id="cover_image"
                      name="cover_image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Album Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter album title"
                  required
                />
              </div>

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
                  placeholder="Describe the album (optional)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>
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
                    Creating Album...
                  </>
                ) : (
                  'Create Album'
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
          <h3 className="text-sm font-medium text-blue-800 mb-2">Album Guidelines</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Create albums to organize related images together</li>
            <li>• Add a cover image to make your album visually appealing</li>
            <li>• Use descriptive titles and descriptions</li>
            <li>• You can add images to the album after creation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}