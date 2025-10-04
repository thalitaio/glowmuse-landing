#!/bin/bash

# GlowMuse Development Setup Script
echo "🔧 Configurando ambiente de desenvolvimento..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cat > .env << EOF
# GlowMuse Landing Page - Development Environment
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://localhost:5432/glowmuse_leads

# Email Configuration (optional for testing)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@glowmuse.com.br

# Security (development only)
JWT_SECRET=dev-jwt-secret-key
SESSION_SECRET=dev-session-secret-key
EOF
    echo "✅ Arquivo .env criado!"
else
    echo "✅ Arquivo .env já existe"
fi

# Create logs directory
mkdir -p logs

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "Próximos passos:"
echo "1. Configure o banco de dados PostgreSQL:"
echo "   createdb glowmuse_leads"
echo "   psql -d glowmuse_leads -f database.sql"
echo ""
echo "2. (Opcional) Configure o email no arquivo .env"
echo ""
echo "3. Inicie o servidor:"
echo "   npm start"
echo ""
echo "4. Acesse: http://localhost:3000"
