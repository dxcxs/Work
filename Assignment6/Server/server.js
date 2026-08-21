const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.static("../Public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/books", (req, res) => {
    try {
        const data = fs.readFileSync("books.json", "utf8");
        const books = JSON.parse(data);

        res.status(200).json(books);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "ไม่สามารถอ่านข้อมูลหนังสือได้"
        });
    }
});

app.get("/api/book/:isbn", (req, res) => {
    try {
        const data = fs.readFileSync("books.json", "utf8");
        const books = JSON.parse(data);

        const isbn = req.params.isbn;
        const book = books.find(book => book.isbn === isbn);

        if (!book) {
            return res.status(404).json({
                message: "ไม่พบหนังสือที่มี ISBN นี้"
            });
        }

        res.status(200).json(book);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาดในการอ่านข้อมูล"
        });
    }
});

app.post("/api/book", (req, res) => {
    try {
        const data = fs.readFileSync("books.json", "utf8");
        const books = JSON.parse(data);

        const { isbn, title, author, year, publisher } = req.body;

        const newBook = {
            isbn: isbn,
            title: title,
            author: author,
            year: year,
            publisher: publisher,
            status: "available"
        };

        books.push(newBook);

        fs.writeFileSync(
            "books.json",
            JSON.stringify(books, null, 2),
            "utf8"
        );

        res.status(201).json({
            message: "เพิ่มหนังสือสำเร็จ",
            book: newBook
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "ไม่สามารถบันทึกข้อมูลหนังสือได้"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});