'use client';
import { usePathname } from 'next/navigation';
import Navbar from "./layout/navbar";
import Footer from "./layout/footer";
import BackToTop from "./layout/back-to-top";

export default function DynamicRouteHandler({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // If we're on an admin route, don't render navbar/footer
  if (isAdminRoute) {
    return (
      <div className="admin-route">
        {children}
      </div>
    );
  }

  // For non-admin routes, render everything normally
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}