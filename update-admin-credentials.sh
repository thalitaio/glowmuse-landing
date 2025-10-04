#!/bin/bash

echo "🔐 Configurando Credenciais do Admin - GlowMuse"
echo "=============================================="
echo ""

# Add admin credentials to .env file
echo "" >> .env
echo "# Admin Credentials" >> .env
echo "ADMIN_USERNAME=admin" >> .env
echo "ADMIN_PASSWORD=glowmuse2024" >> .env

echo "✅ Credenciais do admin adicionadas ao .env"
echo ""
echo "📋 Credenciais configuradas:"
echo "   Usuário: admin"
echo "   Senha: glowmuse2024"
echo ""
echo "🔒 IMPORTANTE:"
echo "   - Altere essas credenciais em produção"
echo "   - Use senhas mais seguras"
echo "   - Mantenha o .env seguro"
echo ""
echo "🌐 Acesse o painel admin:"
echo "   http://localhost:3000/admin/login"
echo ""
echo "🎯 Próximos passos:"
echo "   1. Reinicie o servidor: npm run dev"
echo "   2. Acesse: http://localhost:3000/admin/login"
echo "   3. Use: admin / glowmuse2024"
