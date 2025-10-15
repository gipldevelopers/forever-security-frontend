'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Eye,
  Image as ImageIcon,
  Folder,
  Search,
  RefreshCw
} from 'lucide-react';
import { apiService } from '@/app/lib/api';

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  useEffect(() => {
    const filtered = albums.filter(album =>
      album.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAlbums(filtered);
  }, [searchTerm, albums]);

  const fetchAlbums = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await apiService.getAlbums();
      
      if (response && response.success) {
        setAlbums(response.data);
        setFilteredAlbums(response.data);
      } else {
        setError(response?.error || 'Failed to fetch albums');
      }
    } catch (error) {
      console.error('💥 Fetch albums error:', error);
      setError('Network error. Please check if backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (albumId) => {
    if (!confirm('Are you sure you want to delete this album? All images in this album will also be deleted.')) {
      return;
    }

    try {
      setDeleteLoading(albumId);
      await apiService.deleteAlbum(albumId);
      fetchAlbums();
    } catch (error) {
      console.error('Error deleting album:', error);
      alert('Failed to delete album');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePreview = (albumId) => {
    window.open(`/gallery/${albumId}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gallery Albums</h1>
              <p className="text-gray-600 mt-2">Manage your gallery albums and images</p>
            </div>
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
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
      <div className="max-w-full mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gallery Albums</h1>
              <p className="text-gray-600 mt-2">Manage your gallery albums and images</p>
              
              {/* Stats */}
              <div className="flex gap-4 mt-4 text-sm">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Total: {albums.length} albums
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Images: {albums.reduce((sum, album) => sum + album.image_count, 0)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchAlbums}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <Link
                href="/admin/gallery/create-album"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Album
              </Link>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Error Loading Albums</h3>
                <p className="text-sm mt-1">{error}</p>
                <button 
                  onClick={fetchAlbums}
                  className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        {albums.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search albums by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-gray-700 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Albums Grid */}
        {filteredAlbums.length === 0 && !error ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Folder className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No albums found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first album'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={fetchAlbums}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <Link
                href="/admin/gallery/create-album"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Album
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
            {filteredAlbums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
              >
                {/* Album Cover */}
                <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden relative group">
                  {album.cover_image ? (
                    <img
                      src={album.cover_image}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Folder className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Image Count Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded-full">
                      {album.image_count} images
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {album.title}
                  </h3>
                  
                  {/* Description */}
                  {album.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {album.description}
                    </p>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePreview(album.id)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <Link
                        href={`/admin/gallery/album/${album.id}/images`}
                        className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors text-sm"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Manage
                      </Link>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(album.id)}
                        disabled={deleteLoading === album.id}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors text-sm disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deleteLoading === album.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}