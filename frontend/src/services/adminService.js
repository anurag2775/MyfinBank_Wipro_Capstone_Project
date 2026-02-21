import { parseJsonResponse } from "../utils/apiHelpers";

// Use relative URL so in dev the proxy (see package.json "proxy") forwards to backend
const BASE_URL = "/api";

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

async function adminFetch(url, options = {}) {
  const res = await fetch(url, { ...options, headers: { ...authHeader(), ...options.headers } });
  const result = await parseJsonResponse(res);
  if (!res.ok) throw new Error(result.message);
  return result;
}

export const getUsers = async () => adminFetch(`${BASE_URL}/admin/users`);

export const toggleUserStatus = async (id) =>
  adminFetch(`${BASE_URL}/admin/users/${id}/status`, { method: "PUT" });

export const getAllAccounts = async () => adminFetch(`${BASE_URL}/admin/accounts`);

export const getAccountByUserId = async (userId) =>
  adminFetch(`${BASE_URL}/admin/accounts/user/${userId}`);

export const createAccountForUser = async (userId, initialBalance = 0) =>
  adminFetch(`${BASE_URL}/admin/accounts`, {
    method: "POST",
    body: JSON.stringify({ userId, initialBalance })
  });

export const updateAccount = async (accountId, data) =>
  adminFetch(`${BASE_URL}/admin/accounts/${accountId}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });

export const deleteAccount = async (accountId) =>
  adminFetch(`${BASE_URL}/admin/accounts/${accountId}`, { method: "DELETE" });

export const approveLoan = async (id, status) =>
  adminFetch(`${BASE_URL}/admin/loans/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status })
  });
