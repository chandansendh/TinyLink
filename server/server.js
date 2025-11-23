const express = require("express");
const cors = require("cors");
const db = require("./src/db");
const linkRoutes = require("./src/routes/links"); 
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/healthz", (req, res) => {
  res.status(200).json({
    ok: true,
    version: "1.0",
    uptime: process.uptime(),
  });
});

app.use("/api", linkRoutes);

app.get("/", (req, res) => {
  res.send("TinyLink Backend Running");
});

app.get("/:code", async (req, res) => {
  try {
    const code = req.params.code;

    const result = await db.query(
      `SELECT target_url FROM links WHERE code = $1 LIMIT 1`,
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Not Found");
    }
    await db.query(
      `UPDATE links SET clicks = clicks + 1, last_clicked=NOW() WHERE code = $1`,
      [code]
    );

    res.redirect(result.rows[0].target_url);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
