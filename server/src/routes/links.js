const express = require("express");
const router = express.Router();

const {
  createShortUrl,
  getAllLinksController,
  deleteShortUrl,
  analyticsAll,
  analyticsByCode,
  adminGetAllLinks,
  adminGetStats,
} = require("../controllers/linkController");

const { protect, optionalAuth, isAdmin } = require("../middleware/authMiddleware");

// Regular user/public routes
router.post("/shorten", optionalAuth, createShortUrl);
router.get("/links", protect, getAllLinksController);
router.delete("/links/:id", protect, deleteShortUrl);
router.get("/analytics/:code", optionalAuth, analyticsByCode);

// Admin-only protected routes
router.get("/admin/links", protect, isAdmin, adminGetAllLinks);
router.delete("/admin/links/:id", protect, isAdmin, deleteShortUrl); // Reuses the delete controller since we integrated admin checking in it
router.get("/admin/stats", protect, isAdmin, adminGetStats);

module.exports = router;