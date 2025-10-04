#!/bin/bash

echo "🐳 GlowMuse - Deploy com Docker"
echo "==============================="
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

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    print_error "Docker não está instalado!"
    echo "Instale o Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose não está instalado!"
    echo "Instale o Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# Verificar se está no diretório correto
if [ ! -f "docker-compose.yml" ]; then
    print_error "Execute este script no diretório do projeto!"
    exit 1
fi

# Parar containers existentes
print_status "Parando containers existentes..."
docker-compose down

# Remover imagens antigas (opcional)
read -p "Remover imagens antigas? (y/N): " remove_images
if [[ $remove_images =~ ^[Yy]$ ]]; then
    print_status "Removendo imagens antigas..."
    docker-compose down --rmi all
fi

# Construir e iniciar containers
print_status "Construindo e iniciando containers..."
docker-compose up -d --build

if [ $? -eq 0 ]; then
    print_success "Containers iniciados com sucesso!"
else
    print_error "Erro ao iniciar containers!"
    exit 1
fi

# Aguardar o banco de dados inicializar
print_status "Aguardando banco de dados inicializar..."
sleep 10

# Verificar se os serviços estão rodando
print_status "Verificando status dos serviços..."
docker-compose ps

# Testar a aplicação
print_status "Testando aplicação..."
sleep 5

if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    print_success "✅ Aplicação funcionando!"
    echo ""
    print_status "🌐 Aplicação disponível em:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - API: http://localhost:3000/api"
    echo "   - Health: http://localhost:3000/health"
    echo ""
    print_status "📊 Banco de dados PostgreSQL:"
    echo "   - Host: localhost:5432"
    echo "   - Database: glowmuse"
    echo "   - User: glowmuse"
    echo "   - Password: glowmuse2024"
    echo ""
    print_status "🔧 Comandos úteis:"
    echo "   - Ver logs: docker-compose logs -f"
    echo "   - Parar: docker-compose down"
    echo "   - Reiniciar: docker-compose restart"
    echo "   - Acessar banco: docker-compose exec db psql -U glowmuse -d glowmuse"
    echo ""
    print_success "🎉 Deploy concluído com sucesso!"
else
    print_warning "Aplicação pode estar inicializando ainda..."
    print_status "Verifique os logs: docker-compose logs -f"
fi
