const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const path = require("path");
require("dotenv").config();

const { Pool } = require("pg");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgresql://localhost:5432/glowmuse_leads",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Test database connection
pool
  .connect()
  .then((client) => {
    console.log("✅ Database connected successfully");
    client.release();

    // Test if leads table exists
    return pool.query("SELECT COUNT(*) FROM leads");
  })
  .then((result) => {
    console.log(
      "✅ Leads table accessible, current count:",
      result.rows[0].count
    );
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    console.error(
      "Database URL:",
      process.env.DATABASE_URL ? "Set" : "Not set"
    );
  });

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
      },
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Muitas tentativas. Tente novamente em 15 minutos.",
  },
});

app.use(limiter);

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://glowmuse-landing.onrender.com",
  "https://glowmuse.com.br",
  "https://www.glowmuse.com.br",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Serve static files
app.use(
  express.static(path.join(__dirname), {
    maxAge: "1d",
    etag: true,
    setHeaders: (res, path) => {
      if (path.endsWith(".svg")) {
        res.setHeader("Content-Type", "image/svg+xml");
      }
      if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

// Serve robots.txt
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.sendFile(path.join(__dirname, "robots.txt"));
});

// Serve sitemap.xml
app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  res.sendFile(path.join(__dirname, "sitemap.xml"));
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

// API Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Lead submission endpoint
app.post("/api/leads", validateLead, async (req, res) => {
  console.log("Lead submission request received:", {
    body: req.body,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  console.log("Environment check:", {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL ? "Set" : "Not set",
    PORT: process.env.PORT,
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

    // Test database connection - TEMPORARILY DISABLED FOR DEBUGGING
    console.log("Testing database connection...");
    // const testConnection = await pool.query("SELECT 1");
    // console.log("Database connection test successful:", testConnection.rows[0]);
    console.log("Database connection test SKIPPED for debugging");

    const { name, email, phone } = req.body;
    console.log("Processing lead:", { name, email, phone });

    // Check if lead already exists - TEMPORARILY DISABLED FOR DEBUGGING
    // const existingLead = await pool.query(
    //   "SELECT id FROM leads WHERE email = $1",
    //   [email]
    // );

    // if (existingLead.rows.length > 0) {
    //   return res.status(409).json({
    //     success: false,
    //     message: "Este e-mail já está cadastrado em nossa lista de espera.",
    //   });
    // }

    // Insert lead into database - TEMPORARILY DISABLED FOR DEBUGGING
    // const result = await pool.query(
    //   "INSERT INTO leads (name, email, phone, created_at, ip_address) VALUES ($1, $2, $3, NOW(), $4) RETURNING id",
    //   [name, email, phone, req.ip]
    // );

    // const leadId = result.rows[0].id;
    const leadId = "test-" + Date.now();

    // Send welcome email - TEMPORARILY DISABLED FOR DEBUGGING
    console.log("Email sending SKIPPED for debugging");
    // try {
    //   await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Bem-vinda à lista de espera da GlowMuse! 🎉",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #c2767b, #5a1e2e); padding: 40px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 2rem;">GlowMuse</h1>
                            <p style="margin: 10px 0 0 0; opacity: 0.9;">O novo espaço para acompanhantes no Brasil</p>
                        </div>
                        <div style="padding: 40px; background: #faf3ef;">
                            <h2 style="color: #5a1e2e; margin-bottom: 20px;">Olá ${name}!</h2>
                            <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">
                                Obrigada por se juntar à nossa lista de espera! Você está entre as primeiras pessoas a conhecer a GlowMuse.
                            </p>
                            <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">
                                Em breve você receberá:
                            </p>
                            <ul style="color: #4a4a4a; line-height: 1.8;">
                                <li>🎯 Acesso antecipado à plataforma</li>
                                <li>💎 Condições especiais de lançamento</li>
                                <li>📧 Atualizações exclusivas sobre o desenvolvimento</li>
                                <li>🤝 Suporte direto da nossa equipe</li>
                            </ul>
                            <p style="color: #4a4a4a; line-height: 1.6; margin-top: 30px;">
                                Sua profissão merece respeito. Sua história merece espaço.
                            </p>
                            <p style="color: #c2767b; font-weight: 600; margin-top: 20px;">
                                Equipe GlowMuse
                            </p>
                        </div>
                    </div>
                `,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail the request if email fails
    }

    // Send notification to admin
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `Nova lead cadastrada: ${name}`,
        html: `
                    <h3>Nova lead cadastrada na GlowMuse</h3>
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>E-mail:</strong> ${email}</p>
                    <p><strong>Telefone:</strong> ${phone}</p>
                    <p><strong>Data:</strong> ${new Date().toLocaleString(
                      "pt-BR"
                    )}</p>
                    <p><strong>IP:</strong> ${req.ip}</p>
                `,
      });
    } catch (adminEmailError) {
      console.error("Admin email error:", adminEmailError);
    }

    res.json({
      success: true,
      message: "Lead cadastrada com sucesso!",
      leadId: leadId,
    });
  } catch (error) {
    console.error("Lead submission error:", {
      error: error.message,
      stack: error.stack,
      body: req.body,
      timestamp: new Date().toISOString(),
      errorCode: error.code,
      errorName: error.name,
    });

    console.error("Full error object:", error);

    // Check if it's a database connection error
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      return res.status(500).json({
        success: false,
        message:
          "Erro de conexão com o banco de dados. Tente novamente em alguns minutos.",
      });
    }

    // Check if it's a validation error
    if (error.code === "23505") {
      // Unique constraint violation
      return res.status(409).json({
        success: false,
        message: "Este e-mail já está cadastrado em nossa lista de espera.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erro interno do servidor. Tente novamente.",
    });
  }
});

// Get leads count (admin only - in production, add authentication)
app.get("/api/leads/count", async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) as count FROM leads");
    res.json({
      success: true,
      count: parseInt(result.rows[0].count),
    });
  } catch (error) {
    console.error("Error getting leads count:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao obter contagem de leads",
    });
  }
});

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Página não encontrada",
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  pool.end(() => {
    console.log("Database connection closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  pool.end(() => {
    console.log("Database connection closed");
    process.exit(0);
  });
});
