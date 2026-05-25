const API = process.env.REACT_APP_API_BASE || "";

async function handle(res) {
  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }

  if (!res.ok) {
    const message =
      (json && (json.error || json.message)) || text || "Server error";

    throw new Error(message);
  }

  return json || text;
}



function getHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("token");
  const headers = { ...extraHeaders };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export function createLink(data) {
  return fetch(`${API}/api/shorten`, {
    method: "POST",
    headers: getHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  }).then(handle);
}

export function getLinks() {
  return fetch(`${API}/api/links`, {
    headers: getHeaders(),
  }).then(handle);
}

export function getLinkStats(code) {
  return fetch(`${API}/api/analytics/${code}`, {
    headers: getHeaders(),
  }).then(handle);
}

export function deleteLink(id) {
  return fetch(`${API}/api/links/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  }).then(handle);
}
