import { parseJsonResponse } from "../utils/apiHelpers";

const BASE_URL = "http://localhost:5000/api";

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

export const calculateEmi = async (data) => {
  const res = await fetch(`${BASE_URL}/loan/calculate-emi`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data)
  });
  const result = await parseJsonResponse(res);
  if (!res.ok) throw new Error(result.message);
  return result;
};

export const applyLoan = async (data) => {
  const res = await fetch(`${BASE_URL}/loan/apply`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data)
  });
  const result = await parseJsonResponse(res);
  if (!res.ok) throw new Error(result.message);
};
