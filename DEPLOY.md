# 🚀 Guia de Deploy - GlowMuse Landing Page

## 📋 Pré-requisitos

- Node.js 16+
- PostgreSQL 12+
- Servidor Linux (Ubuntu 20.04+ recomendado)
- Domínio configurado (glowmuse.com.br)

## 🛠️ Instalação Rápida

### 1. Clone e Configure
```bash
git clone <repository-url>
cd LP-glow
chmod +x install.sh
./install.sh
```

### 2. Configure as Variáveis de Ambiente
```bash
nano .env
```

Preencha com suas configurações:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/glowmuse_leads
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
ADMIN_EMAIL=admin@glowmuse.com.br
```

### 3. Inicie o Servidor
```bash
npm start
```

## 🐳 Deploy com Docker

### Opção 1: Docker Compose (Recomendado)
```bash
# Configure as variáveis de ambiente
cp env.example .env
nano .env

# Inicie os serviços
docker-compose up -d

# Verifique os logs
docker-compose logs -f
```

### Opção 2: Docker Individual
```bash
# Build da imagem
docker build -t glowmuse-landing .

# Execute o container
docker run -d \
  --name glowmuse-app \
  -p 3000:3000 \
  --env-file .env \
  glowmuse-landing
```

## 🌐 Deploy em Produção

### 1. Servidor VPS (DigitalOcean, Linode, etc.)

```bash
# Atualize o sistema
sudo apt update && sudo apt upgrade -y

# Instale dependências
sudo apt install -y nginx postgresql postgresql-contrib certbot python3-certbot-nginx

# Configure o PostgreSQL
sudo -u postgres createdb glowmuse_leads
sudo -u postgres psql -d glowmuse_leads -f database.sql

# Configure o Nginx
sudo cp nginx.conf /etc/nginx/sites-available/glowmuse
sudo ln -s /etc/nginx/sites-available/glowmuse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Configure SSL com Let's Encrypt
sudo certbot --nginx -d glowmuse.com.br -d www.glowmuse.com.br

# Configure PM2 para gerenciar o processo
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 2. Heroku

```bash
# Instale o Heroku CLI
# Configure as variáveis de ambiente no dashboard
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=postgresql://...
heroku config:set EMAIL_USER=seu-email@gmail.com
heroku config:set EMAIL_PASS=sua-senha-de-app
heroku config:set ADMIN_EMAIL=admin@glowmuse.com.br

# Deploy
git push heroku main
```

### 3. Vercel

```bash
# Instale o Vercel CLI
npm i -g vercel

# Configure as variáveis de ambiente
vercel env add DATABASE_URL
vercel env add EMAIL_USER
vercel env add EMAIL_PASS
vercel env add ADMIN_EMAIL

# Deploy
vercel --prod
```

## 🔧 Configurações de Produção

### 1. Banco de Dados
- Use um banco gerenciado (AWS RDS, Google Cloud SQL, etc.)
- Configure backups automáticos
- Monitore performance

### 2. Email
- Configure SPF, DKIM e DMARC
- Use um serviço de email transacional (SendGrid, Mailgun, etc.)
- Monitore deliverability

### 3. Monitoramento
- Configure logs centralizados
- Use ferramentas de monitoramento (New Relic, DataDog, etc.)
- Configure alertas

### 4. Segurança
- Configure firewall
- Use HTTPS obrigatório
- Configure rate limiting
- Monitore tentativas de ataque

## 📊 Monitoramento e Manutenção

### Health Check
```bash
curl https://glowmuse.com.br/api/health
```

### Logs
```bash
# PM2 logs
pm2 logs glowmuse-landing

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Database logs
sudo tail -f /var/log/postgresql/postgresql.log
```

### Backup
```bash
# Database backup
pg_dump glowmuse_leads > backup_$(date +%Y%m%d).sql

# Files backup
tar -czf backup_$(date +%Y%m%d).tar.gz /path/to/app
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de Conexão com Banco**
   - Verifique se o PostgreSQL está rodando
   - Confirme as credenciais no .env
   - Teste a conexão: `psql -d glowmuse_leads`

2. **Erro de Email**
   - Verifique as credenciais do Gmail
   - Confirme se a senha de app está correta
   - Teste com outro provedor de email

3. **Erro 500**
   - Verifique os logs do servidor
   - Confirme se todas as variáveis de ambiente estão definidas
   - Teste localmente primeiro

4. **Problemas de Performance**
   - Configure cache no Nginx
   - Otimize as consultas do banco
   - Use CDN para assets estáticos

## 📞 Suporte

- **Email**: dev@glowmuse.com.br
- **Documentação**: README.md
- **Issues**: GitHub Issues

---

**GlowMuse** - Sua profissão merece respeito. Sua história merece espaço.
