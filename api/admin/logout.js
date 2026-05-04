const { sendJson } = require("../../lib/http");
const { clearSessionCookie } = require("../../lib/auth");

module.exports = function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
  res.setHeader("Set-Cookie", clearSessionCookie());
  sendJson(res, 200, { ok: true });
};
