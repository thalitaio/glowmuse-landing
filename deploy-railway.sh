#!/bin/bash

echo "🚀 GlowMuse - Deploy para Railway"
echo "================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    print_error "Execute este script no diretório do projeto!"
    exit 1
fi

# Verificar se o git está configurado
if [ ! -d ".git" ]; then
    print_warning "Inicializando repositório Git..."
    git init
    git branch -M main
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    print_status "Adicionando mudanças ao Git..."
    git add .
    
    echo -n "Digite a mensagem do commit: "
    read commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    git commit -m "$commit_message"
    print_success "Mudanças commitadas!"
fi

# Verificar se há remote origin
if ! git remote get-url origin > /dev/null 2>&1; then
    print_warning "Configure o remote origin do GitHub primeiro!"
    echo "Exemplo: git remote add origin https://github.com/SEU_USUARIO/glowmuse-landing.git"
    exit 1
fi

# Push para GitHub
print_status "Enviando para GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    print_success "Código enviado para GitHub!"
else
    print_error "Erro ao enviar para GitHub!"
    exit 1
fi

echo ""
print_success "✅ Deploy iniciado no Railway!"
echo ""
print_status "Próximos passos:"
echo "1. Acesse: https://railway.app"
echo "2. Conecte sua conta GitHub"
echo "3. Selecione seu repositório"
echo "4. Adicione PostgreSQL database"
echo "5. Configure as variáveis de ambiente:"
echo "   - NODE_ENV=production"
echo "   - DATABASE_URL (automático do PostgreSQL)"
echo "   - EMAIL_HOST, EMAIL_USER, EMAIL_PASS (opcional)"
echo ""
print_status "Sua aplicação estará disponível em: https://SEU_PROJETO.railway.app"
echo ""
print_success "🎉 Deploy concluído com sucesso!"
