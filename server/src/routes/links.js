const express = require("express");
const router = express.Router();

const {
  createShortUrl,
  getAllLinksController,
  redirectByCode,
  deleteShortUrl,
  analyticsAll,
  analyticsByCode,
  generateQr,
} = require("../controllers/linkController");

router.post("/shorten", createShortUrl);

router.get("/links", getAllLinksController);

router.get("/:code", redirectByCode);

router.delete("/links/:id", deleteShortUrl);

router.get("/analytics", analyticsAll);
router.get("/analytics/:code", analyticsByCode);

router.get("/qr/:code", generateQr);

module.exports = router;