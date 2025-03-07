// import { CartProvider } from "../context/CartContext";
// import { AuthProvider } from "../context/AuthContext";
// import Navbar from "../components/Navbar"; 
// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <AuthProvider> {/* ✅ Wrap AuthProvider first */}
//           <CartProvider> {/* ✅ CartProvider inside AuthProvider */}
//             <Navbar />
//             {children}
//           </CartProvider>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
// "use client";
// import { AuthProvider, useAuth } from "../context/AuthContext";
// import { usePathname } from "next/navigation";
// import Navbar from "../components/Navbar";
// import {CartProvider} from "../context/CartContext"; // Import CartProvider

// function DynamicProviders({ children }) {
//   const { user } = useAuth();
//   const pathname = usePathname();

//   // Define routes that require authentication
//   const protectedRoutes = ["/", "/checkout"]; // Add more as needed
//   const needsAuth = protectedRoutes.includes(pathname);
  
//   // Redirect if user is not logged in
//   if (needsAuth && !user) { console.log("Redirecting to login...");
//     if (typeof window !== "undefined") {
//       window.location.href = "/login"; // Redirect to login page
//     }
//     return null; // Prevent rendering
//   }
//   console.log('user check', user); 
//   // Define routes that need CartProvider
//   const cartRoutes = ["/", "/checkout"];
//   const useCartProvider = cartRoutes.includes(pathname);

//   return useCartProvider ? (
//     <CartProvider>{children}</CartProvider> // Wrap in CartProvider only if needed
//   ) : (
//     <>{children}</>
//   );
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <AuthProvider>
//           <DynamicProviders>
//             <Navbar /> {/* Navbar is always visible unless conditionally hidden elsewhere */}
//             {children}
//           </DynamicProviders>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

"use client";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import {CartProvider} from "../context/CartContext";
import ProductCrud from "../components/ProductCrud";

function DynamicProviders({ children }) {
  const { user } = useAuth();
  const pathname = usePathname();

  // Define routes that require authentication
  const protectedRoutes = ["/cart", "/checkout"];
  const needsAuth = protectedRoutes.includes(pathname);

  // Redirect if user is not logged in
  if (needsAuth && !user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  // If user is admin, load ProductCrud
  if (user?.role === "admin" && pathname === "/") {
    return <ProductCrud />;
  }

  // If user is a regular user, load CartProvider
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
          <DynamicProviders>
            <Navbar />
            {children}
          </DynamicProviders>
        </AuthProvider>
      </body>
    </html>
  );
}

