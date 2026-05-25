const {
  createLink,
  findByCode,
  getAllLinks,
  getAllLinksByUser,
  updateClicks,
  deleteLink,
  getAnalytics,
  getAnalyticsByCode,
} = require("../models/linkModel");

const db = require("../db");
const generateCode = require("../utils/generateCode");

exports.createShortUrl = async (req, res) => {
  try {
    const { targetUrl, customCode } = req.body;

    if (!targetUrl)
      return res.status(400).json({ error: "targetUrl is required" });

    // Validate target URL format and protocol (SSRF / XSS mitigation)
    try {
      const parsedUrl = new URL(targetUrl.trim());
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return res.status(400).json({ error: "Only HTTP and HTTPS protocols are allowed" });
      }
    } catch (e) {
      return res.status(400).json({ error: "Invalid target URL format" });
    }

    let code;
    if (customCode) {
      code = customCode.trim();
      if (!code.match(/^[A-Za-z0-9]{3,10}$/)) {
        return res.status(400).json({ error: "Invalid code format" });
      }
      const exists = await findByCode(code);
      if (exists.rows.length > 0) {
        return res.status(409).json({ error: "Code already exists" });
      }
    } else {
      let attempts = 0;
      let isUnique = false;
      while (attempts < 5 && !isUnique) {
        code = generateCode();
        const exists = await findByCode(code);
        if (exists.rows.length === 0) {
          isUnique = true;
        }
        attempts++;
      }
      if (!isUnique) {
        return res.status(500).json({ error: "Could not generate a unique short link. Please try again." });
      }
    }

    // Attach optional logged in user ID
    const userId = req.user ? req.user.id : null;
    const result = await createLink(code, targetUrl.trim(), userId);

    res.json({ success: true, link: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllLinksController = async (req, res) => {
  try {
    // Return links only for the authenticated user
    const result = await getAllLinksByUser(req.user.id);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.redirectByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const result = await findByCode(code);
    if (result.rows.length === 0) {
      return res.status(404).send("Not Found");
    }

    await updateClicks(code);

    res.redirect(result.rows[0].target_url);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.deleteShortUrl = async (req, res) => {
  try {
    const id = req.params.id;

    // Find the link first to verify ownership
    const linkResult = await db.query("SELECT * FROM links WHERE id = $1 LIMIT 1", [id]);
    if (linkResult.rows.length === 0) {
      return res.status(404).json({ error: "Link not found" });
    }

    const link = linkResult.rows[0];

    // Check permission: owner or admin
    if (link.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. You can only delete your own links." });
    }

    const del = await deleteLink(id);
    res.json({ success: true, deleted: del.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.analyticsAll = async (req, res) => {
  try {
    const result = await getAnalytics();
    res.json({ success: true, analytics: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.analyticsByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const result = await getAnalyticsByCode(code);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Short URL not found" });

    // Secure checking: only owner or admin can view analytics
    const link = result.rows[0];
    // Note: getAnalyticsByCode needs to return user_id, let's make sure it does or check ownership
    const fullLinkResult = await findByCode(code);
    const fullLink = fullLinkResult.rows[0];

    if (fullLink.user_id && (!req.user || (fullLink.user_id !== req.user.id && req.user.role !== "admin"))) {
      return res.status(403).json({ error: "Access denied. Analytics is private." });
    }

    res.json({ success: true, analytics: link });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin Controllers
exports.adminGetAllLinks = async (req, res) => {
  try {
    const result = await getAllLinks();
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.adminGetStats = async (req, res) => {
  try {
    const totalLinksResult = await db.query("SELECT COUNT(*) FROM links");
    const totalUsersResult = await db.query("SELECT COUNT(*) FROM users");
    const totalClicksResult = await db.query("SELECT SUM(clicks) FROM links");
    
    const topLinksResult = await db.query(
      "SELECT id, code, target_url, clicks, created_at FROM links ORDER BY clicks DESC LIMIT 5"
    );

    res.json({
      success: true,
      stats: {
        totalLinks: parseInt(totalLinksResult.rows[0].count),
        totalUsers: parseInt(totalUsersResult.rows[0].count),
        totalClicks: parseInt(totalClicksResult.rows[0].sum || 0),
        topLinks: topLinksResult.rows,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
