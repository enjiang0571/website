function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
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

function required(value, field = "field") {
  const text = String(value || "").trim();
  if (!text) {
    const error = new Error(`Missing required ${field}`);
    error.status = 400;
    throw error;
  }
  return text;
}

function handleError(res, error) {
  sendJson(res, error.status || 500, {
    error: error.code || "SERVER_ERROR",
    message: error.message
  });
}

module.exports = { sendJson, readJson, required, handleError };
