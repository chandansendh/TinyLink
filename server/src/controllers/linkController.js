const QRCode = require("qrcode");
const {
  createLink,
  findByCode,
  getAllLinks,
  updateClicks,
  deleteLink,
  getAnalytics,
  getAnalyticsByCode,
} = require("../models/linkModel");

const generateCode = require("../utils/generateCode");

exports.createShortUrl = async (req, res) => {
  try {
    const { targetUrl, customCode } = req.body;

    if (!targetUrl)
      return res.status(400).json({ error: "targetUrl is required" });

    let code = customCode ? customCode.trim() : generateCode();

    if (!code.match(/^[A-Za-z0-9]{3,10}$/))
      return res.status(400).json({ error: "Invalid code format" });

    const exists = await findByCode(code);
    if (exists.rows.length > 0)
      return res.status(409).json({ error: "Code already exists" });

    const result = await createLink(code, targetUrl);

    res.json({ success: true, link: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllLinksController = async (req, res) => {
  try {
    const result = await getAllLinks();
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
    if (result.rows.length === 0)
      return res.status(404).json({ error: "URL not found" });

    await updateClicks(code);

    res.redirect(result.rows[0].target_url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteShortUrl = async (req, res) => {
  try {
    const id = req.params.id;

    const del = await deleteLink(id);
    if (del.rows.length === 0)
      return res.status(404).json({ error: "Not found" });

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

    res.json({ success: true, analytics: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.generateQr = async (req, res) => {
  try {
    const { code } = req.params;

    const result = await findByCode(code);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Code not found" });

    const fullUrl = `${process.env.BASE_URL}/${code}`;

    res.setHeader("Content-Type", "image/png");

    QRCode.toBuffer(fullUrl, { type: "png" }, (err, buffer) => {
      if (err) return res.status(500).send("QR generation failed");
      res.send(buffer);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
