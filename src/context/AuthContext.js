"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();
    
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
  
    if (typeof window !== "undefined") {
      try {
        
        if (storedUser && storedUser !== "undefined") {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error parsing user:", error);
        localStorage.removeItem("user"); // Remove invalid user data
      }
  
      const token = localStorage.getItem("token");
      if (!storedUser && token) {
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
      console.log("Fetched user:", result);

      if (result?.id) {
        setUser(result);
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(result));
        }
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
    <AuthContext.Provider value={{ user, loading, logout , setUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

