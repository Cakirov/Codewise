import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { analyzeCode, analyzeCodeExplanation, fixCode } from "../services/openaiService";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [fixedCode, setFixedCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [pageDarkMode, setPageDarkMode] = useState(() => localStorage.getItem("pageTheme") === "dark");
  const [userName] = useState(() => localStorage.getItem("userName") || "");
  const [lineCount, setLineCount] = useState(0);
  const [showFixedEditor, setShowFixedEditor] = useState(false);
  const MAX_LINES = 100;

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    
    setDarkMode(localStorage.getItem("theme") === "dark");
    setPageDarkMode(localStorage.getItem("pageTheme") === "dark");
  }, [navigate]);

  useEffect(() => {
    document.body.classList.toggle("dark", pageDarkMode);
  }, [pageDarkMode]);

  const handleCodeChange = (value) => {
    setCode(value || "");
    setLineCount((value || "").split('\n').length);
  };

  const handleAnalyze = async () => {
    if (lineCount > MAX_LINES) {
      toast.error(`Code is too long! Maximum ${MAX_LINES} lines are allowed. Current code: ${lineCount} lines.`);
      return;
    }

    setLoading(true);
    try {
      const response = await analyzeCode(code, language);
      setResult(response);
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred during analysis.");
    }
    setLoading(false);
  };

  const handleExplain = async () => {
    if (lineCount > MAX_LINES) {
      toast.error(`Code is too long! Maximum ${MAX_LINES} lines are allowed. Current code: ${lineCount} lines.`);
      return;
    }

    setExplaining(true);
    try {
      const response = await analyzeCodeExplanation(code, language);
      setExplanation(response);
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred during explanation creation.");
    }
    setExplaining(false);
  };

  const handleFix = async () => {
    if (lineCount > MAX_LINES) {
      toast.error(`Code is too long! Maximum ${MAX_LINES} lines are allowed. Current code: ${lineCount} lines.`);
      return;
    }

    setFixing(true);
    setShowFixedEditor(true);
    setFixedCode(""); 

    try {
      const fixedCode = await fixCode(code, language);
      
      
      const lines = fixedCode.split('\n');
      for (let i = 0; i < lines.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100)); 
        setFixedCode(prev => prev + (i === 0 ? lines[i] : '\n' + lines[i]));
      }
      
      toast.success("✅ Code successfully fixed!");
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred during code fixing.");
      setShowFixedEditor(false);
    }
    setFixing(false);
  };

  const handleSaveCode = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("You must be logged in.");

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    if (!code.trim()) {
      toast.error("Code to save cannot be empty.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/code/save", {
        userId,
        code,
        language,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success("💾 Code successfully saved");
    } catch (err) {
      console.error("Error saving code:", err);
      toast.error("❌ Failed to save code.");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const updated = !prev;
      localStorage.setItem("theme", updated ? "dark" : "light");
      return updated;
    });
  };

  const togglePageDarkMode = () => {
    setPageDarkMode((prev) => {
      const updated = !prev;
      localStorage.setItem("pageTheme", updated ? "dark" : "light");
      return updated;
    });
  };

  return (
    <div className={`min-h-screen px-6 pt-20 transition-colors duration-300 ${
      pageDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
    }`}>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-5xl font-extrabold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"
      >
        CodeWise 
      </motion.h1>

      <p className="text-center text-gray-500 mb-10 text-sm">
        {userName && (
          <>
            👋 Welcome, <span className="font-semibold text-blue-600">{userName}</span>
          </>
        )}
      </p>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${
                pageDarkMode 
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-900 border-gray-300"
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="c++">C++</option>
              <option value="c#">C#</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={toggleDarkMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                darkMode
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400"
                  : "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700"
              }`}
            >
              {darkMode ? "☀️ Light Editor" : "🌙 Dark Editor"}
            </button>

            <button
              onClick={togglePageDarkMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                pageDarkMode
                  ? "bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-gray-100 hover:to-gray-200"
                  : "bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700"
              }`}
            >
              {pageDarkMode ? "🌞 Light Page" : "🌑 Dark Page"}
            </button>
          </div>
        </div>

        <div className={`flex ${showFixedEditor ? 'gap-8' : ''} mb-8 transition-all duration-300`}>
          <motion.div
            animate={{ width: showFixedEditor ? "50%" : "100%" }}
            transition={{ duration: 0.3 }}
            className={`border rounded-xl shadow-lg overflow-hidden relative ${
              pageDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
            }`}
          >
            <div className="absolute top-2 right-2 z-10">
              <span className={`text-sm px-3 py-1 rounded-full ${
                lineCount > MAX_LINES 
                  ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200" 
                  : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
              }`}>
                {lineCount} / {MAX_LINES} lines
              </span>
            </div>
            {showFixedEditor && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="p-4 border-b border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold">Faulty Code</h3>
              </motion.div>
            )}
            <Editor
              key={`original-${darkMode ? "dark" : "light"}`}
              height={showFixedEditor ? "350px" : "400px"}
              language={language}
              value={code}
              theme={darkMode ? "vs-dark" : "light"}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </motion.div>

          <AnimatePresence>
            {showFixedEditor && (
              <motion.div
                initial={{ opacity: 0, x: 20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "50%" }}
                exit={{ opacity: 0, x: 20, width: 0 }}
                transition={{ duration: 0.3 }}
                className={`border rounded-xl shadow-lg overflow-hidden relative ${
                  pageDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                }`}
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Corrected Code</h3>
                  <button
                    onClick={() => setShowFixedEditor(false)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <Editor
                  key={`fixed-${darkMode ? "dark" : "light"}`}
                  height="350px"
                  language={language}
                  value={fixedCode}
                  theme={darkMode ? "vs-dark" : "light"}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    readOnly: true,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || code.trim() === "" || lineCount > MAX_LINES}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
              loading || code.trim() === "" || lineCount > MAX_LINES
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              "⚡ Analyze"
            )}
          </button>

          <button
            onClick={handleExplain}
            disabled={explaining || code.trim() === "" || lineCount > MAX_LINES}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
              explaining || code.trim() === "" || lineCount > MAX_LINES
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-yellow-500 hover:from-indigo-600 hover:to-yellow-600 shadow-md"
            }`}
          >
            {explaining ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Explaining...
              </span>
            ) : (
              "📝 Explain"
            )}
          </button>

          <button
            onClick={handleFix}
            disabled={fixing || code.trim() === "" || lineCount > MAX_LINES}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
              fixing || code.trim() === "" || lineCount > MAX_LINES
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md"
            }`}
          >
            {fixing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Fixing...
              </span>
            ) : (
              "🔧 Fix"
            )}
          </button>

          <button
            onClick={handleSaveCode}
            disabled={!code.trim()}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
              !code.trim()
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-md"
            }`}
          >
            💾 Save
          </button>
        </div>

        {(result || explanation) && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 overflow-hidden"
          >
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="grid gap-6"
              >
                <Section title="❌ Syntax Errors" content={result.syntax_errors} color="red" />
                <Section title="⚙️ Performance Tips" content={result.performance_tips} color="yellow" />
                <Section title="🛡️ Security Issues" content={result.security_issues} color="blue" />
                <Section title="📌 Best Practices" content={result.best_practices} color="green" />
              </motion.div>
            )}

            {explanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Section title="🧠 Code Explanation" content={explanation} color="purple" />
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, content, color }) => {
  const colorClasses = {
    red: "bg-red-50 text-red-900 border-red-500 dark:bg-red-900/20 dark:text-red-100",
    yellow: "bg-yellow-50 text-yellow-900 border-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-100",
    blue: "bg-blue-50 text-blue-900 border-blue-500 dark:bg-blue-900/20 dark:text-blue-100",
    green: "bg-green-50 text-green-900 border-green-500 dark:bg-green-900/20 dark:text-green-100",
    purple: "bg-purple-50 text-purple-900 border-purple-500 dark:bg-purple-900/20 dark:text-purple-100",
  };

  if (!content || content.trim() === "No issues found in this category.") {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-6 border-l-4 rounded-lg shadow-lg mb-6 ${colorClasses[color] || ""} backdrop-blur-sm`}
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="text-xl font-bold mb-4 flex items-center gap-2"
      >
        {title}
        {color === 'red' && '❌'}
        {color === 'yellow' && '⚙️'}
        {color === 'blue' && '🛡️'}
        {color === 'green' && '📌'}
        {color === 'purple' && '🧠'}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="prose dark:prose-invert max-w-none"
      >
        {content.split('\n').map((line, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 + (index * 0.05) }}
            className="mb-2 leading-relaxed"
          >
            {line}
          </motion.p>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default CodeEditor;
