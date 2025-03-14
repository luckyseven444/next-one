"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";

const Cart = ({ updateStockAfterCheckout }) => {
  const { cart, setCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(null)
  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty! Add items before checking out.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVER}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });

      const data = await response.json();

      if (data.success) {
        //updateStockAfterCheckout(cart); 
        setCart([...[]]);
        setMessage('Congrats! your checkout is successful')
      } else {
        setError(data.message || "Checkout failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="cart-container p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">{ message?message:'Your cart is empty.'} </p>
      ) : (
        <ul className="mb-4">
          {cart.map((item) => (
            <li key={item.id} className="flex justify-between border-b py-2">
              <span>{item.name} (x{item.qtyAddedToCart})</span>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Checkout button is always visible */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
        onClick={handleCheckout}
      >
        {loading ? "Processing..." : "Checkout"}
      </button>

      {/* ✅ Show validation error if the cart is empty */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default Cart;
