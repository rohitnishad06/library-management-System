import { useState } from "react";
import Navbar from "../components/Navbaar";
import Users from "./maintenace/Users";
import Books from "./maintenace/Books";
import Members from "./maintenace/Members";

const Maintenance = () => {
  const [tab, setTab] = useState("users");

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-6">

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button onClick={() => setTab("users")} className={btn(tab==="users")}>Users</button>
          <button onClick={() => setTab("books")} className={btn(tab==="books")}>Books</button>
          <button onClick={() => setTab("members")} className={btn(tab==="members")}>Members</button>
        </div>

        {tab === "users" && <Users />}
        {tab === "books" && <Books />}
        {tab === "members" && <Members />}

      </div>
    </div>
  );
};

const btn = (active) =>
  `px-4 py-2 rounded ${
    active ? "bg-purple-500 text-white" : "bg-white"
  }`;

export default Maintenance;