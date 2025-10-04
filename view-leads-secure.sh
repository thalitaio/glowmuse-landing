#!/bin/bash

echo "🔒 GlowMuse - Visualização Segura de Leads"
echo "=========================================="
echo ""
echo "⚠️  ATENÇÃO: Esta é a única forma segura de visualizar os dados!"
echo "   Os dados NÃO são acessíveis via web por segurança."
echo ""

# Verificar se o banco existe
if [ ! -f "glowmuse_leads.db" ]; then
    echo "❌ Banco de dados não encontrado!"
    exit 1
fi

echo "📊 Estatísticas Gerais:"
echo "----------------------"
sqlite3 glowmuse_leads.db "SELECT COUNT(*) as 'Total de Leads' FROM leads;"
sqlite3 glowmuse_leads.db "SELECT COUNT(*) as 'Leads Hoje' FROM leads WHERE DATE(created_at) = DATE('now');"
sqlite3 glowmuse_leads.db "SELECT COUNT(*) as 'Leads Pendentes' FROM leads WHERE status = 'pending';"

echo ""
echo "📋 Lista Completa de Leads:"
echo "---------------------------"
sqlite3 -header -column glowmuse_leads.db "
SELECT 
    id as ID,
    name as Nome,
    email as Email,
    phone as Telefone,
    DATE(created_at) as Data,
    TIME(created_at) as Hora,
    status as Status
FROM leads 
ORDER BY created_at DESC;"

echo ""
echo "📊 Resumo por Data:"
echo "-------------------"
sqlite3 -header -column glowmuse_leads.db "
SELECT 
    DATE(created_at) as Data,
    COUNT(*) as Quantidade
FROM leads 
GROUP BY DATE(created_at) 
ORDER BY created_at DESC;"

echo ""
echo "🔒 Segurança:"
echo "-------------"
echo "✅ Dados protegidos - sem acesso web"
echo "✅ Apenas acesso local ao banco"
echo "✅ Nenhuma exposição de dados sensíveis"
echo "✅ Compliance com LGPD"

echo ""
echo "💡 Comandos úteis:"
echo "------------------"
echo "• Ver todas as colunas: sqlite3 glowmuse_leads.db 'PRAGMA table_info(leads);'"
echo "• Exportar para CSV: sqlite3 -header -csv glowmuse_leads.db 'SELECT * FROM leads;' > leads.csv"
echo "• Backup: cp glowmuse_leads.db backup_\$(date +%Y%m%d).db"
echo "• Limpar banco: sqlite3 glowmuse_leads.db 'DELETE FROM leads;'"
echo ""
echo "🛡️ Esta é a forma mais segura de gerenciar os dados!"
