import { useState } from "react";
import { calculateEmi } from "../services/loanService";

function EmiCalculator() {
  const [form, setForm] = useState({ amount: "", rate: "", months: "" });
  const [emi, setEmi] = useState(null);

  const calculate = async () => {
    const res = await calculateEmi(form);
    setEmi(res.emi);
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h4 className="text-center text-primary mb-3">EMI Calculator</h4>

        <input className="form-control mb-2" placeholder="Loan Amount"
          onChange={(e) => setForm({ ...form, amount: e.target.value })} />

        <input className="form-control mb-2" placeholder="Interest Rate (%)"
          onChange={(e) => setForm({ ...form, rate: e.target.value })} />

        <input className="form-control mb-3" placeholder="Tenure (months)"
          onChange={(e) => setForm({ ...form, months: e.target.value })} />

        <button className="btn btn-primary w-100" onClick={calculate}>
          Calculate EMI
        </button>

        {emi && <p className="text-center mt-3 fw-semibold">EMI: ₹{emi}</p>}
      </div>
    </div>
  );
}

export default EmiCalculator;
