import { useEffect, useState } from "react";
import {
  getUsers,
  toggleUserStatus,
  getAllAccounts,
  createAccountForUser,
  updateAccount,
  deleteAccount,
} from "../services/adminService";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editingAccount, setEditingAccount] = useState(null);
  const [createBalance, setCreateBalance] = useState("");
  const [editBalance, setEditBalance] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, accountsData] = await Promise.all([
        getUsers(),
        getAllAccounts().catch(() => []),
      ]);
      setUsers(usersData);
      setAccounts(Array.isArray(accountsData) ? accountsData : []);
    } catch (error) {
      setMessage({ text: error.message || "Failed to load data", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getAccountForUser = (userId) => {
    const id = typeof userId === "object" ? userId?.toString?.() : userId;
    return accounts.find((a) => (a.userId || a.user)?.toString?.() === id);
  };

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleToggleUser = async (user) => {
    try {
      await toggleUserStatus(user._id);
      showMsg("User status updated");
      loadData();
    } catch (error) {
      showMsg(error.message || "Failed to update user", "danger");
    }
  };

  const handleCreateAccount = async (userId) => {
    const bal = Number(createBalance);
    if (isNaN(bal) || bal < 0) {
      showMsg("Enter a valid initial balance (≥ 0)", "danger");
      return;
    }
    try {
      await createAccountForUser(userId, bal);
      showMsg("Account created successfully");
      setCreateBalance("");
      setEditingAccount(null);
      loadData();
    } catch (error) {
      showMsg(error.message || "Failed to create account", "danger");
    }
  };

  const handleUpdateAccount = async () => {
    if (!editingAccount?.id) return;
    const bal = Number(editBalance);
    if (isNaN(bal) || bal < 0) {
      showMsg("Enter a valid balance (≥ 0)", "danger");
      return;
    }
    try {
      await updateAccount(editingAccount.id, { balance: bal, isActive: editIsActive });
      showMsg("Account updated successfully");
      setEditingAccount(null);
      loadData();
    } catch (error) {
      showMsg(error.message || "Failed to update account", "danger");
    }
  };

  const handleDeleteAccount = async (account) => {
    if (account.balance !== 0) {
      showMsg("Cannot delete account with non-zero balance.", "danger");
      return;
    }
    if (!window.confirm("Delete this account? This cannot be undone.")) return;
    try {
      await deleteAccount(account.id);
      showMsg("Account deleted");
      setEditingAccount(null);
      loadData();
    } catch (error) {
      showMsg(error.message || "Failed to delete account", "danger");
    }
  };

  const openEdit = (account) => {
    setEditingAccount(account);
    setEditBalance(account.balance ?? 0);
    setEditIsActive(account.isActive !== false);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">Loading users and accounts...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h4 className="text-primary mb-4">Manage Users &amp; Accounts</h4>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ text: "", type: "" })} aria-label="Close" />
        </div>
      )}

      {users.map((u) => {
        const account = getAccountForUser(u._id);
        const editUserId = (editingAccount?.userId || editingAccount?.user)?.toString?.();
        const isEditingThis = editUserId === u._id?.toString?.();

        return (
          <div key={u._id} className="card shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <h6 className="mb-1">{u.name}</h6>
                  <small className="text-muted">{u.email}</small>
                  <span className="badge bg-secondary ms-2">{u.role}</span>
                  <span className={`badge ms-1 ${u.isActive ? "bg-success" : "bg-danger"}`}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleToggleUser(u)}
                >
                  Toggle user status
                </button>
              </div>

              <hr className="my-2" />

              {/* Account section */}
              <div className="small">
                {account ? (
                  <>
                    <strong>Account:</strong> Balance ₹{account.balance ?? 0} &nbsp;
                    <span className={account.isActive ? "text-success" : "text-danger"}>
                      ({account.isActive ? "Active" : "Inactive"})
                    </span>
                    <div className="mt-2">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(account)}>
                        Edit account
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteAccount(account)}
                        disabled={account.balance !== 0}
                        title={account.balance !== 0 ? "Clear balance first" : "Delete account"}
                      >
                        Delete account
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-muted">No account</span>
                  </>
                )}
              </div>

              {/* Create account form removed */}

              {/* Edit account form */}
              {isEditingThis && editingAccount?.action !== "create" && (editingAccount?.id || editingAccount?._id) && (
                <div className="mt-3 p-2 border rounded bg-light">
                  <div className="row g-2 small">
                    <div className="col-auto">
                      <label className="form-label mb-0">Balance</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={editBalance}
                        onChange={(e) => setEditBalance(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-auto d-flex align-items-end">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`active-${u._id}`}
                          checked={editIsActive}
                          onChange={(e) => setEditIsActive(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor={`active-${u._id}`}>Active</label>
                      </div>
                    </div>
                    <div className="col-auto d-flex align-items-end gap-1">
                      <button className="btn btn-sm btn-primary" onClick={handleUpdateAccount}>Save</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingAccount(null)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AdminUsers;
