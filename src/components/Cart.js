// "use client";

// import { useState } from "react";
// import { useCart } from "../context/CartContext";

// const Cart = () => {
//   const { cart } = useCart();
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="fixed top-4 right-4">
//       <button
//         onClick={() => setOpen(!open)}
//         className="relative bg-gray-800 text-white p-2 rounded-full"
//       >
//         🛒 ({cart.reduce((sum, item) => sum + item.qty, 0)})
//       </button>

//       {open && (
//         <div className="absolute right-0 bg-white shadow-lg p-4 mt-2 rounded w-64">
//           <h3 className="font-bold">Cart</h3>
//           {cart.length === 0 ? (
//             <p>Cart is empty</p>
//           ) : (
//             cart.map((item) => (
//               <div key={item.id} className="flex justify-between p-2 border-b">
//                 <span>{item.name} x {item.qty}</span>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;

// "use client";

// import { useState } from "react";
// import { useCart } from "../context/CartContext";

// const Cart = ({ updateStockAfterCheckout }) => {
//   const { cart, setCart } = useCart();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleCheckout = async () => {
//     if (cart.length === 0) {
//       setError("Your cart is empty! Add items before checking out.");
//       return;
//     }
  
//     setLoading(true);
//     setError("");
  
//     try {
//       const response = await fetch("/api/checkout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ cart }),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         updateStockAfterCheckout(cart); // ✅ Stock updates after checkout
//         setCart([]); // ✅ Clear cart
//       } else {
//         setError(data.message || "Checkout failed.");
//       }
//     } catch (err) {
//       setError("Something went wrong.");
//     }
  
//     setLoading(false);
//   };
  
  

//   return (
//     <div className="fixed top-4 right-4">
//       <button
//         className="relative bg-gray-800 text-white p-2 rounded-full"
//       >
//         🛒 ({cart.reduce((sum, item) => sum + item.qty, 0)})
//       </button>

//       <div className="absolute right-0 bg-white shadow-lg p-4 mt-2 rounded w-64">
//         <h3 className="font-bold">Cart</h3>
//         {cart.length === 0 ? (
//           <p>Cart is empty</p>
//         ) : (
//           cart.map((item) => (
//             <div key={item.id} className="flex justify-between p-2 border-b">
//               <span>{item.name} x {item.qty}</span>
//             </div>
//           ))
//         )}

//         {error && <p className="text-red-500">{error}</p>}

//         {cart.length > 0 && (
//           <button
//           className={`bg-green-500 text-white px-4 py-2 mt-4 rounded w-full ${
//             cart.length === 0 ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           onClick={handleCheckout}
//           disabled={loading || cart.length === 0}
//         >
//           {loading ? "Processing..." : "Checkout"}
//         </button>
        
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;

"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";

const Cart = ({ updateStockAfterCheckout }) => {
  const { cart, setCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty! Add items before checking out.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });

      const data = await response.json();

      if (response.ok) {
        updateStockAfterCheckout(cart); // ✅ Updates stock correctly
        setCart([]); // ✅ Clear cart after checkout
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
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <ul className="mb-4">
          {cart.map((item) => (
            <li key={item.id} className="flex justify-between border-b py-2">
              <span>{item.name} (x{item.qty})</span>
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
