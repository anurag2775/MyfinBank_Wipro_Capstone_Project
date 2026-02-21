import { parseJsonResponse } from "../utils/apiHelpers";

const BASE_URL = "http://localhost:5000/api";

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

export const transfer = async (toAccountId, amount) => {
  const res = await fetch(`${BASE_URL}/transaction/transfer`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ recipient: toAccountId, amount })
  });
  const result = await parseJsonResponse(res);
  if (!res.ok) throw new Error(result.message);
  return result;
};
