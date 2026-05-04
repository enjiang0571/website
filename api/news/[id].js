const { sendJson, readJson, required, handleError } = require("../../lib/http");
const { requireAdmin } = require("../../lib/auth");
const { getNews, updateNews, deleteNews } = require("../../lib/supabase-rest");

module.exports = async function handler(req, res) {
  try {
    const { id } = req.query;
    if (req.method === "GET") {
      const row = await getNews(id);
      return row ? sendJson(res, 200, row) : sendJson(res, 404, { error: "NOT_FOUND" });
    }
    requireAdmin(req);
    if (req.method === "PUT" || req.method === "PATCH") {
      const body = await readJson(req);
      const rows = await updateNews(id, {
        category: required(body.category, "category"),
        title: required(body.title, "title"),
        published_at: required(body.published_at, "published_at"),
        summary: body.summary || "",
        body: required(body.body, "body"),
        image_url: body.image_url || "",
        sort_order: Number(body.sort_order || 100),
        updated_at: new Date().toISOString()
      });
      return sendJson(res, 200, rows[0]);
    }
    if (req.method === "DELETE") {
      await deleteNews(id);
      return sendJson(res, 200, { ok: true });
    }
    sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
  } catch (error) {
    handleError(res, error);
  }
};
