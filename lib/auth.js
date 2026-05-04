const crypto = require("node:crypto");

const COOKIE_NAME = "bf_admin";

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "admin123";
}

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(payload) {
  return crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function createSessionCookie() {
  const payload = base64url(JSON.stringify({ exp: Date.now() + 24 * 60 * 60 * 1000 }));
  const token = `${payload}.${sign(payload)}`;
  return `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`;
}

function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

function getCookie(req, name) {
  const cookie = req.headers.cookie || "";
  return cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1) || "";
}

function isAdmin(req) {
  const token = getCookie(req, COOKIE_NAME);
  const [payload, signature] = token.split(".");
  if (!payload || !signature || sign(payload) !== signature) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Number(data.exp) > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req) {
  if (isAdmin(req)) return;
  const error = new Error("Unauthorized");
  error.status = 401;
  error.code = "UNAUTHORIZED";
  throw error;
}

module.exports = { createSessionCookie, clearSessionCookie, isAdmin, requireAdmin };
