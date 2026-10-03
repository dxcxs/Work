const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    isbn: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    publisher: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["available", "borrowed"],
      default: "available",
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Book", bookSchema);
