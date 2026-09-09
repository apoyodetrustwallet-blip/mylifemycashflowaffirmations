const express = require("express");
const apiHandler = require("./api/index");

const app = express();
app.use(express.json({ limit: "50mb" }));

// Forward all /api/* requests to the Vercel-style handler
app.all("/api/*", (req, res) => {
  // Express strips /api prefix from req.url, but handler expects it
  req.url = "/api" + req.url;
  return apiHandler(req, res);
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
