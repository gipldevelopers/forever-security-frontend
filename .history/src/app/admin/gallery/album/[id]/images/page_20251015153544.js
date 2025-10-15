'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Eye,
  Image as ImageIcon,
  ArrowLeft,
  Upload,
  XCircle,
  CheckCircle,
  Folder
} from 'lucide-react';
import { apiService } from '@/app/lib/api';

export default function AlbumImagesPage() {
  const router = useRouter();
  const params = useParams();
  const albumId = params.id;
  
  const [album, setAlbum] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Add image modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_alt: '',
    is_active: true
  });

  useEffect(() => {
    if (albumId) {
      fetchAlbumData();
    }
  }, [albumId]);

  const fetchAlbumData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await apiService.getAlbumById(albumId);
      
      if (response && response.success) {
        setAlbum(response.data);
        setImages(response.data.images || []);
      } else {
        setError(response?.error || 'Failed to fetch album data');
      }
    } catch (error) {
      console.error('💥 Fetch album error:', error);
      setError('Network error. Please check if backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

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
        setUploadError('Please select an image file');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Image size should be less than 10MB');
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

  const handleAddImage = async (e) => {
    e.preventDefault();
    try {
      setUploadLoading(true);
      setUploadError('');
      setUploadSuccess('');

      const imageInput = document.getElementById('add_image');
      if (!imageInput.files[0]) {
        setUploadError('Please select an image file');
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('album_id', albumId);
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('image_alt', formData.image_alt.trim());
      submitData.append('is_active', formData.is_active ? 'true' : 'false');
      submitData.append('image', imageInput.files[0]);

      // Get token for authorization
      const token = apiService.getToken();
      if (!token) {
        setUploadError('Please login first');
        return;
      }

      console.log('🔄 Adding image to album...');

      const response = await fetch('http://localhost:5000/api/gallery/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const result = await response.json();
      console.log('📡 Server response:', result);

      if (response.ok) {
        setUploadSuccess('Image added successfully!');
        setFormData({
          title: '',
          description: '',
          image_alt: '',
          is_active: true
        });
        setImagePreview(null);
        
        // Reset file input
        const fileInput = document.getElementById('add_image');
        fileInput.value = '';
        
        // Refresh images list
        fetchAlbumData();
        
        // Close modal after delay
        setTimeout(() => {
          setShowAddModal(false);
        }, 2000);
      } else {
        setUploadError(result.error || 'Failed to add image');
      }
    } catch (error) {
      console.error('Error adding image:', error);
      setUploadError('Network error. Please check if backend server is running.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      setDeleteLoading(imageId);
      await apiService.deleteImage(imageId);
      fetchAlbumData();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePreview = (imageUrl) => {
    window.open(imageUrl, '_blank', 'width=800,height=600');
  };

  const resetAddModal = () => {
    setShowAddModal(false);
    setFormData({
      title: '',
      description: '',
      image_alt: '',
      is_active: true
    });
    setImagePreview(null);
    setUploadError('');
    setUploadSuccess('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-full mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading album data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-full mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Error Loading Album</h3>
                <p className="text-sm mt-1">{error}</p>
                <button 
                  onClick={fetchAlbumData}
                  className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Albums
          </Link>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-full mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
            Album not found
          </div>
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Albums
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Albums
          </Link>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{album.title}</h1>
              <p className="text-gray-600 mt-2">{album.description}</p>
              
              {/* Stats */}
              <div className="flex gap-4 mt-4 text-sm">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {images.length} images
                </span>
                <span className={`px-3 py-1 rounded-full ${
                  album.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {album.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchAlbumData}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Images
              </button>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        {images.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <ImageIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images in this album</h3>
            <p className="text-gray-500 mb-4">
              Start by adding images to this album
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Images
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
              >
                {/* Image */}
                <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden relative group">
                  {image.image_url ? (
                    <img
                      src={image.image_url}
                      alt={image.image_alt || image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Preview Button */}
                  <button
                    onClick={() => handlePreview(image.image_url)}
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <Eye className="w-8 h-8 text-white" />
                  </button>
                </div>
                
                <div className="p-4">
                  {/* Title */}
                  {image.title && (
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                      {image.title}
                    </h3>
                  )}
                  
                  {/* Description */}
                  {image.description && (
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                      {image.description}
                    </p>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handlePreview(image.image_url)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      disabled={deleteLoading === image.id}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors text-sm disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deleteLoading === image.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Image Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Add Image to Album</h2>
                  <button
                    onClick={resetAddModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleAddImage} className="p-6 space-y-6">
                {/* Messages */}
                {uploadError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    {uploadError}
                  </div>
                )}

                {uploadSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {uploadSuccess}
                  </div>
                )}

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Image *
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
                            const fileInput = document.getElementById('add_image');
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
                      <label htmlFor="add_image" className="cursor-pointer">
                        <span className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Choose Image
                        </span>
                        <input
                          id="add_image"
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

                {/* Image Details */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Title (Optional)
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter image title"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the image"
                    />
                  </div>

                  <div>
                    <label htmlFor="image_alt" className="block text-sm font-medium text-gray-700 mb-2">
                      Image Alt Text (Optional)
                    </label>
                    <input
                      type="text"
                      id="image_alt"
                      name="image_alt"
                      value={formData.image_alt}
                      onChange={handleInputChange}
                      className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Alternative text for accessibility"
                    />
                  </div>

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
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={uploadLoading}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploadLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Uploading Image...
                      </>
                    ) : (
                      'Add Image'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetAddModal}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium text-center"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}