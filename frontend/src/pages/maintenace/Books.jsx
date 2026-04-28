import { useEffect, useState } from "react";
import API from "../../api/api";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    author: "",
    category: "Science",
    type: "book",
    cost: "",
    procurementDate: "",
    quantity: 1,
  });

  const [search, setSearch] = useState("");

  // 🔄 Fetch Books
  const fetchBooks = async () => {
    const res = await API.get("/books");
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ➕ Add / Update Book
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await API.put(`/books/update-book/${editId}`, form);
        alert("Book updated ✅");
      } else {
        await API.post("/books", form);
        alert("Book added ✅");
      }

      setForm({
        name: "",
        author: "",
        category: "Science",
        type: "book",
        cost: "",
        procurementDate: "",
        quantity: 1,
      });

      setEditId(null);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ✏️ Edit Book
  const handleEdit = (book) => {
    setForm({
      name: book.name,
      author: book.author,
      category: book.category,
      type: book.type,
      cost: book.cost,
      procurementDate: book.procurementDate?.substring(0, 10),
      quantity: book.quantity,
    });

    setEditId(book._id);
  };

  // 🔍 Filter Books
  const filteredBooks = books.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded shadow">

      <h2 className="text-xl font-bold mb-4">📘 Book Management</h2>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search by name or author..."
        className="border p-2 mb-4 w-full"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ➕ FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        <input
          value={form.name}
          placeholder="Book Name"
          className="border p-2"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          value={form.author}
          placeholder="Author"
          className="border p-2"
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option>Science</option>
          <option>Economics</option>
          <option>Fiction</option>
          <option>Children</option>
          <option>Personal Development</option>
        </select>


        <input
          type="number"
          value={form.cost}
          placeholder="Cost"
          className="border p-2"
          onChange={(e) => setForm({ ...form, cost: e.target.value })}
        />

        <input
          type="date"
          value={form.procurementDate}
          className="border p-2"
          onChange={(e) =>
            setForm({ ...form, procurementDate: e.target.value })
          }
        />

        <input
          type="number"
          value={form.quantity}
          placeholder="Quantity"
          className="border p-2"
          onChange={(e) =>
            setForm({ ...form, quantity: e.target.value })
          }
        />

        <button className="bg-green-600 text-white py-2 rounded col-span-2">
          {editId ? "Update Book" : "Add Book"}
        </button>
      </form>

      {/* 📋 LIST */}
      <div className="mt-6">

        <h3 className="font-bold mb-2">📚 Book List</h3>

        {filteredBooks.map((b) => (
          <div
            key={b._id}
            className="border p-3 mb-2 flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{b.name}</p>
              <p className="text-sm text-gray-500">
                {b.author} | {b.category}
              </p>
              <p className="text-sm">
                Available: {b.availableQty} / {b.quantity}
              </p>
            </div>

            <button
              onClick={() => handleEdit(b)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
          </div>
        ))}

      </div>

    </div>
  );
};

export default Books;