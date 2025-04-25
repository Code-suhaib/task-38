const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: String,
  type: { type: String, enum: ["income", "expense"], required: true },
  amount: { type: Number, required: true },
  category: String,
  description: String,
  date: { type: Date, default: Date.now },
}
,
{ timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
