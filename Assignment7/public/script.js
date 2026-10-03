const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const statusText = { available: "ว่าง", borrowed: "ถูกยืม" };

async function loadBooks() {
  const bookList = document.getElementById("book-list");
  try {
    const res = await fetch("/api/books");
    if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลหนังสือได้");
    const books = await res.json();

    bookList.innerHTML = books.map((b) => `
      <tr>
        <td>${esc(b.isbn)}</td>
        <td>${esc(b.title)}</td>
        <td>${esc(b.author)}</td>
        <td>${esc(b.year)}</td>
        <td>${esc(b.publisher)}</td>
        <td class="badge-${esc(b.status)}"><b>${statusText[b.status] || esc(b.status)}</b></td>
        <td>
          <button class="btn warn" data-action="toggle" data-isbn="${esc(b.isbn)}" data-status="${esc(b.status)}">
            ${b.status === "available" ? "ยืม" : "คืน"}
          </button>
          <button class="btn danger" data-action="delete" data-isbn="${esc(b.isbn)}">ลบ</button>
        </td>
      </tr>`).join("");
  } catch (err) {
    console.error(err);
    bookList.innerHTML = `<tr><td colspan="7">ไม่สามารถโหลดข้อมูลหนังสือได้</td></tr>`;
  }
}

// ปุ่มยืม/คืน และลบ
document.getElementById("book-list").addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const isbn = encodeURIComponent(btn.dataset.isbn);

  try {
    if (btn.dataset.action === "toggle") {
      const status = btn.dataset.status === "available" ? "borrowed" : "available";
      await fetch(`/api/books/${isbn}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } else if (btn.dataset.action === "delete") {
      if (!confirm("ยืนยันการลบหนังสือเล่มนี้?")) return;
      await fetch(`/api/books/${isbn}`, { method: "DELETE" });
    }
    loadBooks();
  } catch (err) {
    console.error(err);
    alert("เกิดข้อผิดพลาดในการเชื่อมต่อ Server");
  }
});

// ฟอร์มเพิ่มหนังสือ
document.getElementById("book-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const book = {
    isbn: document.getElementById("isbn").value,
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    year: document.getElementById("year").value,
    publisher: document.getElementById("publisher").value,
  };

  try {
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    const result = await res.json();
    alert(result.message);
    if (res.ok) {
      e.target.reset();
      loadBooks();
    }
  } catch (err) {
    console.error(err);
    alert("เกิดข้อผิดพลาดในการเชื่อมต่อ Server");
  }
});

loadBooks();
