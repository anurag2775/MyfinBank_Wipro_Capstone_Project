import { useState } from "react";
import { deposit, withdraw } from "../services/accountService";

function DepositWithdraw() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleTransaction = async (type) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setMessageType("error");
      setMessage("Please enter a valid positive amount");
      return;
    }
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const value = Number(amount);
      let result;
      if (type === "deposit") {
        result = await deposit(value);
        setMessageType("success");
        setMessage(`Deposit successful! New balance: ₹${result.balance || 'N/A'}`);
      } else {
        result = await withdraw(value);
        setMessageType("success");
        setMessage(`Withdrawal successful! New balance: ₹${result.balance || 'N/A'}`);
      }
      setAmount("");
    } catch (error) {
      console.error(`${type} error:`, error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setMessageType("error");
      const errorMessage = error.message || "Transaction failed. Please try again.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow p-4" style={{ width: "380px" }}>
        <h4 className="text-center text-primary mb-3">Deposit / Withdraw</h4>

        {message && <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} text-center p-2`}>{message}</div>}

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="d-flex gap-2">
          <button className="btn btn-success w-50" onClick={() => handleTransaction("deposit")} disabled={loading}>
            {loading ? "Processing..." : "Deposit"}
          </button>
          <button className="btn btn-danger w-50" onClick={() => handleTransaction("withdraw")} disabled={loading}>
            {loading ? "Processing..." : "Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DepositWithdraw;