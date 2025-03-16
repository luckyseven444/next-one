"use client";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import 'bootstrap/dist/css/bootstrap.css';
import BootstrapClient from '@/components/BootstrapClient.js';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <Layout>{children}</Layout>
    </AuthProvider>
  );
}

function Layout({ children }) {
  const { user } = useAuth();
  const pathname = usePathname(); // Get current route

  return (
    <html lang="en">
      <body className="container mx-auto p-4">
        <BootstrapClient />
        {!user ? (
          <>
          <div className="d-flex flex-row-reverse bd-highlight">
            {pathname === "/login" ? (
              <Link href="/register">Register</Link>
            ) : pathname === "/register" ? (
              <Link href="/login" className="mr-4">Login</Link>
            ) : (
              <>
                <Link href="/login" className="mr-4">Login</Link>
                <Link href="/register" className="px-2">Register</Link>
              </>
            )}
          </div>
          </>
        ) : (
          <Navbar />
        )
        }
        {children}
      </body>
    </html>
  );
}
