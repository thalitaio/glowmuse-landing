#!/bin/bash

echo "🔧 Corrigindo deploy da GlowMuse - Render"
echo "=========================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório do projeto"
    exit 1
fi

echo "📦 Instalando dependências..."
npm install

echo "🔍 Verificando arquivos..."
echo "✅ server.js - $(wc -l < server.js) linhas"
echo "✅ package.json - $(wc -l < package.json) linhas"

echo "🚀 Fazendo commit das correções..."
git add .
git commit -m "Fix: CORS configuration and error handling for production

- Fixed CORS to allow production domain
- Added better error handling and logging
- Improved database connection testing
- Added specific error messages for different failure types"

echo "📤 Enviando para o repositório..."
git push origin main

echo ""
echo "✅ Correções enviadas!"
echo ""
echo "📋 Próximos passos:"
echo "1. Aguarde o deploy automático no Render (2-3 minutos)"
echo "2. Teste o formulário novamente"
echo "3. Verifique os logs no dashboard do Render se ainda houver problemas"
echo ""
echo "🔗 URLs:"
echo "- Aplicação: https://glowmuse-landing.onrender.com"
echo "- Health Check: https://glowmuse-landing.onrender.com/api/health"
echo ""
echo "📊 Para verificar logs:"
echo "1. Acesse o dashboard do Render"
echo "2. Vá para o serviço 'glowmuse-landing'"
echo "3. Clique em 'Logs' para ver os erros em tempo real"
