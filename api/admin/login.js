const { sendJson, readJson, handleError } = require("../../lib/http");
const { createSessionCookie } = require("../../lib/auth");

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") return sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
    const body = await readJson(req);
    if (body.password !== (process.env.ADMIN_PASSWORD || "admin123")) {
      return sendJson(res, 401, { error: "INVALID_PASSWORD" });
    }
    res.setHeader("Set-Cookie", createSessionCookie());
    sendJson(res, 200, { ok: true });
  } catch (error) {
    handleError(res, error);
  }
};
