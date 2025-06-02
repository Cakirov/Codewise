import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md px-6 py-4 z-50 flex justify-between items-center">
      <Link
        to="/editor"
        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
      >
        CodeWise
      </Link>

      <div className="flex gap-4 items-center">
        <Link
          to="/dashboard"
          className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline"
        >
          Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
