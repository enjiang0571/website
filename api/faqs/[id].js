const { sendJson, readJson, required, handleError } = require("../../lib/http");
const { requireAdmin } = require("../../lib/auth");
const { getFaq, updateFaq, deleteFaq } = require("../../lib/supabase-rest");

module.exports = async function handler(req, res) {
  try {
    const { id } = req.query;
    if (req.method === "GET") {
      const row = await getFaq(id);
      return row ? sendJson(res, 200, row) : sendJson(res, 404, { error: "NOT_FOUND" });
    }
    requireAdmin(req);
    if (req.method === "PUT" || req.method === "PATCH") {
      const body = await readJson(req);
      const rows = await updateFaq(id, {
        question: required(body.question, "question"),
        answer: required(body.answer, "answer"),
        sort_order: Number(body.sort_order || 100),
        updated_at: new Date().toISOString()
      });
      return sendJson(res, 200, rows[0]);
    }
    if (req.method === "DELETE") {
      await deleteFaq(id);
      return sendJson(res, 200, { ok: true });
    }
    sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
  } catch (error) {
    handleError(res, error);
  }
};
