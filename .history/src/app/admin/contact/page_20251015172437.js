'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  Mail,
  User,
  Phone,
  MessageCircle,
  Calendar,
  RefreshCw,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Database,
  AlertCircle
} from 'lucide-react';
import { apiService } from '@/app/lib/api';

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('🔄 Fetching contact submissions from API...');
      const response = await apiService.getContactSubmissions();
      console.log('📧 Full API Response:', response);
      
      if (response && response.success) {
        console.log(`✅ Loaded ${response.data.length} submissions`);
        setSubmissions(response.data);
      } else {
        const errorMsg = response?.error || 'Failed to load contact submissions';
        console.error('❌ API Error:', errorMsg);
        setError(errorMsg);
        setSubmissions([]);
      }
    } catch (error) {
      console.error('💥 Fetch contact submissions error:', error);
      setError('Failed to load contact submissions. Please check if backend is running.');
      setSubmissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (submissionId) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) {
      return;
    }

    try {
      setDeleteLoading(submissionId);
      await apiService.deleteContact(submissionId);
      fetchSubmissions();
    } catch (error) {
      console.error('Error deleting contact submission:', error);
      alert('Failed to delete contact submission');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
  };

  const closeModal = () => {
    setSelectedSubmission(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-green-100 text-green-800';
      case 'replied':
        return 'bg-purple-100 text-purple-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <Clock className="w-4 h-4" />;
      case 'read':
        return <Eye className="w-4 h-4" />;
      case 'replied':
        return <CheckCircle className="w-4 h-4" />;
      case 'closed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Test database connection
  const testDatabase = async () => {
    try {
      const response = await fetch('http://localhost:5000/test-contact-db');
      const result = await response.json();
      console.log('🧪 Database test result:', result);
      alert(`Database Test Result:\nTable exists: ${result.tableExists}\nSubmissions count: ${result.submissionsCount}`);
    } catch (error) {
      console.error('Database test failed:', error);
      alert('Database test failed. Check console for details.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
              <p className="text-gray-600 mt-2">Manage contact form submissions</p>
            </div>
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>

          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
              <p className="text-gray-600 mt-2">
                {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={testDatabase}
                className="inline-flex items-center gap-2 px-4 py-2 border border-yellow-300 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm"
                title="Test Database Connection"
              >
                <Database className="w-4 h-4" />
                Test DB
              </button>
              <button
                onClick={fetchSubmissions}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium">Error Loading Submissions</h3>
                <p className="text-sm mt-1">{error}</p>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={fetchSubmissions}
                    className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={testDatabase}
                    className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
                  >
                    Test Database
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Database className="w-4 h-4" />
            <span>Backend URL: http://localhost:5000/api/contact</span>
          </div>
        </div>

        {/* Submissions List */}
        {submissions.length === 0 && !error ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Mail className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contact submissions</h3>
            <p className="text-gray-500 mb-6">
              Contact form submissions will appear here when users submit the contact form.
            </p>
            
            <div className="bg-yellow-50 rounded-lg p-4 max-w-md mx-auto text-left">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Troubleshooting Steps:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>1. Check if backend server is running on port 5000</li>
                <li>2. Verify the contact_submissions table exists in database</li>
                <li>3. Test the contact form to create a submission</li>
                <li>4. Click "Test DB" button above to check database connection</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Contact Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {submission.name}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(submission.status)}`}>
                              {getStatusIcon(submission.status)}
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <a 
                                href={`mailto:${submission.email}`}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {submission.email}
                              </a>
                            </div>
                            
                            {submission.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                <a 
                                  href={`tel:${submission.phone}`}
                                  className="hover:text-blue-600 transition-colors"
                                >
                                  {submission.phone}
                                </a>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(submission.created_at)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {submission.subject}
                            </h4>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {submission.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:gap-3">
                      <button
                        onClick={() => handleViewDetails(submission)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        View Details
                      </button>
                      
                      <button
                        onClick={() => handleDelete(submission.id)}
                        disabled={deleteLoading === submission.id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                      >
                        {deleteLoading === submission.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Submission Details Modal */}
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contact Submission Details</h2>
                    <p className="text-gray-600 mt-1">
                      Submitted on {formatDate(selectedSubmission.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <p className="text-gray-900">{selectedSubmission.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <a 
                          href={`mailto:${selectedSubmission.email}`}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          {selectedSubmission.email}
                        </a>
                      </div>
                      {selectedSubmission.phone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <a 
                            href={`tel:${selectedSubmission.phone}`}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            {selectedSubmission.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Submission Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-2 w-fit ${getStatusColor(selectedSubmission.status)}`}>
                          {getStatusIcon(selectedSubmission.status)}
                          {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <p className="text-gray-900 font-medium">{selectedSubmission.subject}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Message</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedSubmission.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    handleDelete(selectedSubmission.id);
                    closeModal();
                  }}
                  disabled={deleteLoading === selectedSubmission.id}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteLoading === selectedSubmission.id ? 'Deleting...' : 'Delete Submission'}
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}