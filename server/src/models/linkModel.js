const db = require("../db");


exports.createLink = async (code, targetUrl, userId = null) => {
  const query = `
    INSERT INTO links (code, target_url, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  return db.query(query, [code, targetUrl, userId]);
};

exports.findByCode = async (code) => {
  return db.query("SELECT * FROM links WHERE code = $1 LIMIT 1", [code]);
};

exports.getAllLinks = async () => {
  return db.query("SELECT * FROM links ORDER BY created_at DESC");
};

exports.getAllLinksByUser = async (userId) => {
  return db.query(
    "SELECT * FROM links WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
};

exports.updateClicks = async (code) => {
  const query = `
    UPDATE links
    SET clicks = clicks + 1, last_clicked = NOW()
    WHERE code = $1
  `;
  return db.query(query, [code]);
};

exports.deleteLink = async (id) => {
  const query = `
    DELETE FROM links WHERE id = $1 RETURNING *
  `;
  return db.query(query, [id]);
};

exports.getAnalytics = async () => {
  const query = `
    SELECT id, code, target_url, clicks, last_clicked, created_at
    FROM links
    ORDER BY created_at DESC
  `;
  return db.query(query);
};

exports.getAnalyticsByCode = async (code) => {
  const query = `
    SELECT id, code, target_url, clicks, last_clicked, created_at
    FROM links
    WHERE code = $1
  `;
  return db.query(query, [code]);
};
