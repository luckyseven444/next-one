"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";

const initialProducts = [
  { id: 1, name: "Product A", stock: 10 },
  { id: 2, name: "Product B", stock: 5 },
  { id: 3, name: "Product C", stock: 8 },
];

const ProductList = () => {
  const [products, setProducts] = useState(initialProducts);
  const { cart, addToCart, removeFromCart } = useCart();

  const handleAdd = (product) => {
    if (product.stock > 0) {
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id ? { ...p, stock: p.stock - 1 } : p
        )
      );
      addToCart(product);
    }
  };

  const handleRemove = (product) => {
    const cartItem = cart.find((item) => item.id === product.id);
    if (!cartItem || cartItem.qty <= 0) return;

    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock + 1 } : p
      )
    );
    removeFromCart(product.id);
  };

  // ✅ Function to update stock after checkout is successful
  const updateStockAfterCheckout = (checkedOutCart) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        const purchasedItem = checkedOutCart.find((item) => item.id === product.id);
        return purchasedItem
          ? { ...product, stock: product.stock - purchasedItem.qty }
          : product;
      })
    );
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id);
        const cartQty = cartItem ? cartItem.qty : 0;
        const isRemoveDisabled = cartQty === 0;

        return (
          <div key={product.id} className="border p-4 rounded shadow">
            <h3 className="font-bold">{product.name}</h3>
            <p>Stock: {product.stock}</p>
            <div className="flex gap-2 mt-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => handleAdd(product)}
                disabled={product.stock === 0}
              >
                +
              </button>
              <button
                className={`bg-red-500 text-white px-3 py-1 rounded ${
                  isRemoveDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handleRemove(product)}
                disabled={isRemoveDisabled}
              >
                -
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;

