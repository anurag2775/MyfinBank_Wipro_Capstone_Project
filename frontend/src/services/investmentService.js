import { parseJsonResponse } from "../utils/apiHelpers";

const API_URL = "http://localhost:5000/api/investments";

const handleResponse = async (response) => {
  const result = await parseJsonResponse(response);
  if (!response.ok) throw new Error(result.message || `Request failed: ${response.status}`);
  return result;
};

export const openFD = async (data) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/fd`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const openRD = async (data) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/rd`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const getInvestments = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};