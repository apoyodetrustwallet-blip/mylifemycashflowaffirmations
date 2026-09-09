const http = require("http");
const apiHandler = require("./api/index");

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok" }));
  }

  // Wrap native res to provide Express-like .status() and .json()
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };
  res.json = function (data) {
    if (!res.getHeader("Content-Type")) {
      res.setHeader("Content-Type", "application/json");
    }
    res.end(JSON.stringify(data));
  };
  res.send = function (data) {
    if (typeof data === "string" && !res.getHeader("Content-Type")) {
      res.setHeader("Content-Type", "text/plain");
    }
    if (Buffer.isBuffer(data)) {
      if (!res.getHeader("Content-Type")) {
        res.setHeader("Content-Type", "application/octet-stream");
      }
    }
    res.end(data);
  };
  res.redirect = function (url) {
    res.writeHead(302, { Location: url });
    res.end();
  };

  return apiHandler(req, res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
