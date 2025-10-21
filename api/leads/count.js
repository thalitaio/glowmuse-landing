const { createClient } = require("@supabase/supabase-js");

// Supabase client configuration
const supabaseUrl = process.env.SUPABASE_URL || "https://owsplwuwjkklwnfajddj.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93c3Bsd3V3amtrbHduZmFqZGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4Nzg2MjgsImV4cCI6MjA3NjQ1NDYyOH0.saZai4dgFkZWbWBHCgMPtxrVkydBbUfQhQt1n4vj3Tk";

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { count, error } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Erro ao contar leads:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao contar leads",
      });
    }

    return res.status(200).json({
      success: true,
      count: count || 0,
    });

  } catch (error) {
    console.error("Erro no endpoint /api/leads/count:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
}
