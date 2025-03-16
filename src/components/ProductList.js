"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";

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
  
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 fs-5">Product List</h2>
      <div className="row">
        {products.map((product) => {
          const cartItem = cart.find((item) => item.id === product.id);
          const cartQty = cartItem ? cartItem.qty : 0;
          const isRemoveDisabled = cartQty === 0;

          return (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">Stock: {product.stock}</p>
                  <p className="card-text">Price: {product.price}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAdd(product)}
                      disabled={product.stock === 0}
                    >
                      +
                    </button>
                    <span className="fw-bold">{cartQty}</span>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemove(product)}
                      disabled={isRemoveDisabled}
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;

