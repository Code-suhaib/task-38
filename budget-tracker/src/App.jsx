import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Row, Col, Table } from "react-bootstrap";
import API from "./api";

function App() {
  const [income, setIncome] = useState(0);
  const [balance, setBalance] = useState(0);
  const [enteredIncome, setEnteredIncome] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [expenseData, setExpenseData] = useState({
    amount: "",
    category: "",
    description: "",
  });

  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const userId = "123";

  const fetchSummary = async () => {
    try {
      const res = await API.get(`/transactions/summary/${userId}`);
      setIncome(res.data.income);
      setBalance(res.data.balance);
    } catch (error) {
      console.error("Error fetching summary:", error.message);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await API.get(`/transactions/${userId}`);
      setExpenses(res.data.reverse());
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
    }
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    const incomeValue = parseFloat(enteredIncome);
    if (!isNaN(incomeValue) && incomeValue > 0) {
      const newIncome = {
        userId,
        type: "income",
        amount: incomeValue,
        category: "Salary",
        description: "Monthly Income",
      };

      try {
        await API.post("/transactions", newIncome);
        setEnteredIncome("");
        fetchSummary();
        fetchExpenses();
      } catch (err) {
        console.error("Error adding income:", err.message);
      }
    }
  };

  const handleExpenseChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(expenseData.amount);
    if (!isNaN(amount) && amount > 0 && balance - amount >= 0) {
      if (editingExpenseId) {
        try {
          await API.put(`/transactions/${editingExpenseId}`, {
            ...expenseData,
            userId,
            type: "expense",
            amount,
          });
          setEditingExpenseId(null);
        } catch (err) {
          console.error("Error updating expense:", err.message);
        }
      } else {
        const newExpense = {
          ...expenseData,
          userId,
          type: "expense",
          amount,
        };

        try {
          await API.post("/transactions", newExpense);
        } catch (err) {
          console.error("Error adding expense:", err.message);
        }
      }

      setExpenseData({ amount: "", category: "", description: "" });
      fetchSummary();
      fetchExpenses();
    } else {
      alert("Invalid amount or insufficient balance");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchSummary();
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting transaction:", error.message);
    }
  };

  const handleEditClick = (exp) => {
    setExpenseData({
      amount: exp.amount,
      category: exp.category,
      description: exp.description,
    });
    setEditingExpenseId(exp._id);
  };

  useEffect(() => {
    fetchSummary();
    fetchExpenses();
  }, []);

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">💰 Personal Budget Tracker</h2>

      {/* Income Input */}
      <Card className="mb-4">
        <Card.Body>
          <h4>Enter Your Monthly Income</h4>
          <Form onSubmit={handleIncomeSubmit}>
            <Row>
              <Col sm={8}>
                <Form.Control
                  type="number"
                  value={enteredIncome}
                  onChange={(e) => setEnteredIncome(e.target.value)}
                  placeholder="Enter your income"
                  required
                />
              </Col>
              <Col sm={4}>
                <Button type="submit" variant="success">
                  Save Income
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Balance Display */}
      <Card className="mb-4">
        <Card.Body>
          <h5>Total Income: ₹{income}</h5>
          <h5>Remaining Balance: ₹{balance}</h5>
        </Card.Body>
      </Card>

      {/* Add Expense */}
      <Card className="mb-4">
        <Card.Body>
          <h4>{editingExpenseId ? "Edit Expense" : "Add Expense"}</h4>
          <Form onSubmit={handleExpenseSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Select
                  name="category"
                  value={expenseData.category}
                  onChange={handleExpenseChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Rent">Rent</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={expenseData.amount}
                  onChange={handleExpenseChange}
                  required
                />
              </Col>
              <Col>
                <Form.Control
                  as="textarea"
                  name="description"
                  placeholder="Description"
                  value={expenseData.description}
                  onChange={handleExpenseChange}
                  required
                />
              </Col>
              <Col>
                <Button type="submit" variant={editingExpenseId ? "warning" : "danger"}>
                  {editingExpenseId ? "Update Expense" : "Add Expense"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Expense List */}
      <Card>
        <Card.Body>
          <h4>Transaction History</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, index) => (
                <tr key={index}>
                  <td>{exp.type}</td>
                  <td>₹{exp.amount}</td>
                  <td>{exp.category}</td>
                  <td>{exp.description}</td>
                  <td>{new Date(exp.createdAt).toLocaleString()}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditClick(exp)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(exp._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;
