const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const analyzeRoutes = require("./routes/analyze");
const authRoutes = require("./routes/auth");
const codeRoutes = require("./routes/code"); 

const app = express();


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MongoDB 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB bağlantısı başarılı"))
  .catch((err) => console.error("❌ MongoDB bağlantı hatası:", err));

//  API 
app.use("/api/auth", authRoutes);       
app.use("/api/analyze", analyzeRoutes); 
app.use("/api/code", codeRoutes);      


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});
