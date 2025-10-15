'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminLayout from '../components/AdminLayout';

export default function AdminRootLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (token && pathname === '/admin/login') {
      router.push('/admin/dashboard');
    }
    
    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <div>{children}</div>;
  }

  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}