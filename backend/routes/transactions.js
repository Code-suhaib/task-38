const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// POST: Add Transaction
router.post("/", async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: All transactions for a user
router.get("/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Summary for a user
router.get("/summary/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId });
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions
      .filter(t => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);
    res.json({ income, expense, balance: income - expense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update a transaction
router.put("/:id", async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Delete a transaction
router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

 router.put("/transactions/:id", async (req, res) => {
    try {
      const updated = await Transaction.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true }
      );
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: "Error updating transaction" });
    }
  });
  router.delete("/transactions/:id", async (req, res) => {
    try {
      await Transaction.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Transaction deleted" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting transaction" });
    }
  });
  
  

module.exports = router;
