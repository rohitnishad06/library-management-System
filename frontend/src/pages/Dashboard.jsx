import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbaar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [active, setActive] = useState([]);
  const [overdue, setOverdue] = useState([]);
    const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const booksRes = await API.get("/books");
      const activeRes = await API.get("/transactions/active");
      const overdueRes = await API.get("/transactions/overdue");

      setBooks(booksRes.data);
      setActive(activeRes.data);
      setOverdue(overdueRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-6">
        
        {/* 🔥 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Total Books</h3>
            <p className="text-2xl font-bold">{books.length}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Active Issues</h3>
            <p className="text-2xl font-bold">{active.length}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Overdue</h3>
            <p className="text-2xl font-bold text-red-500">
              {overdue.length}
            </p>
          </div>

        </div>

        {/* 📚 RECENT BOOKS */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-bold mb-3">📚 Recent Books</h2>

          {books.slice(0, 5).map((b) => (
            <div key={b._id} className="border-b py-2">
              {b.name} - {b.author}
              <span className="ml-2 text-sm text-gray-500">
                ({b.availableQty} available)
              </span>
            </div>
          ))}
        </div>

        {/* ⚡ QUICK ACTIONS */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-3">⚡ Quick Actions</h2>

          <div className="flex gap-4 flex-wrap">
            <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer" onClick={() => navigate("/transactions")}>
              Issue Book
            </button>

            <button className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer" onClick={() => navigate("/reports")}>
              View Reports
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;