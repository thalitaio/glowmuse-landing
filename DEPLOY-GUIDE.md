# 🚀 Guia de Deploy - GlowMuse Landing Page

## 📋 Opções de Deploy Recomendadas

### 🥇 **OPÇÃO 1: Railway (MAIS FÁCIL)**
- ✅ **Gratuito** para começar
- ✅ **Deploy automático** via GitHub
- ✅ **Banco PostgreSQL** incluído
- ✅ **HTTPS automático**
- ✅ **Zero configuração**

### 🥈 **OPÇÃO 2: Render**
- ✅ **Gratuito** com limitações
- ✅ **Deploy via GitHub**
- ✅ **Banco PostgreSQL** gratuito
- ✅ **HTTPS automático**

### 🥉 **OPÇÃO 3: Heroku**
- ✅ **Fácil de usar**
- ✅ **Banco PostgreSQL** (pago)
- ✅ **HTTPS automático**

### 🐳 **OPÇÃO 4: VPS com Docker**
- ✅ **Controle total**
- ✅ **Custo baixo**
- ✅ **Escalável**

---

## 🚀 **DEPLOY RÁPIDO - Railway (Recomendado)**

### **Passo 1: Preparar o Projeto**

1. **Criar repositório no GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - GlowMuse Landing Page"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/glowmuse-landing.git
git push -u origin main
```

2. **Configurar variáveis de ambiente:**
```bash
cp env.example .env
```

### **Passo 2: Deploy no Railway**

1. **Acesse:** https://railway.app
2. **Conecte** sua conta GitHub
3. **Clique** em "New Project"
4. **Selecione** "Deploy from GitHub repo"
5. **Escolha** seu repositório
6. **Railway detecta** automaticamente que é Node.js

### **Passo 3: Configurar Banco de Dados**

1. **Adicione** PostgreSQL:
   - Clique em "+ New"
   - Selecione "Database"
   - Escolha "PostgreSQL"

2. **Configure** as variáveis:
   - `DATABASE_URL` (automático)
   - `NODE_ENV=production`
   - `PORT` (automático)

### **Passo 4: Configurar Email (Opcional)**

1. **Adicione** as variáveis:
   - `EMAIL_HOST=smtp.gmail.com`
   - `EMAIL_PORT=587`
   - `EMAIL_USER=seu-email@gmail.com`
   - `EMAIL_PASS=sua-senha-app`

### **Passo 5: Deploy Automático**

1. **Railway faz** o deploy automaticamente
2. **Acesse** a URL fornecida
3. **Teste** o cadastro de leads
4. **Pronto!** 🎉

---

## 🐳 **DEPLOY COM DOCKER (VPS)**

### **Passo 1: Criar Dockerfile**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### **Passo 2: Criar docker-compose.yml**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/glowmuse
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=glowmuse
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### **Passo 3: Deploy no VPS**

```bash
# No seu VPS
git clone https://github.com/SEU_USUARIO/glowmuse-landing.git
cd glowmuse-landing
docker-compose up -d
```

---

## ⚙️ **CONFIGURAÇÃO DE PRODUÇÃO**

### **1. Atualizar server.js para Produção**

```javascript
// Usar PostgreSQL em produção
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

### **2. Configurar PM2 (Process Manager)**

```bash
npm install -g pm2
pm2 start server.js --name "glowmuse"
pm2 startup
pm2 save
```

### **3. Configurar Nginx (Proxy Reverso)**

```nginx
server {
    listen 80;
    server_name seudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 **SCRIPTS DE DEPLOY AUTOMATIZADO**

### **deploy-railway.sh**
```bash
#!/bin/bash
echo "🚀 Deploying to Railway..."

# Build and test locally
npm run build
npm test

# Push to GitHub
git add .
git commit -m "Deploy: $(date)"
git push origin main

echo "✅ Deploy initiated! Check Railway dashboard."
```

### **deploy-vps.sh**
```bash
#!/bin/bash
echo "🚀 Deploying to VPS..."

# Build Docker image
docker build -t glowmuse-landing .

# Deploy with docker-compose
docker-compose down
docker-compose up -d --build

echo "✅ Deploy completed!"
```

---

## 📊 **COMPARAÇÃO DAS OPÇÕES**

| Opção | Custo | Facilidade | Controle | Escalabilidade |
|-------|-------|------------|----------|----------------|
| Railway | Gratuito | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Render | Gratuito | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Heroku | Pago | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| VPS | Baixo | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎯 **RECOMENDAÇÃO FINAL**

### **Para começar rapidamente:**
**Use Railway** - É a opção mais fácil e gratuita!

### **Para ter controle total:**
**Use VPS com Docker** - Mais trabalho, mas controle completo!

---

## 🚨 **CHECKLIST PRÉ-DEPLOY**

- [ ] ✅ Código testado localmente
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Banco de dados configurado
- [ ] ✅ Email configurado (opcional)
- [ ] ✅ Domínio configurado (opcional)
- [ ] ✅ HTTPS configurado
- [ ] ✅ Backup configurado

---

## 🆘 **SUPORTE**

Se tiver problemas:
1. **Verifique** os logs do deploy
2. **Confirme** as variáveis de ambiente
3. **Teste** localmente primeiro
4. **Consulte** a documentação da plataforma

**Boa sorte com o deploy! 🚀✨**
