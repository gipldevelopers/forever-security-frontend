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
    submitData.append('is_active', formData.is_active.toString());
    submitData.append('image', imageInput.files[0]);

    // Get token for authorization
    const token = apiService.getToken();
    if (!token) {
      setError('Please login first');
      router.push('/admin/login');
      return;
    }

    console.log('🔄 Uploading gallery image...');

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