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
        setUser(data.data)
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
    <div className="max-w-md mx-auto mt-5 p-4 border rounded shadow">
      <h2 className="text-xl fs-5 mb-3">Login</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <button className="btn btn-success w-100" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

