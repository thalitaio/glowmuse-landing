const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Lead submission endpoint - MINIMAL VERSION
app.post("/api/leads", (req, res) => {
  console.log("Lead submission request received:", req.body);

  res.json({
    success: true,
    message: "Lead cadastrada com sucesso! (modo minimal)",
    leadId: "minimal-" + Date.now(),
  });
});

// Serve static files
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
});

