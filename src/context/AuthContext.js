"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  // const fetchUserProfile = async (token) => {
   
  //     // const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVER}/api/user`, {
  //     //   method: "POST",
  //     //   body: JSON.stringify({token: token})
  //     // });

  //     const myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "application/json");
  //     myHeaders.append("Authorization", "Bearer "+token);

  //     const raw = JSON.stringify({
  //       "token": token
  //     });

  //     const requestOptions = {
  //       method: "POST",
  //       headers: myHeaders,
  //       body: raw,
  //       redirect: "follow"
  //     };

  //   await fetch("http://127.0.0.1:8000/api/user", requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => setUser(result))
  //     .catch((error) => console.error(error));
  // };
  const fetchUserProfile = async (token) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer " + token);
  
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ token }),
        redirect: "follow",
      };
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVER}/api/user`, requestOptions);
      const result = await response.json();
      
      console.log("Fetched user:", result); // Debugging
      if (result && result.id) {
        setUser(result);
      } else {
        console.warn("Invalid user data:", result);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (credentials) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVER}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    
    const data = await res.json(); 
    if (res.ok) {
      localStorage.setItem("token", data.data.token.access_token);
      setUser(data.data.user);
      router.push("/");
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  const register = async (credentials) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (res.ok) {
      return data.message; // Registration successful
    } else {
      throw new Error(data.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
