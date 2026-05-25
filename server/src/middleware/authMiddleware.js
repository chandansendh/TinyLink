const jwt = require("jsonwebtoken");
const db = require("../db");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "tinylink_secret_key_123");

      // Get user from database
      const userResult = await db.query(
        "SELECT id, email, role FROM users WHERE id = $1 LIMIT 1",
        [decoded.id]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({ error: "Not authorized, user not found" });
      }

      req.user = userResult.rows[0];
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  // If no token is provided, proceed without attaching a user (supports optional anonymous link creation)
  // But for fully protected paths, we explicitly fail inside controllers or create a strict version
  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }
};

// Middleware supporting optional auth (e.g. shortening links anonymously or logged in)
exports.optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "tinylink_secret_key_123");
      const userResult = await db.query(
        "SELECT id, email, role FROM users WHERE id = $1 LIMIT 1",
        [decoded.id]
      );

      if (userResult.rows.length > 0) {
        req.user = userResult.rows[0];
      }
    } catch (error) {
      // Fail silently for optional auth
      console.warn("Optional auth parsing failed:", error.message);
    }
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admins only." });
  }
};
