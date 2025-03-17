"use client";

import { useState } from "react";
import { useAuth } from "../../../../src/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Register() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        setError(data.message || "Registration failed"); // Set error message in state
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.data.token.access_token);
        setUser(data.data);
      }

      router.push("/");
    } catch (error) {
      console.error("Registration Error:", error.message);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors before submit
    await register(form);
  };

  return (
    <div className="max-w-md mx-auto mt-5 p-4 border rounded shadow">
      <h2 className="text-xl fw-bold mb-3">Register</h2>
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
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
        <div className="mb-3">
          <input
            name="password_confirmation"
            type="password"
            placeholder="Confirm Password"
            value={form.password_confirmation}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <button className="btn btn-primary w-100" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
