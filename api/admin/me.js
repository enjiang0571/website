const { sendJson } = require("../../lib/http");
const { isAdmin } = require("../../lib/auth");

module.exports = function handler(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
  return isAdmin(req) ? sendJson(res, 200, { ok: true }) : sendJson(res, 401, { error: "UNAUTHORIZED" });
};
