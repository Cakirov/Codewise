const express = require("express");
const router = express.Router();
const Code = require("../models/Code");
const authMiddleware = require("../middlewares/authMiddleware");


router.post("/save", authMiddleware, async (req, res) => {
  const { title, tags, code, language } = req.body;

  try {
    const newCode = new Code({
      userId: req.user.id,
      title,
      tags,
      code,
      language,
    });

    await newCode.save();
    res.status(201).json({ message: "Kod kaydedildi." });
  } catch (err) {
    console.error("Kod kaydetme hatası:", err);
    res.status(500).json({ error: "Kod kaydedilemedi." });
  }
});


router.get("/my-codes", authMiddleware, async (req, res) => {
  try {
    const codes = await Code.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(codes);
  } catch (err) {
    res.status(500).json({ error: "Kodlar getirilemedi." });
  }
});

// DELETE: Belirli bir kodu sil
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  const codeId = req.params.id;

  try {
    const deleted = await Code.findOneAndDelete({
      _id: codeId,
      userId: req.user.id, 
    });

    if (!deleted) {
      return res.status(404).json({ error: "Kod bulunamadı veya yetki yok." });
    }

    res.json({ message: "Kod silindi." });
  } catch (err) {
    console.error("Silme hatası:", err);
    res.status(500).json({ error: "Kod silinemedi." });
  }
});

module.exports = router;
