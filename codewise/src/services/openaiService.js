// frontend/src/services/openaiService.js

import axios from "axios";

// 🌐 Backend API adresi
const API_BASE = "http://localhost:5000/api";

// ✅ Kod analizi fonksiyonu
export const analyzeCode = async (code, language) => {
  console.log("🚀 OpenAI AnalyzeCode çağrıldı");
  try {
    const response = await axios.post(`${API_BASE}/analyze`, {
      code,
      language,
      mode: "analyze",
    });

    console.log("✅ API'den gelen analiz verisi:", response.data);
    return parseResponse(response.data.analysis);
  } catch (error) {
    console.error("❌ Analyze API error:", error.response?.data || error.message);
    return {
      syntax_errors: "Analysis failed.",
      performance_tips: "N/A",
      security_issues: "N/A",
      best_practices: "N/A",
    };
  }
};

// ✅ Açıklama alma fonksiyonu
export const analyzeCodeExplanation = async (code, language) => {
  console.log("🚀 OpenAI ExplainCode çağrıldı");
  try {
    const response = await axios.post(`${API_BASE}/analyze`, {
      code,
      language,
      mode: "explanation",
    });

    console.log("✅ API'den gelen açıklama:", response.data);
    return response.data.analysis;
  } catch (error) {
    console.error("❌ Explanation API error:", error.response?.data || error.message);
    return "Explanation failed.";
  }
};

// 🔧 Kod düzeltme fonksiyonu
export const fixCode = async (code, language) => {
  console.log("🚀 OpenAI FixCode çağrıldı");
  try {
    const response = await axios.post(`${API_BASE}/analyze`, {
      code,
      language,
      mode: "fix",
    });

    console.log("✅ API'den gelen düzeltilmiş kod:", response.data);
    return response.data.analysis;
  } catch (error) {
    console.error("❌ Fix API error:", error.response?.data || error.message);
    return "Code fixing failed.";
  }
};

// 📦 Yanıtı parçalayan yardımcı fonksiyon
const parseResponse = (text) => {
  const sections = {
    syntax_errors: "",
    performance_tips: "",
    security_issues: "",
    best_practices: "",
  };

  const lines = text.split("\n");
  let currentKey = null;

  lines.forEach((line) => {
    if (line.toLowerCase().includes("syntax")) currentKey = "syntax_errors";
    else if (line.toLowerCase().includes("performance")) currentKey = "performance_tips";
    else if (line.toLowerCase().includes("security")) currentKey = "security_issues";
    else if (line.toLowerCase().includes("best")) currentKey = "best_practices";
    else if (currentKey) sections[currentKey] += line + "\n";
  });

  return sections;
};
