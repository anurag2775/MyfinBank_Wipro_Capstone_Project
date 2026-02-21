
export async function parseJsonResponse(res) {
  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    if (text.trim().startsWith("<!") || text.trim().startsWith("<html")) {
      throw new Error(
        "Server returned a page instead of JSON. Make sure the backend is running at http://localhost:5000."
      );
    }
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  try {
    return text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error("Invalid JSON response from server.");
  }
}
