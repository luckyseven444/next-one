"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProductCrud from "../components/ProductCrud";
import Cart from "../components/Cart";
import ProductList from "@/components/ProductList";
import { CartProvider } from "../context/CartContext";
export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => { console.log('user in home', user);
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);
  
  if (loading) return <p>Loading...</p>; 
  if (!user) return null; console.log('user.role in Home', user.role)
  return user.role === "admin" ? <ProductCrud /> :  
      (
      <CartProvider>
         <Cart />
         <div className="p-8">
           <h1 className="text-2xl font-bold mb-4">Products</h1>
           <ProductList />
         </div>
      </CartProvider>
      );
}

