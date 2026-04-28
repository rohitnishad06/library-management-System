import { useEffect, useState } from "react";
import API from "../../api/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const [form, setForm] = useState({
    username: "",
    name: "",
    role: "user",
    isActive: true,
    isNew: true,
    existingUsername: "",
  });

  // 🔄 Fetch Users
  const fetchUsers = async () => {
    const res = await API.get("/users/login");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ➕ Add / Update User
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/users", form);

      alert(editUser ? "User updated ✅" : "User added ✅");

      setForm({
        username: "",
        name: "",
        role: "user",
        isActive: true,
        isNew: true,
        existingUsername: "",
      });

      setEditUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ✏️ Edit User
  const handleEdit = (user) => {
    setForm({
      username: "",
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      isNew: false,
      existingUsername: user.username,
    });

    setEditUser(user);
  };

  return (
    <div className="bg-white p-6 rounded shadow">

      <h2 className="text-xl font-bold mb-4">👤 User Management</h2>

      {/* ➕ FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        {!editUser && (
          <input
            placeholder="Username"
            value={form.username}
            className="border p-2"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />
        )}

        <input
          placeholder="Name"
          value={form.name}
          className="border p-2"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={form.isActive}
          onChange={(e) =>
            setForm({ ...form, isActive: e.target.value === "true" })
          }
        >
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </select>

        <button className="bg-blue-600 text-white py-2 rounded col-span-2">
          {editUser ? "Update User" : "Add User"}
        </button>
      </form>

      {/* 📋 USER LIST */}
      <div className="mt-6">

        <h3 className="font-bold mb-2">📋 Users</h3>

        {users.map((u) => (
          <div
            key={u._id}
            className="border p-3 mb-2 flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{u.name}</p>
              <p className="text-sm text-gray-500">
                {u.username} | {u.role}
              </p>
              <p className={`text-sm ${u.isActive ? "text-green-600" : "text-red-600"}`}>
                {u.isActive ? "Active" : "Inactive"}
              </p>
            </div>

            <button
              onClick={() => handleEdit(u)}
              className="bg-purple-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
          </div>
        ))}

      </div>

    </div>
  );
};

export default Users;