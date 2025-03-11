"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();
    
  useEffect(() => {
    
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        fetchUserProfile(token);
      } else {
        setLoading(false);
      }
    }
  }, []);
  

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVER}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();
      
      if (result?.id) {
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

  // 🔹 **Logout Method**
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

