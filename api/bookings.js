const crypto = require("node:crypto");
const { sendJson, readJson, required, handleError } = require("../lib/http");
const { requireAdmin } = require("../lib/auth");
const { listBookings, createBooking } = require("../lib/supabase-rest");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const body = await readJson(req);
      const rows = await createBooking({
        id: crypto.randomUUID(),
        name: required(body.name, "name"),
        company: required(body.company, "company"),
        position: required(body.position, "position"),
        phone: required(body.phone, "phone"),
        email: body.email || "",
        product_module: body.product_module || "",
        message: body.message || ""
      });
      return sendJson(res, 201, rows[0]);
    }
    if (req.method === "GET") {
      requireAdmin(req);
      return sendJson(res, 200, await listBookings());
    }
    sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
  } catch (error) {
    handleError(res, error);
  }
};
