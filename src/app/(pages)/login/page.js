"use client";
import { useAuth } from "../../../../src/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
export default function Login() {
  const {user, setUser} = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();
    
  const handleChange = (e) => { 
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 **Login Method**
  const login = async (credentials) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVER}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      if (typeof window !== "undefined") { 
        localStorage.setItem("token", data.data.token.access_token);
        setUser(JSON.stringify(data.data))
      }
      
      router.push("/");
    } catch (error) {
      console.error("Login Error:", error.message);
      return { error: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    await login(form);
  };
  
  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          value={form.email}
          onChange={handleChange} 
          required 
          className="input" 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          value={form.password}
          onChange={handleChange} 
          required 
          className="input" 
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

