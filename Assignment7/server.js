require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Book = require("./models/Book");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/library";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const FIELDS = ["title", "author", "year", "publisher", "status"];
const pick = (body, keys) =>
  Object.fromEntries(keys.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));

// ---------- RESTful API: /api/books ----------

// READ all
app.get("/api/books", async (req, res) => {
  const books = await Book.find().sort({ createdAt: 1, _id: 1 });
  res.status(200).json(books);
});

// READ one
app.get("/api/books/:isbn", async (req, res) => {
  const book = await Book.findOne({ isbn: req.params.isbn });
  if (!book) return res.status(404).json({ message: "ไม่พบหนังสือที่มี ISBN นี้" });
  res.status(200).json(book);
});

// CREATE
app.post("/api/books", async (req, res) => {
  const book = await Book.create({
    isbn: req.body.isbn,
    ...pick(req.body, FIELDS),
  });
  res.status(201).json({ message: "เพิ่มหนังสือสำเร็จ", book });
});

// UPDATE (แก้ไขบางฟิลด์ เช่น status)
app.put("/api/books/:isbn", async (req, res) => {
  const book = await Book.findOneAndUpdate(
    { isbn: req.params.isbn },
    pick(req.body, FIELDS),
    { new: true, runValidators: true }
  );
  if (!book) return res.status(404).json({ message: "ไม่พบหนังสือที่มี ISBN นี้" });
  res.status(200).json({ message: "แก้ไขข้อมูลสำเร็จ", book });
});

// DELETE
app.delete("/api/books/:isbn", async (req, res) => {
  const book = await Book.findOneAndDelete({ isbn: req.params.isbn });
  if (!book) return res.status(404).json({ message: "ไม่พบหนังสือที่มี ISBN นี้" });
  res.status(200).json({ message: "ลบหนังสือสำเร็จ" });
});

// ---------- Error handler ----------
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 11000)
    return res.status(409).json({ message: "ISBN นี้มีอยู่ในระบบแล้ว" });
  if (err.name === "ValidationError")
    return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง: " + Object.keys(err.errors).join(", ") });
  res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Server" });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
