import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardPage = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to log in!");
      navigate("/login");
      return;
    }

    const fetchCodes = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("http://localhost:5000/api/code/my-codes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCodes(res.data);
      } catch (err) {
        console.error("Failed to fetch codes:", err);
        setError(err.response?.data?.message || "An error occurred while loading codes");
        
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          toast.error("Your session has expired. Please log in again.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this code?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/code/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCodes((prev) => prev.filter((code) => code._id !== id));
      toast.success("Code successfully deleted!");
    } catch (err) {
      console.error("Failed to delete code:", err.response?.data || err.message || err);
      toast.error("An error occurred while deleting the code.");
    }
  };

  const handleViewDetails = (code) => {
    setSelectedCode(code);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCode(null);
  };

  return (
    <div className="min-h-screen px-6 pt-20 transition-colors duration-300">
      <Navbar />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"
      >
        👨‍💻 My Codes
      </motion.h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg">
          {error}
        </div>
      ) : codes.length === 0 ? (
        <p className="text-center text-gray-500">You haven't saved any code yet.</p>
      ) : (
        <div className="grid gap-6">
          {codes.map((code) => (
            <div
              key={code._id}
              className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 relative"
            >
              <h2 className="text-lg font-semibold mb-2 uppercase">{code.language}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {format(new Date(code.createdAt), "dd.MM.yyyy HH:mm:ss")}
              </p>
              <pre className="whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto">
                {code.code.length > 400 ? code.code.substring(0, 400) + "..." : code.code}
              </pre>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleViewDetails(code)}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Details
                </button>
                <button
                  onClick={() => handleDelete(code._id)}
                  className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && selectedCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Code Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Language</h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white uppercase">
                    {selectedCode.language}
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created At</h3>
                  <p className="text-gray-900 dark:text-white">
                    {format(new Date(selectedCode.createdAt), "dd.MM.yyyy HH:mm:ss")}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Code</h3>
                  <pre className="whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                    {selectedCode.code}
                  </pre>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default DashboardPage;
