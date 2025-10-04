const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// SQLite Database setup
const db = new sqlite3.Database("./glowmuse_leads.db", (err) => {
  if (err) {
    console.error("❌ Database connection error:", err.message);
  } else {
    console.log("✅ SQLite Database connected successfully");

    // Create leads table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT,
        user_agent TEXT,
        source TEXT DEFAULT 'landing_page',
        status TEXT DEFAULT 'pending',
        notes TEXT
      )
    `,
      (err) => {
        if (err) {
          console.error("❌ Error creating table:", err.message);
        } else {
          console.log("✅ Leads table ready");
        }
      }
    );
  }
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
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcAttr: ["'unsafe-inline'"],
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
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
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

// Email configuration (optional for development)
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log("✅ Email configured");
} else {
  console.log("⚠️  Email not configured - running without email notifications");
}

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
    database: "SQLite",
  });
});

// Lead submission endpoint
app.post("/api/leads", validateLead, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: errors.array(),
      });
    }

    const { name, email, phone } = req.body;

    // Check if lead already exists
    db.get("SELECT id FROM leads WHERE email = ?", [email], (err, row) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          message: "Erro interno do servidor. Tente novamente.",
        });
      }

      if (row) {
        return res.status(409).json({
          success: false,
          message: "Este e-mail já está cadastrado em nossa lista de espera.",
        });
      }

      // Insert lead into database
      db.run(
        "INSERT INTO leads (name, email, phone, ip_address) VALUES (?, ?, ?, ?)",
        [name, email, phone, req.ip],
        function (err) {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({
              success: false,
              message: "Erro interno do servidor. Tente novamente.",
            });
          }

          const leadId = this.lastID;

          // Send welcome email (if configured)
          if (transporter) {
            transporter
              .sendMail({
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
              })
              .catch((emailError) => {
                console.error("Email sending error:", emailError);
              });
          }

          res.json({
            success: true,
            message: "Lead cadastrada com sucesso!",
            leadId: leadId,
          });
        }
      );
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor. Tente novamente.",
    });
  }
});

// Get leads count
app.get("/api/leads/count", (req, res) => {
  db.get("SELECT COUNT(*) as count FROM leads", (err, row) => {
    if (err) {
      console.error("Error getting leads count:", err);
      return res.status(500).json({
        success: false,
        message: "Erro ao obter contagem de leads",
      });
    }
    res.json({
      success: true,
      count: row.count,
    });
  });
});

// Painel admin removido por segurança
// Os dados só podem ser acessados diretamente no banco de dados

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
  console.log(`💾 Database: SQLite (glowmuse_leads.db)`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  db.close(() => {
    console.log("Database connection closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  db.close(() => {
    console.log("Database connection closed");
    process.exit(0);
  });
});
