import { useState, useEffect } from "react";
import { openFD, openRD, getInvestments } from "../services/investmentService";

function Investments() {
  const [type, setType] = useState("FD"); // FD or RD
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [investments, setInvestments] = useState({ fds: [], rds: [] });

  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    try {
      const data = await getInvestments();
      setInvestments(data);
    } catch (error) {
      console.error("Failed to load investments");
    }
  };

  const handleInvest = async () => {
    setMessageType("");
    setMessage("");
    if (!amount || !months || Number(amount) <= 0 || Number(months) <= 0) {
      setMessageType("error");
      setMessage("Please enter valid amount and duration (months)");
      return;
    }
    try {
      if (type === "FD") {
        const data = { amount: Number(amount), months: Number(months) };
        await openFD(data);
        setMessageType("success");
        setMessage("Fixed Deposit opened successfully!");
      } else {
        const data = { monthlyAmount: Number(amount), months: Number(months) };
        await openRD(data);
        setMessageType("success");
        setMessage("Recurring Deposit opened successfully!");
      }
      setAmount("");
      setMonths("");
      loadInvestments(); // Refresh list
    } catch (error) {
      setMessageType("error");
      const errorMessage = error.message || "Investment failed. Check balance or try again.";
      setMessage(errorMessage);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow p-4" style={{ width: "500px" }}>
        <h4 className="text-center text-primary mb-3">Open Investment</h4>

        {message && <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} text-center p-2`}>{message}</div>}

        <div className="d-flex justify-content-center gap-3 mb-3">
          <button className={`btn ${type === "FD" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setType("FD")}>Fixed Deposit</button>
          <button className={`btn ${type === "RD" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setType("RD")}>Recurring Deposit</button>
        </div>

        <input
          type="number"
          className="form-control mb-3"
          placeholder={type === "FD" ? "Total Amount" : "Monthly Amount"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
        />

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Duration (Months)"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          min="1"
        />

        <button className="btn btn-success w-100" onClick={handleInvest}>
          Open {type}
        </button>

        <hr className="my-4" />

        <h5 className="text-center text-secondary">Your Investments</h5>
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          {investments.fds.length > 0 && <h6 className="mt-2">Fixed Deposits</h6>}
          {investments.fds.map((fd) => ( <div key={fd.id || fd._id} className="alert alert-info p-2 mb-1 small"> ₹{fd.amount} | {fd.months} Months | Maturity: ₹{Math.round(fd.maturityAmount || 0)} </div> ))}

          {investments.rds.length > 0 && <h6 className="mt-2">Recurring Deposits</h6>}
          {investments.rds.map((rd) => ( <div key={rd.id || rd._id} className="alert alert-warning p-2 mb-1 small"> ₹{rd.monthlyAmount}/mo | {rd.months} Months | Maturity: ₹{Math.round(rd.maturityAmount || 0)} </div> ))}
        </div>
      </div>
    </div>
  );
}

export default Investments;