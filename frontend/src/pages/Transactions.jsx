import { useState, useEffect } from "react";
import Navbar from "../components/Navbaar";
import API from "../api/api";

const Transactions = () => {
  const [tab, setTab] = useState("issue");

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("issue")}
            className={`px-4 py-2 rounded ${
              tab === "issue" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            Issue Book
          </button>

          <button
            onClick={() => setTab("return")}
            className={`px-4 py-2 rounded ${
              tab === "return" ? "bg-green-500 text-white" : "bg-white"
            }`}
          >
            Return Book
          </button>
        </div>

        {tab === "issue" ? <IssueBook /> : <ReturnBook />}
      </div>
    </div>
  );
};

export default Transactions;


const IssueBook = () => {
  const [form, setForm] = useState({
    bookSerialNo: "",
    membershipId: "",
    issueDate: "",
    returnDate: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/transactions/issue", form);
      alert("Book Issued Successfully");
    } catch (err) {
      console.log(err)
      alert(err.response?.data?.message || "Error issuing book");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-3">📤 Issue Book</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          placeholder="Book Serial No"
          className="border p-2"
          onChange={(e) =>
            setForm({ ...form, bookSerialNo: e.target.value })
          }
        />

        <input
          placeholder="Membership ID"
          className="border p-2"
          onChange={(e) =>
            setForm({ ...form, membershipId: e.target.value })
          }
        />

        <input
          type="date"
          className="border p-2"
          onChange={(e) =>
            setForm({ ...form, issueDate: e.target.value })
          }
        />

        <input
          type="date"
          className="border p-2"
          onChange={(e) =>
            setForm({ ...form, returnDate: e.target.value })
          }
        />

        <button className="bg-blue-500 text-white py-2 rounded">
          Issue Book
        </button>
      </form>
    </div>
  );
};


const ReturnBook = () => {
  const [step, setStep] = useState(1);

  const [search, setSearch] = useState({
    bookSerialNo: "",
    membershipId: "",
  });

  const [txn, setTxn] = useState(null);
  const [fine, setFine] = useState(0);
  const [finePaid, setFinePaid] = useState(false);

  // Step 1: Find Transaction
  const findTransaction = async () => {
    try {
      const res = await API.post("/transactions/return-init", search);
      setTxn(res.data);
      setStep(2);
    } catch (err) {
      alert("Transaction not found");
    }
  };

  // Step 2: Get Fine
  const getFine = async () => {
    try {
      const res = await API.get(`/transactions/fine/${txn.transactionId}`);
      setFine(res.data.fineCalculated);
      setStep(3);
    } catch (err) {
      alert("Error calculating fine");
    }
  };

  // Step 3: Return Book
  const handleReturn = async () => {
    try {
      await API.post("/transactions/return", {
        transactionId: txn.transactionId,
        finePaid,
      });

      alert("Book Returned Successfully");
      setStep(1);
      setTxn(null);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-3">📥 Return Book</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="flex flex-col gap-3">
          <input
            placeholder="Book Serial No"
            className="border p-2"
            onChange={(e) =>
              setSearch({ ...search, bookSerialNo: e.target.value })
            }
          />

          <input
            placeholder="Membership ID"
            className="border p-2"
            onChange={(e) =>
              setSearch({ ...search, membershipId: e.target.value })
            }
          />

          <button
            onClick={findTransaction}
            className="bg-blue-500 text-white py-2 rounded"
          >
            Find Transaction
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && txn && (
        <div>
          <p>📘 {txn.bookName}</p>
          <p>👤 Member: {txn.membershipId}</p>
          <p>📅 Return Date: {txn.returnDate}</p>

          <button
            onClick={getFine}
            className="bg-yellow-500 text-white px-4 py-2 mt-3 rounded"
          >
            Check Fine
          </button>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          <p className="text-lg">
            💰 Fine: <b>₹{fine}</b>
          </p>

          {fine > 0 && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                onChange={(e) => setFinePaid(e.target.checked)}
              />
              Fine Paid
            </label>
          )}

          <button
            onClick={handleReturn}
            className="bg-green-500 text-white px-4 py-2 mt-3 rounded"
          >
            Confirm Return
          </button>
        </div>
      )}
    </div>
  );
};