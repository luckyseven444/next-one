"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, qty) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, stock: item.stock + 1, qtyAddedToCart: qty } : item
        );
      }
      return [...prevCart, { ...product, stock: 1, qtyAddedToCart: qty }];
    });
  };
  
  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { 
                ...item, 
                stock: item.stock - 1, 
                qtyAddedToCart: Math.max((item.qtyAddedToCart || 0) - 1, 0) 
              }
            : item
        )
        .filter((item) => item.qtyAddedToCart > 0) 
    );
  };
  
  return (
    <CartContext.Provider value={{ cart, setCart,addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
