import { useState } from "react";
import { transfer } from "../services/transactionService";

function Transfer() {
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleTransfer = async () => {
    try {
      setMessage("");
      setError("");
      await transfer(toAccountId, amount);
      setMessage("Transfer successful!");
      setToAccountId("");
      setAmount("");
    } catch (err) {
      setError(err.message || "Transfer failed");
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow p-4" style={{ width: "380px" }}>
        <h4 className="text-center text-primary mb-3">Fund Transfer</h4>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <input
          className="form-control mb-3"
          placeholder="Target Account ID"
          value={toAccountId}
          onChange={(e) => setToAccountId(e.target.value)}
        />

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          onClick={handleTransfer}
        >
          Transfer
        </button>
      </div>
    </div>
  );
}

export default Transfer;
