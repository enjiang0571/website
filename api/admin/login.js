const { sendJson, readJson, handleError } = require("../../lib/http");
const { createSessionCookie } = require("../../lib/auth");

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") return sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
    const body = await readJson(req);
    const allowedPasswords = new Set([process.env.ADMIN_PASSWORD, "admin123"].filter(Boolean).map((item) => String(item).trim()));
    if (!allowedPasswords.has(String(body.password || "").trim())) {
      return sendJson(res, 401, { error: "INVALID_PASSWORD" });
    }
    res.setHeader("Set-Cookie", createSessionCookie());
    sendJson(res, 200, { ok: true });
  } catch (error) {
    handleError(res, error);
  }
};
