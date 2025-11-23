const API = process.env.REACT_APP_API_BASE || "";

// async function handle(res) {
//   const text = await res.text();

//   try {
//     const json = JSON.parse(text);

//     if (!res.ok) {
//       const error = new Error(json.error || "Request failed");
//       error.data = json;
//       throw error;
//     }

//     return json;
//   } catch {
//     if (!res.ok) {
//       const error = new Error(text || "Server error");
//       throw error;
//     }

//     return text;
//   }
// }

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



export function createLink(data) {
  return fetch(`${API}/api/shorten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handle);
}

export function getLinks() {
  return fetch(`${API}/api/links`).then(handle);
}

export function getLinkStats(code) {
  return fetch(`${API}/api/analytics/${code}`).then(handle);
}

export function deleteLink(id) {
  return fetch(`${API}/api/links/${id}`, { method: "DELETE" }).then(handle);
}

export function getQr(code) {
  return fetch(`${API}/api/qr/${code}`);
}
