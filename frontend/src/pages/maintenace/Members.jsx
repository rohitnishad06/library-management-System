import { useEffect, useState } from "react";
import API from "../../api/api";

const Members = () => {
  const [members, setMembers] = useState([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    contactAddress: "",
    aadharCardNo: "",
    startDate: "",
    membershipType: "6months",
  });

  const fetchMembers = async () => {
    const res = await API.get("/members");
    setMembers(res.data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔴 Validation
    if (
      !form.firstName ||
      !form.lastName ||
      !form.contactNumber ||
      !form.contactAddress ||
      !form.aadharCardNo ||
      !form.startDate
    ) {
      alert("All fields are required");
      return;
    }

    try {
      await API.post("/members", form);
      alert("Membership added successfully ✅");

      // Reset form
      setForm({
        firstName: "",
        lastName: "",
        contactNumber: "",
        contactAddress: "",
        aadharCardNo: "",
        startDate: "",
        membershipType: "6months",
      });

      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding member");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">

      <h2 className="text-xl font-bold mb-4">👥 Add Membership</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        <input
          value={form.firstName}
          placeholder="First Name"
          className="border p-2"
          onChange={(e) =>
            setForm({ ...form, firstName: e.target.value })
          }
        />

        <input
          value={form.lastName}
          placeholder="Last Name"
          className="border p-2"
          onChange={(e) =>
            setForm({ ...form, lastName: e.target.value })
          }
        />

        <input
          value={form.contactNumber}
          placeholder="Contact Number"
          className="border p-2"
          onChange={(e) =>
            setForm({ ...form, contactNumber: e.target.value })
          }
        />

        <input
          value={form.aadharCardNo}
          placeholder="Aadhar Number"
          className="border p-2"
          onChange={(e) =>
            setForm({ ...form, aadharCardNo: e.target.value })
          }
        />

        <input
          value={form.contactAddress}
          placeholder="Address"
          className="border p-2 col-span-2"
          onChange={(e) =>
            setForm({ ...form, contactAddress: e.target.value })
          }
        />

        <input
          type="date"
          value={form.startDate}
          className="border p-2"
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
        />

        {/* Membership Type */}
        <div className="flex gap-4 items-center">
          <label>
            <input
              type="radio"
              value="6months"
              checked={form.membershipType === "6months"}
              onChange={(e) =>
                setForm({ ...form, membershipType: e.target.value })
              }
            />{" "}
            6 Months
          </label>

          <label>
            <input
              type="radio"
              value="1year"
              checked={form.membershipType === "1year"}
              onChange={(e) =>
                setForm({ ...form, membershipType: e.target.value })
              }
            />{" "}
            1 Year
          </label>

          <label>
            <input
              type="radio"
              value="2years"
              checked={form.membershipType === "2years"}
              onChange={(e) =>
                setForm({ ...form, membershipType: e.target.value })
              }
            />{" "}
            2 Years
          </label>
        </div>

        <button className="bg-purple-600 text-white py-2 rounded col-span-2">
          Add Membership
        </button>

      </form>

      {/* MEMBER LIST */}
      <div className="mt-6">
        <h3 className="font-bold mb-2">📋 Members List</h3>

        {members.map((m) => (
          <div key={m._id} className="border p-2 mb-2">
            {m.firstName} {m.lastName} — {m.membershipId}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Members;