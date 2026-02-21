import { parseJsonResponse } from "../utils/apiHelpers";

const BASE_URL = "http://localhost:5000/api";

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await parseJsonResponse(res);
  if (!res.ok) throw new Error(result.message);

  localStorage.setItem("token", result.token);
  localStorage.setItem("role", result.user.role);

  return result;
};

export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await parseJsonResponse(res);
  if (!res.ok) throw new Error(result.message);
};

