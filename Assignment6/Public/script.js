async function loadBooks() {
    try {
        const response = await fetch("/api/books");

        if (!response.ok) {
            throw new Error("ไม่สามารถดึงข้อมูลหนังสือได้");
        }

        const books = await response.json();

        const bookList = document.getElementById("book-list");

        // Clear old rows
        bookList.innerHTML = "";

        books.forEach(book => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${book.isbn}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td>${book.publisher}</td>
                <td>${book.status}</td>
            `;

            bookList.appendChild(row);
        });

    } catch (error) {
        console.error(error);

        document.getElementById("book-list").innerHTML = `
            <tr>
                <td colspan="6">ไม่สามารถโหลดข้อมูลหนังสือได้</td>
            </tr>
        `;
    }
}

// เรียกใช้งานเมื่อเปิดหน้าเว็บ
loadBooks();

document.getElementById("book-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const book = {
        isbn: document.getElementById("isbn").value,
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        year: document.getElementById("year").value,
        publisher: document.getElementById("publisher").value
    };

    try {
        const response = await fetch("/api/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(book)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);

            // Clear the form
            document.getElementById("book-form").reset();

            // Reload the book list
            loadBooks();

        } else {
            alert(result.message);
        }

    } catch (error) {
        console.error(error);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ Server");
    }
});