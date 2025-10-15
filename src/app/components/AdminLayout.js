'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Services', href: '/admin/services', icon: '🛠️' },
    { name: 'Blogs', href: '/admin/blogs', icon: '📝' },
    { name: 'Gallery', href: '/admin/gallery', icon: '🖼️' },
    { name: 'Testimonials', href: '/admin/testimonials', icon: '⭐' },
    { name: 'Contact Us', href: '/admin/contact', icon: '📞' },
    { name: 'Setting', href: '/admin/settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Forever Security</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium"
          >
            <span className="text-xl mr-3">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              {menuItems.find(item => item.href === pathname)?.name || 'Dashboard'}
            </h1>
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back, Admin!</p>
              <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}