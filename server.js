const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
};

const root = __dirname;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/health") {
    return json(res, 200, {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      branch: "main",
      repo: "jasoncstar518/Abasthan",
    });
  }

  let filePath = path.join(root, url.pathname === "/" ? "/index.html" : url.pathname);

  if (!filePath.startsWith(root)) {
    return send(res, 403, "Forbidden");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return send(res, 404, "Not Found");
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

function json(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj, null, 2));
}

function send(res, status, msg) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(msg);
}

server.listen(PORT, HOST, () => {
  console.log(`Abasthan test server → http://0.0.0.0:${PORT}`);
  // Keep the process alive for the platform's port discovery
  console.log(`Server ready, PID=${process.pid}`);
});

server.on("error", (err) => {
  console.error("Server error:", err.message);
  process.exit(1);
});

// Keepalive to prevent event loop from emptying before platform detects port
setInterval(() => {}, 60000);