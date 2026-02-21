import React, { useState } from "react";
import { parseJsonResponse } from "../utils/apiHelpers";

const ApplyLoan = () => {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [emi, setEmi] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/loan/calculate-emi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, rate, months }),
      });
      const data = await parseJsonResponse(response);
      if (!response.ok) throw new Error(data.message || "Calculation failed");
      setEmi(data.emi);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/loan/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, rate, months, emi }),
      });
      const data = await parseJsonResponse(response);
      if (!response.ok) throw new Error(data.message || "Application failed");

      // Show success message from backend
      setMessage(data.message);
      setError("");

      // Reset form
      setAmount("");
      setRate("");
      setMonths("");
      setEmi(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Apply for Loan</h2>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleCalculate}>
            <div className="mb-3">
              <label className="form-label">Loan Amount</label>
              <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Interest Rate (%)</label>
              <input type="number" className="form-control" value={rate} onChange={(e) => setRate(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Duration (Months)</label>
              <input type="number" className="form-control" value={months} onChange={(e) => setMonths(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Calculate EMI</button>
          </form>

          {emi && (
            <div className="mt-4 text-center border-top pt-3">
              <h4>Monthly EMI: {emi}</h4>
              <button onClick={handleApply} className="btn btn-success mt-2">Confirm & Apply Loan</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplyLoan;
