"use client";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <Layout>{children}</Layout>
    </AuthProvider>
  );
}

function Layout({ children }) {
  const { user } = useAuth();

  return (
    <html lang="en">
      <body>
        {!user ? (
          <>
            <Link href="/login" className="mr-4">Login</Link>
            <Link href="/register">Register</Link>
          </>
        ) : <Navbar />}
        {children}
      </body>
    </html>
  );
}
