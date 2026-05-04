const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const PORT = Number(process.env.PORT || 3000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DB_PATH = path.join(DATA_DIR, "beefintech.db");
const sessions = new Map();

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    published_at TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL,
    image_url TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    product_module TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    password_hint TEXT NOT NULL
  );
`);

seedData();

function seedData() {
  const faqCount = db.prepare("SELECT COUNT(*) AS count FROM faqs").get().count;
  if (!faqCount) {
    const insertFaq = db.prepare("INSERT INTO faqs (id, question, answer, sort_order) VALUES (?, ?, ?, ?)");
    [
      ["security", "平台如何保障数据安全？", "BeeFintech 通过权限分级、加密传输、操作留痕、数据备份与访问审计等机制保障业务数据安全。平台也支持按团队、角色、渠道配置不同的数据可见范围。", 1],
      ["commission", "佣金结算如何保证准确？", "系统可按产品、渠道、团队层级与佣金方案自动计算佣金，并通过对账状态、审批流程和发放记录减少人工核算误差。", 2],
      ["integration", "支持哪些对接方式？", "平台支持标准 API、文件导入、数据同步任务和定制接口对接，可连接保险公司、经纪团队、客户服务和数据分析场景。", 3],
      ["insurers", "系统支持哪些保险公司？", "系统可根据团队业务范围配置保险公司、产品库、计划书模板与保费试算规则，支持持续扩展新的保险公司和产品类型。", 4],
      ["pricing", "费用如何计算？", "费用通常依据团队规模、启用模块、系统对接范围和定制服务内容综合评估。建议预约产品演示后获取更准确的方案报价。", 5]
    ].forEach((item) => insertFaq.run(...item));
  }

  const newsCount = db.prepare("SELECT COUNT(*) AS count FROM news").get().count;
  if (!newsCount) {
    const insertNews = db.prepare("INSERT INTO news (id, category, title, published_at, summary, body, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    [
      ["trend", "行业洞察", "香港保险业数字化趋势与机遇", "2026-05-20", "香港保险经纪业务正在从线下流程逐步转向线上协同、数据连接和移动展业。", "香港保险经纪业务正在从线下流程逐步转向线上协同、数据连接和移动展业。数字化系统能帮助团队统一客户、保单、签单、佣金和服务数据。\n\n对经纪团队而言，真正的机会不只是把表格搬到线上，而是通过标准流程和实时数据提升客户服务效率。", "", 1],
      ["release", "产品动态", "BeeFintech 平台 2024 春季更新", "2026-05-15", "本次更新围绕销售工具、签单流程、保单服务和佣金管理进行体验优化。", "本次更新围绕销售工具、签单流程、保单服务和佣金管理进行体验优化。\n\n平台强化了产品对比、计划书生成、数据看板和团队协作能力，让不同角色可以在同一套数据基础上工作。", "", 2],
      ["practice", "最佳实践", "数字化如何提升经纪业务生产力", "2026-05-08", "标准化线索跟进、移动端客户管理和自动化保单提醒能减少重复工作。", "经纪团队可以通过标准化线索跟进、移动端客户管理、自动化保单提醒和佣金对账流程减少重复工作。\n\n当日常流程被系统承接，团队能把更多时间投入到客户沟通、方案设计和业务增长。", "", 3],
      ["policy", "政策观察", "香港保险科技政策与合规观察", "2026-04-28", "保险科技平台需要同时关注效率、数据安全和合规要求。", "保险科技平台需要同时关注效率、数据安全和合规要求。\n\n通过权限配置、操作留痕、数据隔离和审批流，企业可以在提升协作效率的同时保留管理可控性。", "", 4],
      ["roi", "经营分析", "保险经纪数字化 ROI 如何测算", "2026-04-18", "ROI 测算应纳入人力节省、佣金对账效率、客户转化率和服务响应速度。", "ROI 测算不应只看软件成本，还要纳入人力节省、佣金对账效率、客户转化率、保单续期管理和服务响应速度。\n\n清晰的业务指标能帮助管理者判断数字化投入是否真正转化为团队增长。", "", 5]
    ].forEach((item) => insertNews.run(...item));
  }

  db.prepare("INSERT OR IGNORE INTO admin_users (id, password_hint) VALUES (1, ?)").run("default: admin123");
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    serveStatic(req, res, url);
  } catch (error) {
    sendJson(res, 500, { error: "SERVER_ERROR", message: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`BeeFintech demo server running at http://localhost:${PORT}`);
  console.log(`Admin password: ${ADMIN_PASSWORD}`);
});

async function handleApi(req, res, url) {
  const method = req.method;
  const parts = url.pathname.split("/").filter(Boolean);

  if (method === "POST" && url.pathname === "/api/admin/login") {
    const body = await readJson(req);
    if (body.password !== ADMIN_PASSWORD) return sendJson(res, 401, { error: "INVALID_PASSWORD" });
    const token = crypto.randomUUID();
    sessions.set(token, { createdAt: Date.now() });
    res.setHeader("Set-Cookie", `bf_admin=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`);
    return sendJson(res, 200, { ok: true });
  }

  if (method === "POST" && url.pathname === "/api/admin/logout") {
    const token = getCookie(req, "bf_admin");
    if (token) sessions.delete(token);
    res.setHeader("Set-Cookie", "bf_admin=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
    return sendJson(res, 200, { ok: true });
  }

  if (method === "GET" && url.pathname === "/api/admin/me") {
    return sendJson(res, isAdmin(req) ? 200 : 401, isAdmin(req) ? { ok: true } : { error: "UNAUTHORIZED" });
  }

  if (parts[1] === "faqs") return handleFaqs(req, res, url, parts);
  if (parts[1] === "news") return handleNews(req, res, url, parts);
  if (parts[1] === "bookings") return handleBookings(req, res, url, parts);

  sendJson(res, 404, { error: "NOT_FOUND" });
}

async function handleFaqs(req, res, url, parts) {
  const id = parts[2];
  if (req.method === "GET" && !id) {
    const q = (url.searchParams.get("q") || "").trim();
    const limit = Number(url.searchParams.get("limit") || 0);
    let rows = q
      ? db.prepare("SELECT * FROM faqs WHERE question LIKE ? ORDER BY sort_order, created_at").all(`%${q}%`)
      : db.prepare("SELECT * FROM faqs ORDER BY sort_order, created_at").all();
    if (limit > 0) rows = rows.slice(0, limit);
    return sendJson(res, 200, rows);
  }
  if (req.method === "GET" && id) {
    const row = db.prepare("SELECT * FROM faqs WHERE id = ?").get(id);
    return row ? sendJson(res, 200, row) : sendJson(res, 404, { error: "NOT_FOUND" });
  }
  if (!isAdmin(req)) return sendJson(res, 401, { error: "UNAUTHORIZED" });
  const body = await readJson(req);
  if (req.method === "POST") {
    const newId = body.id || crypto.randomUUID();
    db.prepare("INSERT INTO faqs (id, question, answer, sort_order) VALUES (?, ?, ?, ?)").run(newId, required(body.question), required(body.answer), Number(body.sort_order || 100));
    return sendJson(res, 201, db.prepare("SELECT * FROM faqs WHERE id = ?").get(newId));
  }
  if (req.method === "PUT" && id) {
    db.prepare("UPDATE faqs SET question = ?, answer = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(required(body.question), required(body.answer), Number(body.sort_order || 100), id);
    return sendJson(res, 200, db.prepare("SELECT * FROM faqs WHERE id = ?").get(id));
  }
  if (req.method === "DELETE" && id) {
    db.prepare("DELETE FROM faqs WHERE id = ?").run(id);
    return sendJson(res, 200, { ok: true });
  }
  sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
}

async function handleNews(req, res, url, parts) {
  const id = parts[2];
  if (req.method === "GET" && !id) {
    const limit = Number(url.searchParams.get("limit") || 0);
    let rows = db.prepare("SELECT * FROM news ORDER BY sort_order, published_at DESC").all();
    if (limit > 0) rows = rows.slice(0, limit);
    return sendJson(res, 200, rows);
  }
  if (req.method === "GET" && id) {
    const row = db.prepare("SELECT * FROM news WHERE id = ?").get(id);
    return row ? sendJson(res, 200, row) : sendJson(res, 404, { error: "NOT_FOUND" });
  }
  if (!isAdmin(req)) return sendJson(res, 401, { error: "UNAUTHORIZED" });
  const body = await readJson(req);
  if (req.method === "POST") {
    const newId = body.id || crypto.randomUUID();
    db.prepare("INSERT INTO news (id, category, title, published_at, summary, body, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
      newId,
      required(body.category),
      required(body.title),
      required(body.published_at),
      body.summary || "",
      required(body.body),
      body.image_url || "",
      Number(body.sort_order || 100)
    );
    return sendJson(res, 201, db.prepare("SELECT * FROM news WHERE id = ?").get(newId));
  }
  if (req.method === "PUT" && id) {
    db.prepare("UPDATE news SET category = ?, title = ?, published_at = ?, summary = ?, body = ?, image_url = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(
      required(body.category),
      required(body.title),
      required(body.published_at),
      body.summary || "",
      required(body.body),
      body.image_url || "",
      Number(body.sort_order || 100),
      id
    );
    return sendJson(res, 200, db.prepare("SELECT * FROM news WHERE id = ?").get(id));
  }
  if (req.method === "DELETE" && id) {
    db.prepare("DELETE FROM news WHERE id = ?").run(id);
    return sendJson(res, 200, { ok: true });
  }
  sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
}

async function handleBookings(req, res) {
  if (req.method === "POST") {
    const body = await readJson(req);
    const id = crypto.randomUUID();
    db.prepare("INSERT INTO bookings (id, name, company, position, phone, email, product_module, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
      id,
      required(body.name),
      required(body.company),
      required(body.position),
      required(body.phone),
      body.email || "",
      body.product_module || "",
      body.message || ""
    );
    return sendJson(res, 201, db.prepare("SELECT * FROM bookings WHERE id = ?").get(id));
  }
  if (req.method === "GET") {
    if (!isAdmin(req)) return sendJson(res, 401, { error: "UNAUTHORIZED" });
    return sendJson(res, 200, db.prepare("SELECT * FROM bookings ORDER BY created_at DESC").all());
  }
  sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
}

function serveStatic(req, res, url) {
  const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) return sendText(res, 403, "Forbidden");
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return sendText(res, 404, "Not found");
  res.setHeader("Content-Type", mimeType(filePath));
  fs.createReadStream(filePath).pipe(res);
}

function mimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
  }[ext] || "application/octet-stream";
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function sendText(res, status, text) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}

function required(value) {
  const text = String(value || "").trim();
  if (!text) throw new Error("Missing required field");
  return text;
}

function getCookie(req, name) {
  const cookie = req.headers.cookie || "";
  return cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1) || "";
}

function isAdmin(req) {
  const token = getCookie(req, "bf_admin");
  return Boolean(token && sessions.has(token));
}
