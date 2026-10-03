// นำข้อมูลจาก books.json เข้า MongoDB:  npm run seed
require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");
const Book = require("./models/Book");

(async () => {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/library");
  const books = JSON.parse(fs.readFileSync("books.json", "utf8"));

  await Book.bulkWrite(
    books.map((b) => ({
      updateOne: {
        filter: { isbn: b.isbn },
        update: { $set: { ...b, year: Number(b.year) } },
        upsert: true,
      },
    }))
  );

  console.log(`Seeded ${books.length} books`);
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
