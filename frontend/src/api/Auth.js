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
    const message = (json && (json.error || json.message)) || text || "Authentication error";
    throw new Error(message);
  }
  return json || text;
}

export function login(credentials) {
  return fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  }).then(handle);
}

export function signup(data) {
  return fetch(`${API}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handle);
}

export function getMe(token) {
  return fetch(`${API}/api/auth/me`, {
    headers: { "Authorization": `Bearer ${token}` },
  }).then(handle);
}

export function getAdminStats() {
  return fetch(`${API}/api/admin/stats`, {
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
  }).then(handle);
}

export function getAdminLinks() {
  return fetch(`${API}/api/admin/links`, {
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
  }).then(handle);
}

export function adminDeleteLink(id) {
  return fetch(`${API}/api/admin/links/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
  }).then(handle);
}
