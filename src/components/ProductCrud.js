"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProductCrud() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch products from backend
  useEffect( () => { 
    fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVER}/api/products/`).then((res) => res.json())
    .then((data) => setProducts(data.data));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle product creation/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId
      ? `${process.env.NEXT_PUBLIC_PRODUCT_SERVER}/api/products/${editingId}`
      : `${process.env.NEXT_PUBLIC_PRODUCT_SERVER}/api/products`;
  
    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
  
    if (res.ok) {
      const responseData = await res.json();
      const updatedProduct = responseData.data; // Extract the actual product object
  
      setProducts((prev) =>
        editingId
          ? prev.map((p) => (p.id === editingId ? updatedProduct : p)) // Replace updated product
          : [...prev, updatedProduct] // Add new product
      );
  
      setForm({ name: "", price: "", stock: "" });
      setEditingId(null);
    }
  };
  

  // Handle product deletion
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVER}/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Handle product edit selection
  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Product Management</h1>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      <ul className="list-group">
        {products.map((product) => (
          <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {product.name} - ${product.price} - Stock: {product.stock}
            </span>
            <div>
              <button onClick={() => handleEdit(product)} className="btn btn-warning btn-sm me-2">
                Edit
              </button>
              <button onClick={() => handleDelete(product.id)} className="btn btn-danger btn-sm">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
