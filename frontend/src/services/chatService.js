import { parseJsonResponse } from "../utils/apiHelpers";

const BASE_URL = "http://localhost:5000/api/chat";

export const sendMessage = async (message) => {
  const res = await fetch(`${BASE_URL}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ message })
  });
  return parseJsonResponse(res);
};

export const getMessages = async () => {
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  return parseJsonResponse(res);
};

