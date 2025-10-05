#!/bin/bash

echo "🌐 Verificação de Domínio Personalizado - GlowMuse"
echo "=================================================="

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para verificar se um domínio responde
check_domain() {
    local domain=$1
    local description=$2
    
    echo -n "Verificando $description ($domain)... "
    
    if curl -s --max-time 10 "https://$domain" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    elif curl -s --max-time 10 "http://$domain" > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  HTTP (sem HTTPS)${NC}"
        return 1
    else
        echo -e "${RED}❌ Não responde${NC}"
        return 2
    fi
}

# Verificar domínio atual do Render
echo "1. Verificando domínio atual do Render:"
check_domain "glowmuse-landing.onrender.com" "Render"

echo ""
echo "2. Para verificar seu domínio personalizado, execute:"
echo "   ./check-domain.sh SEU-DOMINIO.com"
echo ""

# Se um domínio foi fornecido como argumento
if [ ! -z "$1" ]; then
    echo "3. Verificando seu domínio personalizado:"
    check_domain "$1" "Domínio Personalizado"
    
    echo ""
    echo "4. Verificando redirecionamento HTTPS:"
    if curl -s --max-time 10 "http://$1" | grep -i "location.*https" > /dev/null; then
        echo -e "${GREEN}✅ Redirecionamento HTTPS configurado${NC}"
    else
        echo -e "${YELLOW}⚠️  Verifique se o HTTPS está configurado${NC}"
    fi
    
    echo ""
    echo "5. Verificando conteúdo da página:"
    if curl -s --max-time 10 "https://$1" | grep -i "glowmuse" > /dev/null; then
        echo -e "${GREEN}✅ Conteúdo da GlowMuse carregando corretamente${NC}"
    else
        echo -e "${RED}❌ Conteúdo não está carregando corretamente${NC}"
    fi
fi

echo ""
echo "📝 Próximos passos:"
echo "1. Configure o DNS no seu provedor de domínio"
echo "2. Aguarde a propagação (5min - 24h)"
echo "3. Execute: ./check-domain.sh SEU-DOMINIO.com"
echo "4. Teste o formulário de cadastro"
