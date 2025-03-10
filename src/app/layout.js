"use client";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import {CartProvider} from "../context/CartContext";
import ProductCrud from "../components/ProductCrud";

function DynamicProviders({ children }) { 
  const { user, loading } = useAuth(); // Access `loading`
  const pathname = usePathname();
  
  if (loading) return <p>Loading...</p>; // Prevent rendering before `user` is fetched

  const protectedRoutes = ["/cart", "/checkout"];
  const needsAuth = protectedRoutes.includes(pathname);

  if (needsAuth && !user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  if (user?.role === "admin" && pathname === "/") {
    return <ProductCrud />;
  }

  return user?.role === "user" ? (
    <CartProvider>{children}</CartProvider>
  ) : (
    <>{children}</>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider> 
          <Navbar /> {/* Navbar should have access to AuthContext */}
          <DynamicProviders>
            {children}
          </DynamicProviders>
        </AuthProvider>
      </body>
    </html>
  );
}

