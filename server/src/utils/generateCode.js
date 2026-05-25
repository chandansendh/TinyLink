const crypto = require("crypto");

module.exports = function generateCode() {
  return crypto.randomBytes(3).toString("hex");
};
