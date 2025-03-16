"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";

const Cart = () => {
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
    <div
      className="position-fixed top-0 end-0 m-3 p-3 bg-light border rounded shadow"
      style={{ width: "300px", zIndex: 1050 }}
    >
      <h2 className="fw-bold mb-3 fs-5">Cart</h2>

      {cart.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <ul className="list-unstyled mb-3">
          {cart.map((item) => (
            <li key={item.id} className="d-flex justify-content-between border-bottom py-2">
              <span>{item.name} (x{item.qtyAddedToCart})</span>
            </li>
          ))}
        </ul>
      )}

      <button
        className="btn btn-success w-100"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? "Processing..." : "Checkout"}
      </button>

      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
};

export default Cart;
