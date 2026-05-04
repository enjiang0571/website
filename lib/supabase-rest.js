const { URLSearchParams } = require("node:url");

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    const error = new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    error.status = 500;
    error.code = "SUPABASE_CONFIG_MISSING";
    throw error;
  }
  return { url: url.replace(/\/$/, ""), key };
}

async function request(table, { method = "GET", query = {}, body, prefer } = {}) {
  const { url, key } = supabaseConfig();
  const params = new URLSearchParams(query);
  const endpoint = `${url}/rest/v1/${table}${params.toString() ? `?${params}` : ""}`;
  const response = await fetch(endpoint, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data?.message || `Supabase request failed: ${response.status}`);
    error.status = response.status;
    error.code = data?.code || "SUPABASE_ERROR";
    throw error;
  }
  return data;
}

function listFaqs({ q = "", limit = 0 } = {}) {
  const query = {
    select: "*",
    order: "sort_order.asc,created_at.asc"
  };
  if (q) query.question = `ilike.*${q.replaceAll("*", "")}*`;
  if (limit) query.limit = String(limit);
  return request("faqs", { query });
}

async function getFaq(id) {
  const rows = await request("faqs", { query: { select: "*", id: `eq.${id}`, limit: "1" } });
  return rows[0] || null;
}

function createFaq(data) {
  return request("faqs", { method: "POST", query: { select: "*" }, body: data, prefer: "return=representation" });
}

function updateFaq(id, data) {
  return request("faqs", { method: "PATCH", query: { id: `eq.${id}`, select: "*" }, body: data, prefer: "return=representation" });
}

function deleteFaq(id) {
  return request("faqs", { method: "DELETE", query: { id: `eq.${id}` } });
}

function listNews({ limit = 0 } = {}) {
  const query = {
    select: "*",
    order: "sort_order.asc,published_at.desc"
  };
  if (limit) query.limit = String(limit);
  return request("news", { query });
}

async function getNews(id) {
  const rows = await request("news", { query: { select: "*", id: `eq.${id}`, limit: "1" } });
  return rows[0] || null;
}

function createNews(data) {
  return request("news", { method: "POST", query: { select: "*" }, body: data, prefer: "return=representation" });
}

function updateNews(id, data) {
  return request("news", { method: "PATCH", query: { id: `eq.${id}`, select: "*" }, body: data, prefer: "return=representation" });
}

function deleteNews(id) {
  return request("news", { method: "DELETE", query: { id: `eq.${id}` } });
}

function listBookings() {
  return request("bookings", { query: { select: "*", order: "created_at.desc" } });
}

function createBooking(data) {
  return request("bookings", { method: "POST", query: { select: "*" }, body: data, prefer: "return=representation" });
}

module.exports = {
  listFaqs,
  getFaq,
  createFaq,
  updateFaq,
  deleteFaq,
  listNews,
  getNews,
  createNews,
  updateNews,
  deleteNews,
  listBookings,
  createBooking
};
