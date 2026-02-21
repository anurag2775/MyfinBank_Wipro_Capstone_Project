import { parseJsonResponse } from "../utils/apiHelpers";

const BASE_URL = "http://localhost:5000/api";

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

export const deposit = async (amount) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("You must be logged in to perform this action");

  const res = await fetch(`${BASE_URL}/account/deposit`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ amount })
  });
  const result = await parseJsonResponse(res);
  if (!res.ok) throw new Error(result.message || "Deposit failed");
  return result;
};

export const withdraw = async (amount) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("You must be logged in to perform this action");

  const res = await fetch(`${BASE_URL}/account/withdraw`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ amount })
  });
  const result = await parseJsonResponse(res);
  if (!res.ok) throw new Error(result.message || "Withdrawal failed");
  return result;
};
