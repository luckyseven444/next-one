"use client";

import { useState } from "react";
import { useAuth } from "../../../../src/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Register() {
  const {user, setUser} = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" , password_confirmation: ""});
  const [error, setError] = useState("");
  const router = useRouter();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
    } catch (err) {
      setError(err.message);
    }
  };
  // 🔹 **Register Method**
  const register = async (credentials) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVER}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.data.token.access_token);
        setUser(data.data);
      }

      router.push("/");
    } catch (error) {
      console.error("Register Error:", error.message);
      return { error: error.message };
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
     
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" onChange={handleChange} required className="input" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="input" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="input" />
        <input name="password_confirmation" type="password" placeholder="password_confirmation" onChange={handleChange} required className="input" />
        
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
