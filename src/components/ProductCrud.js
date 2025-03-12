"use client";
import { useState, useEffect } from "react";

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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      <ul className="border-t pt-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex justify-between items-center p-2 border-b"
          >
            <span>
              {product.name} - ${product.price} - Stock: {product.stock}
            </span>
            <div>
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 text-white px-2 py-1 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-2 py-1"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
