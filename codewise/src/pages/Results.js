import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analyzedCode = location.state?.analyzedCode || "Code analysis";
  const analysisResult = location.state?.analysisResult;

  return (
    <div className="min-h-screen bg-[#0F172A] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4">
              Analysis Results
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <p className="text-gray-400 text-lg mt-4">Your code analysis is ready</p>
        </div>

        <div className="bg-[#1E293B] rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50 backdrop-blur-sm mb-12">
          <div className="p-4 bg-[#1E293B] border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-gray-400 text-sm">Code Preview</div>
            </div>
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-300 mb-4 flex items-center">
              <span className="mr-2">📝</span> Written Code
            </h2>
            <pre className="bg-[#0F172A] text-green-400 p-6 rounded-xl overflow-x-auto font-mono text-sm border border-gray-700/50">
              {analyzedCode}
            </pre>
          </div>
        </div>

        {analysisResult ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group bg-[#1E293B] rounded-2xl shadow-lg border border-red-500/20 p-6 hover:border-red-500/40 transition-all duration-300 hover:shadow-red-500/10">
              <h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center">
                <span className="mr-2">❌</span> Syntax Errors
              </h2>
              <p className="text-gray-300 leading-relaxed">{analysisResult.syntax_errors}</p>
            </div>

            <div className="group bg-[#1E293B] rounded-2xl shadow-lg border border-yellow-500/20 p-6 hover:border-yellow-500/40 transition-all duration-300 hover:shadow-yellow-500/10">
              <h2 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center">
                <span className="mr-2">⚡</span> Performance Improvements
              </h2>
              <p className="text-gray-300 leading-relaxed">{analysisResult.performance_tips}</p>
            </div>

            <div className="group bg-[#1E293B] rounded-2xl shadow-lg border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300 hover:shadow-blue-500/10">
              <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
                <span className="mr-2">🛡️</span> Security Issues
              </h2>
              <p className="text-gray-300 leading-relaxed">{analysisResult.security_issues}</p>
            </div>

            <div className="group bg-[#1E293B] rounded-2xl shadow-lg border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300 hover:shadow-green-500/10">
              <h2 className="text-xl font-semibold text-green-400 mb-4 flex items-center">
                <span className="mr-2">📌</span> Best Practices
              </h2>
              <p className="text-gray-300 leading-relaxed">{analysisResult.best_practices}</p>
            </div>
          </div>
        ) : (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center backdrop-blur-sm">
            <div className="text-red-400 text-xl mb-2">⚠️</div>
            <p className="text-red-400 text-lg">Code analysis could not be performed. Please try again.</p>
          </div>
        )}

        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate("/")}
            className="group relative px-10 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-lg shadow-blue-500/20"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <span className="relative flex items-center space-x-3">
              <span className="text-xl">🔄</span>
              <span>New Code Analysis</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
