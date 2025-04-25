import React, { useState } from "react";
import API from "./api"; // import axios instance

function IncomeForm({ onAddTransaction }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const userId = "123"; // hardcoded for now

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTransaction = {
      userId,
      type: "income",
      amount: parseFloat(amount),
      category: "Salary",
      description,
    };

    try {
      const res = await API.post("/transactions", newTransaction);
      onAddTransaction(res.data); // update UI
      setAmount("");
      setDescription("");
    } catch (err) {
      console.error("Error adding income:", err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Income</h3>
      <input
        type="number"
        className="form-control mb-2"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <textarea
        className="form-control mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-success">
        Add Income
      </button>
    </form>
  );
}

export default IncomeForm;
