const { createClient } = require("@supabase/supabase-js");
const { body, validationResult } = require("express-validator");

// Supabase client configuration
const supabaseUrl = process.env.SUPABASE_URL || "https://owsplwuwjkklwnfajddj.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93c3Bsd3V3amtrbHduZmFqZGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4Nzg2MjgsImV4cCI6MjA3NjQ1NDYyOH0.saZai4dgFkZWbWBHCgMPtxrVkydBbUfQhQt1n4vj3Tk";

const supabase = createClient(supabaseUrl, supabaseKey);

// Validation middleware
const validateLead = [
  body("name").trim().isLength({ min: 2 }).withMessage("Nome deve ter pelo menos 2 caracteres"),
  body("email").isEmail().normalizeEmail().withMessage("E-mail inválido"),
  body("phone").optional().isMobilePhone("pt-BR").withMessage("Telefone inválido"),
];

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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
    const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";

    // Check if lead already exists
    const { data: existingLead, error: checkError } = await supabase
      .from("leads")
      .select("email")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Erro ao verificar lead existente:", checkError);
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

    return res.status(201).json({
      success: true,
      message: "Lead cadastrado com sucesso!",
      data: newLead,
    });

  } catch (error) {
    console.error("Erro no endpoint /api/leads:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
}
