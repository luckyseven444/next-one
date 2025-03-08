// "use client";

// import { useState } from "react";
// import { useAuth } from "../../../context/AuthContext";
// import { useRouter } from "next/navigation";

// export default function Login() {
//   const { login } = useAuth();
//   const router = useRouter();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");

//   const handleChange = (e) => { 
//     setForm({ ...form});
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
      
//       router.push("/"); // Redirect to home after login
//     } catch (err) {
//       setError('something went wrong');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10">
//       <h2 className="text-xl font-bold">Login</h2>
//       {error && <p className="text-red-500">{error}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="input" />
//         <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="input" />
//         <button className="bg-green-500 text-white px-4 py-2 rounded" type="submit">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => { 
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // try {
      // const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVER}/api/login`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(form),
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || "Invalid credentials");
      // }

      // Store token and update auth state
      // localStorage.setItem("auth_token", data.token);
      login(form);
      // router.push("/"); // Redirect to home after login
    // } catch (err) {
    //   setError(err.message || "Something went wrong");
    // }
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

