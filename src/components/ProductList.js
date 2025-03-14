"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { cart, addToCart, removeFromCart } = useCart();
  const [count, setCount] = useState([{id: null, val: null}]);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVER}/api/products/`, {
            method: "get"
          });

          const data = await res.json();
          setProducts(data.data);
          
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

    fetchData(); // Call the async function inside useEffect
  }, []);

  console.log('products in ProductList', products)

  const getValueById = (id) => {
    const item = count.find((item) => item.id === id);
    return item ? item.val : null;
  };

  const handleAdd = (product) => {
    setCount((prevCount) => {
      const existingItem = prevCount.find((item) => item.id === product.id);
      const newVal = existingItem ? existingItem.val + 1 : 1;
  
      return existingItem
        ? prevCount.map((item) =>
            item.id === product.id ? { ...item, val: newVal } : item
          )
        : [...prevCount, { id: product.id, val: 1 }];
    });
  
    if (product.stock > 0) {
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id ? { ...p, stock: p.stock - 1 } : p
        )
      );
      addToCart(product, getValueById(product.id) + 1);
    }
  };
  
  const handleRemove = (product) => {
    setCount((prevCount) => {
      const existingItem = prevCount.find((item) => item.id === product.id);
      if (!existingItem || existingItem.val <= 0) return prevCount;
  
      const newVal = existingItem.val - 1;
      return newVal > 0
        ? prevCount.map((item) =>
            item.id === product.id ? { ...item, val: newVal } : item
          )
        : prevCount.filter((item) => item.id !== product.id);
    });
  
    const cartItem = cart.find((item) => item.id === product.id);
    if (!cartItem || cartItem.stock <= 0) return;

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
        const cartQty = cartItem ? cartItem.stock : 0;
        const isAddDisabled = cartQty === 0;
        const isRemoveDisabled = getValueById(product.id) == null;
        return (
          <div key={product.id} className="border p-4 rounded shadow">
            <h3 className="font-bold">{product.name}</h3>
            <p>Stock: {product.stock}</p>
            <div className="flex gap-2 mt-2">
              <button
                className={`bg-red-500 text-white px-3 py-1 rounded ${
                  isAddDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
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

