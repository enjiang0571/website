const crypto = require("node:crypto");
const { sendJson, readJson, required, handleError } = require("../lib/http");
const { requireAdmin } = require("../lib/auth");
const { listNews, createNews } = require("../lib/supabase-rest");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { limit = "0" } = req.query || {};
      return sendJson(res, 200, await listNews({ limit: Number(limit) }));
    }
    if (req.method === "POST") {
      requireAdmin(req);
      const body = await readJson(req);
      const rows = await createNews({
        id: body.id || crypto.randomUUID(),
        category: required(body.category, "category"),
        title: required(body.title, "title"),
        published_at: required(body.published_at, "published_at"),
        summary: body.summary || "",
        body: required(body.body, "body"),
        image_url: body.image_url || "",
        sort_order: Number(body.sort_order || 100)
      });
      return sendJson(res, 201, rows[0]);
    }
    sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
  } catch (error) {
    handleError(res, error);
  }
};
