"use client";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  console.log("user in Nav", user);

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      {user !== null && user?.role === "admin" ? (
        <>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div>
            {user?.name && <span className="mr-4">Welcome, {user.name} </span>}
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </div>
        </>
      ) :  (
        <>
          <h1 className="text-xl font-bold">Add products to Cart</h1>
          <div>
            {user?.name && <span className="mr-4">Welcome, {user.name} </span>}
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </div>
        </>
      )
      }
    </nav>
  );
};

export default Navbar;
