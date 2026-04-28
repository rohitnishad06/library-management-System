import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbaar";

const Reports = () => {
  const [tab, setTab] = useState("books");

  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [active, setActive] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const b = await API.get("/books");
      const m = await API.get("/members");
      const a = await API.get("/transactions/active");
      const o = await API.get("/transactions/overdue");
      const r = await API.get("/transactions/requests");

      setBooks(b.data);
      setMembers(m.data);
      setActive(a.data);
      setOverdue(o.data);
      setRequests(r.data);
    } catch (err) {
      console.log(err);
    }
  };

const btn = (active) =>
  `px-4 py-2 rounded ${
    active ? "bg-blue-500 text-white" : "bg-white"
  }`;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-6">

        {/* 🔘 Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button onClick={() => setTab("books")} className={btn(tab === "books")}>Books</button>
          <button onClick={() => setTab("members")} className={btn(tab === "members")}>Members</button>
          <button onClick={() => setTab("active")} className={btn(tab === "active")}>Active</button>
          <button onClick={() => setTab("overdue")} className={btn(tab === "overdue")}>Overdue</button>
          <button onClick={() => setTab("requests")} className={btn(tab === "requests")}>Requests</button>
        </div>

        {/* 📚 BOOKS */}
        {tab === "books" && (
          <Table
            headers={["Name", "Author", "Category", "Available"]}
            data={books.map((b) => [
              b.name,
              b.author,
              b.category,
              b.availableQty,
            ])}
          />
        )}

        {/* 👤 MEMBERS */}
        {tab === "members" && (
          <Table
            headers={["Name", "Contact", "Membership", "Status"]}
            data={members.map((m) => [
              `${m.firstName} ${m.lastName}`,
              m.contactNumber,
              m.membershipType,
              m.status,
            ])}
          />
        )}

        {/* 🔁 ACTIVE */}
        {tab === "active" && (
          <Table
            headers={["Book", "Member", "Issue Date", "Return Date"]}
            data={active.map((t) => [
              t.bookName,
              t.membershipId,
              formatDate(t.issueDate),
              formatDate(t.returnDate),
            ])}
          />
        )}

        {/* 🚨 OVERDUE */}
        {tab === "overdue" && (
          <Table
            headers={["Book", "Member", "Days Late", "Fine"]}
            data={overdue.map((t) => [
              t.bookName,
              t.membershipId,
              t.daysLate,
              `₹${t.fineCalculated}`,
            ])}
          />
        )}

        {/* ⏳ REQUESTS */}
        {tab === "requests" && (
          <Table
            headers={["Book", "Member", "Status"]}
            data={requests.map((t) => [
              t.bookName,
              t.membershipId,
              t.status,
            ])}
          />
        )}
      </div>
    </div>
  );
};

export default Reports;


  const Table = ({ headers, data }) => {
  return (
    <div className="bg-white p-4 rounded shadow overflow-auto">
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            {headers.map((h, i) => (
              <th key={i} className="p-2 border">{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="text-center">
              {row.map((cell, j) => (
                <td key={j} className="p-2 border">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};