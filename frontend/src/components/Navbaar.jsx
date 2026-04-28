import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 text-white p-4 flex justify-between items-center">

      <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")} >📚 Library System</h1>

      {/* Navigation */}
      <div className="flex gap-4 items-center">

        <button onClick={() => navigate("/")} className="bg-amber-500 px-3 py-1 rounded cursor-pointer">Dashboard</button>
        <button onClick={() => navigate("/transactions")} className="bg-purple-500 px-3 py-1 rounded cursor-pointer">Transactions</button>
        <button onClick={() => navigate("/reports")} className="bg-blue-500 px-3 py-1 rounded cursor-pointer">Reports</button>

        {/* 👑 Admin Only */}
        {user?.role === "admin" && (
          <button onClick={() => navigate("/maintenance")} className="bg-green-500 px-3 py-1 rounded cursor-pointer">
            Maintenance
          </button>
        )}

        <span className="ml-3">
          {user?.name} ({user?.role})
        </span>

        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded cursor-pointer"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;