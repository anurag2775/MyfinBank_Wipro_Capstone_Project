import { useEffect, useState } from "react";
import { approveLoan } from "../services/adminService";
import { parseJsonResponse } from "../utils/apiHelpers";

function AdminLoans() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError("");
    fetch("/api/admin/loans", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => parseJsonResponse(res))
      .then(data => {
        setLoans(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        setError(err.message);
        setLoans([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = (id) => {
    approveLoan(id, "approved")
      .then(() => setLoans(prev => prev.filter(l => l._id !== id)))
      .catch(err => setError(err.message));
  };

  const handleReject = (id) => {
    approveLoan(id, "rejected")
      .then(() => setLoans(prev => prev.filter(l => l._id !== id)))
      .catch(err => setError(err.message));
  };

  return (
    <div className="container py-5">
      <h4 className="text-primary mb-4">Loan Requests</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p className="text-muted">Loading loans...</p>}

      {(loans.length === 0 && !loading) && <p className="text-muted">No loan requests.</p>}
      {loans.map(l => (
        <div key={l._id} className="card shadow-sm p-3 mb-2">
          <p className="mb-1">Amount: ₹{l.amount} | EMI: ₹{l.emi} | {l.months} months</p>
          <p className="mb-1">Status: <span className="badge bg-secondary">{l.status}</span></p>
          {l.user && <p className="mb-1 small text-muted">{l.user.name} – {l.user.email}</p>}
          {l.status === "pending" && (
            <>
              <button className="btn btn-success btn-sm me-2" onClick={() => handleApprove(l._id)}>Approve</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleReject(l._id)}>Reject</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminLoans;
