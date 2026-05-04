const crypto = require("node:crypto");
const { sendJson, readJson, required, handleError } = require("../lib/http");
const { requireAdmin } = require("../lib/auth");
const { listFaqs, createFaq } = require("../lib/supabase-rest");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { q = "", limit = "0" } = req.query || {};
      return sendJson(res, 200, await listFaqs({ q, limit: Number(limit) }));
    }
    if (req.method === "POST") {
      requireAdmin(req);
      const body = await readJson(req);
      const rows = await createFaq({
        id: body.id || crypto.randomUUID(),
        question: required(body.question, "question"),
        answer: required(body.answer, "answer"),
        sort_order: Number(body.sort_order || 100)
      });
      return sendJson(res, 201, rows[0]);
    }
    sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
  } catch (error) {
    handleError(res, error);
  }
};
