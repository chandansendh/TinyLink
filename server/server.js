const express = require("express");
const cors = require("cors");
const linkRoutes = require("./src/routes/links"); 
const { redirectByCode } = require("./src/controllers/linkController");
require("dotenv").config();

const authRoutes = require("./src/routes/auth");

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

app.use("/api/auth", authRoutes);
app.use("/api", linkRoutes);

app.get("/", (req, res) => {
  res.send("TinyLink Backend Running");
});

app.get("/:code", redirectByCode);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
