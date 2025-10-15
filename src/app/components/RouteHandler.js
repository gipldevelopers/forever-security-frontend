'use client';
import { usePathname } from 'next/navigation';
import Navbar from "./layout/navbar";
import Footer from "./layout/footer";
import BackToTop from "./layout/back-to-top";

export default function RouteHandler({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? 'admin-route' : ''}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <BackToTop />}
    </>
  );
}