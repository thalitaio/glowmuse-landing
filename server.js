const express = require("express");
const cors = require("cors");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://glowmuse-landing.onrender.com",
      "https://glowmuse.com.br",
      "https://www.glowmuse.com.br",
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.static("."));

// Validation middleware
const validateLead = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nome deve ter entre 2 e 100 caracteres")
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage("Nome deve conter apenas letras e espaços"),
  body("email").isEmail().normalizeEmail().withMessage("E-mail inválido"),
  body("phone")
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage("Telefone deve estar no formato (11) 99999-9999"),
];

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Lead submission endpoint - SIMPLIFIED VERSION
app.post("/api/leads", validateLead, async (req, res) => {
  console.log("Lead submission request received:", {
    body: req.body,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: errors.array(),
      });
    }

    const { name, email, phone } = req.body;
    console.log("Processing lead:", { name, email, phone });

    // Just return success without any database or email operations
    res.json({
      success: true,
      message: "Lead cadastrada com sucesso! (modo teste)",
      leadId: "test-" + Date.now(),
    });

  } catch (error) {
    console.error("Lead submission error:", {
      error: error.message,
      stack: error.stack,
      body: req.body,
      timestamp: new Date().toISOString(),
    });

    res.status(500).json({
      success: false,
      message: "Erro interno do servidor. Tente novamente.",
    });
  }
});

// Serve static files
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
