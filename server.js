const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const path = require("path");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase client configuration
const supabaseUrl =
  process.env.SUPABASE_URL || "https://owsplwuwjkklwnfajddj.supabase.co";
const supabaseKey =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93c3Bsd3V3amtrbHduZmFqZGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4Nzg2MjgsImV4cCI6MjA3NjQ1NDYyOH0.saZai4dgFkZWbWBHCgMPtxrVkydBbUfQhQt1n4vj3Tk";

const supabase = createClient(supabaseUrl, supabaseKey);

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    console.log("🔄 Testando conexão com Supabase...");

    const { data, error } = await supabase
      .from("leads")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("❌ Erro na conexão Supabase:", error.message);
      return false;
    }

    console.log("✅ Supabase conectado com sucesso!");
    console.log(`📊 Total de leads: ${data?.length || 0}`);
    return true;
  } catch (error) {
    console.error("❌ Erro na conexão Supabase:", error.message);
    return false;
  }
}

// Test connection on startup
testSupabaseConnection();

// Security middleware
app.use(helmet());

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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Muitas tentativas. Tente novamente em 15 minutos.",
  },
});

app.use(limiter);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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
    database: "Supabase",
  });
});

// Database connection info
app.get("/api/db-info", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("count", { count: "exact", head: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      database: "Supabase",
      status: "Connected",
      totalLeads: data?.length || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
    const ipAddress =
      req.ip ||
      req.connection.remoteAddress ||
      req.headers["x-forwarded-for"] ||
      "unknown";

    // Check if email already exists
    const { data: existingLead, error: checkError } = await supabase
      .from("leads")
      .select("id")
      .eq("email", email)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Erro ao verificar email duplicado:", checkError);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }

    if (existingLead) {
      return res.status(409).json({
        success: false,
        message: "Este e-mail já está cadastrado em nossa lista de espera.",
      });
    }

    // Insert new lead
    const { data: newLead, error: insertError } = await supabase
      .from("leads")
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          ip_address: ipAddress,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Erro ao inserir lead:", insertError);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }

    console.log(`✅ Novo lead cadastrado: ${name} (${email})`);

    res.json({
      success: true,
      message: "Lead cadastrada com sucesso!",
      leadId: newLead.id,
      database: "Supabase",
    });
  } catch (error) {
    console.error("Lead submission error:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor. Tente novamente.",
    });
  }
});

// Get leads count (admin only - in production, add authentication)
app.get("/api/leads/count", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("count", { count: "exact", head: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      count: data?.length || 0,
      database: "Supabase",
    });
  } catch (error) {
    console.error("Error getting leads count:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao obter contagem de leads",
    });
  }
});

// Zapier integration endpoint - SECURED
app.get("/api/zapier/leads", async (req, res) => {
  try {
    // Security: Check API key
    const apiKey = req.headers["x-api-key"] || req.query.api_key;
    if (!apiKey || apiKey !== process.env.ZAPIER_API_KEY) {
      return res.status(401).json({
        success: false,
        message: "API key required",
      });
    }

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      data: data || [],
      database: "Supabase",
    });
  } catch (error) {
    console.error("Error getting leads for Zapier:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao obter leads para Zapier",
    });
  }
});

// Zapier webhook endpoint for new leads
app.post("/api/zapier/webhook", async (req, res) => {
  try {
    const { event, data } = req.body;

    // Log the webhook event
    console.log(`Zapier webhook received: ${event}`, data);

    res.json({
      success: true,
      message: "Webhook processed successfully",
      event: event,
    });
  } catch (error) {
    console.error("Error processing Zapier webhook:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao processar webhook do Zapier",
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

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`💾 Database: Supabase`);
});

module.exports = app;
