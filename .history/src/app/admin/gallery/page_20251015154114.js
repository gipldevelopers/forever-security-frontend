'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Eye,
  Image as ImageIcon,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { apiService } from '@/app/lib/api';

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [filteredGallery, setFilteredGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    fetchGallery(pagination.currentPage);
  }, [pagination.currentPage]);

  useEffect(() => {
    const filtered = gallery.filter(item =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGallery(filtered);
  }, [searchTerm, gallery]);

  const fetchGallery = async (page = 1) => {
    try {
      setIsLoading(true);
      setError('');
      console.log('🔄 Fetching gallery from API...');
      
      const response = await apiService.getGallery(`?page=${page}&limit=12`);
      console.log('📡 Full API Response:', response);
      
      if (response && response.success) {
        console.log('✅ Response has success structure');
        
        if (response.pagination) {
          setGallery(response.data);
          setPagination(response.pagination);
        } else if (Array.isArray(response.data)) {
          setGallery(response.data);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: response.data.length,
            itemsPerPage: response.data.length,
            hasNextPage: false,
            hasPrevPage: false
          });
        } else {
          setGallery(response.data || []);
        }
      } else {
        const errorMessage = response?.error || response?.message || 'Failed to fetch gallery';
        console.error('❌ API Error:', errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('💥 Fetch gallery error:', error);
      setError(`Network error: ${error.message}. Please check if backend server is running.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (galleryId) => {
    if (!confirm('Are you sure you want to delete this gallery image?')) {
      return;
    }

    try {
      setDeleteLoading(galleryId);
      await apiService.deleteImage(galleryId);
      fetchGallery(pagination.currentPage);
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      alert('Failed to delete gallery image');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleToggleStatus = async (galleryId, currentStatus) => {
    try {
      setToggleLoading(galleryId);
      await apiService.request(`api/gallery/${galleryId}/toggle`, {
        method: 'PATCH'
      });
      fetchGallery(pagination.currentPage);
    } catch (error) {
      console.error('Error toggling gallery status:', error);
      alert('Failed to update gallery status');
    } finally {
      setToggleLoading(null);
    }
  };

  const handlePreview = (imageUrl, title) => {
    window.open(imageUrl, '_blank', 'width=800,height=600');
  };

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      goToPage(pagination.currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (pagination.hasPrevPage) {
      goToPage(pagination.currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    goToPage(1);
  };

  const goToLastPage = () => {
    goToPage(pagination.totalPages);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
              <p className="text-gray-600 mt-2">Manage your gallery images</p>
            </div>
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
              <p className="text-gray-600 mt-2">Manage your gallery images</p>
              
              {/* Stats */}
              <div className="flex gap-4 mt-4 text-sm">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Total: {pagination.totalItems} images
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Active: {gallery.filter(item => item.is_active).length}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchGallery(1)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <Link
                href="/admin/gallery/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Image
              </Link>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Error Loading Gallery</h3>
                <p className="text-sm mt-1">{error}</p>
                <button 
                  onClick={() => fetchGallery(1)}
                  className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        {gallery.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search gallery by title, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-gray-700 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {filteredGallery.length === 0 && !error ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <ImageIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gallery images found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first gallery image'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => fetchGallery(1)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <Link
                href="/admin/gallery/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Image
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
              {filteredGallery.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
                >
                  {/* Image */}
                  <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden relative group">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.image_alt || item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${item.image_url ? 'hidden' : ''}`}>
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    
                    {/* Preview Button */}
                    <button
                      onClick={() => handlePreview(item.image_url, item.title)}
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <Eye className="w-8 h-8 text-white" />
                    </button>
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title || 'Untitled Image'}
                    </h3>
                    
                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    
                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {item.category || 'General'}
                      </span>
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleToggleStatus(item.id, item.is_active)}
                        disabled={toggleLoading === item.id}
                        className={`inline-flex items-center gap-1 text-sm transition-colors ${
                          item.is_active 
                            ? 'text-green-600 hover:text-green-700' 
                            : 'text-gray-600 hover:text-gray-700'
                        } disabled:opacity-50`}
                      >
                        {toggleLoading === item.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : item.is_active ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                        {toggleLoading === item.id ? 'Updating...' : item.is_active ? 'Active' : 'Inactive'}
                      </button>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePreview(item.image_url, item.title)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteLoading === item.id}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors text-sm disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deleteLoading === item.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-end items-center space-x-4">
                {/* Page Info */}
                <div className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalItems} total images
                </div>
                
                {/* Pagination Controls */}
                <div className="flex items-center space-x-1">
                  {/* First Page */}
                  <button
                    onClick={goToFirstPage}
                    disabled={!pagination.hasPrevPage}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="First Page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Previous Page */}
                  <button
                    onClick={goToPrevPage}
                    disabled={!pagination.hasPrevPage}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map(page => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 rounded-lg border transition-colors ${
                        page === pagination.currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Page */}
                  <button
                    onClick={goToNextPage}
                    disabled={!pagination.hasNextPage}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={goToLastPage}
                    disabled={!pagination.hasNextPage}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Last Page"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}