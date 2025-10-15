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
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);