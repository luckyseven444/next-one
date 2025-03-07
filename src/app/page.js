// import ProductList from "../components/ProductList";
// import Cart from "../components/Cart";
// import { CartProvider } from "../context/CartContext";

// export default function Home() {
//   return (
//     <CartProvider>
//       <Cart />
//       <div className="p-8">
//         <h1 className="text-2xl font-bold mb-4">Products</h1>
//         <ProductList />
//       </div>
//     </CartProvider>
//   );
// }
"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProductCrud from "../components/ProductCrud";
import Cart from "../components/Cart";
import ProductList from "@/components/ProductList";
import { CartProvider } from "../context/CartContext";
export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redirect to login if not logged in
    }
  }, [user, router]);

  if (!user) return null; // Prevent flashing content before redirect

  return user.role === "admin" ? <ProductCrud /> :  (<CartProvider>
         <Cart />
         <div className="p-8">
           <h1 className="text-2xl font-bold mb-4">Products</h1>
           <ProductList />
         </div>
       </CartProvider>);
}

