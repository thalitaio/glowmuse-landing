#!/bin/bash

echo "📧 Configuração de Email - GlowMuse Landing Page"
echo "================================================"
echo ""

echo "🔐 Para configurar o Gmail, você precisa:"
echo "1. Ativar verificação em 2 etapas"
echo "2. Gerar uma senha de app"
echo ""

echo "📋 Passos detalhados:"
echo ""
echo "1️⃣ Acesse: https://myaccount.google.com/"
echo "2️⃣ Vá em 'Segurança' → 'Verificação em duas etapas'"
echo "3️⃣ Ative a verificação (se não estiver ativa)"
echo "4️⃣ Volte para 'Segurança' → 'Senhas de app'"
echo "5️⃣ Selecione 'Outro (nome personalizado)'"
echo "6️⃣ Digite: 'GlowMuse Landing Page'"
echo "7️⃣ Clique em 'Gerar' e COPIE a senha (16 caracteres)"
echo ""

read -p "📧 Digite seu email do Gmail: " email
read -p "🔑 Cole a senha de app gerada: " password
read -p "👤 Digite o email do admin: " admin_email

echo ""
echo "⚙️ Configurando arquivo .env..."

# Backup do arquivo atual
cp .env .env.backup

# Atualizar o arquivo .env
cat > .env << EOF
# GlowMuse Landing Page - Development Environment
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://localhost:5432/glowmuse_leads

# Email Configuration
EMAIL_USER=$email
EMAIL_PASS=$password
ADMIN_EMAIL=$admin_email

# Security (development only)
JWT_SECRET=dev-jwt-secret-key
SESSION_SECRET=dev-session-secret-key
EOF

echo "✅ Configuração salva!"
echo ""
echo "🔄 Reiniciando servidor..."
pkill -f "node.*server-dev.js" 2>/dev/null || true
sleep 2

echo "🚀 Iniciando servidor com nova configuração..."
node server-dev.js &
sleep 3

echo ""
echo "🎉 Configuração concluída!"
echo "📱 Acesse: http://localhost:3000"
echo "📧 Emails agora serão enviados automaticamente!"
echo ""
echo "💡 Dica: Teste preenchendo o formulário na landing page"
