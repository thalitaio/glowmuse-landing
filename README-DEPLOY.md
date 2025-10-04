# 🚀 Deploy da GlowMuse Landing Page

## ⚡ Deploy Rápido (Recomendado)

### 🥇 **Railway (Mais Fácil)**
```bash
# 1. Configure o GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USUARIO/glowmuse-landing.git
git push -u origin main

# 2. Deploy automático
npm run deploy:railway
```

**Acesse:** https://railway.app → Conecte GitHub → Selecione repositório → Adicione PostgreSQL

---

### 🥈 **Render (Gratuito)**
```bash
# 1. Configure o GitHub (mesmo processo acima)
# 2. Deploy automático
npm run deploy:render
```

**Acesse:** https://render.com → Conecte GitHub → New Web Service → Configure

---

### 🐳 **Docker (VPS)**
```bash
# Deploy com Docker
npm run deploy:docker
```

**Acesse:** http://localhost:3000

---

## 📋 Checklist de Deploy

### ✅ **Antes do Deploy:**
- [ ] Código testado localmente
- [ ] Repositório GitHub criado
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado

### ✅ **Configurações Necessárias:**

#### **Railway/Render:**
```env
NODE_ENV=production
DATABASE_URL=postgresql://... (automático)
EMAIL_HOST=smtp.gmail.com (opcional)
EMAIL_USER=seu-email@gmail.com (opcional)
EMAIL_PASS=sua-senha-app (opcional)
```

#### **VPS/Docker:**
```env
NODE_ENV=production
DATABASE_URL=postgresql://glowmuse:glowmuse2024@db:5432/glowmuse
EMAIL_HOST=smtp.gmail.com (opcional)
EMAIL_USER=seu-email@gmail.com (opcional)
EMAIL_PASS=sua-senha-app (opcional)
```

---

## 🔧 **Comandos Úteis**

### **Deploy:**
```bash
npm run deploy:railway    # Deploy para Railway
npm run deploy:render     # Deploy para Render
npm run deploy:docker     # Deploy com Docker
```

### **Desenvolvimento:**
```bash
npm run dev              # Servidor de desenvolvimento
npm run dev-watch        # Com auto-reload
npm start                # Servidor de produção
```

### **Docker:**
```bash
docker-compose up -d     # Iniciar containers
docker-compose down      # Parar containers
docker-compose logs -f   # Ver logs
```

---

## 🌐 **URLs de Acesso**

### **Desenvolvimento:**
- Frontend: http://localhost:3000
- API: http://localhost:3000/api
- Health: http://localhost:3000/health

### **Produção:**
- Railway: https://SEU_PROJETO.railway.app
- Render: https://SEU_PROJETO.onrender.com
- VPS: https://SEU_DOMINIO.com

---

## 📊 **Monitoramento**

### **Logs:**
```bash
# Railway
railway logs

# Render
# Acesse o dashboard

# Docker
docker-compose logs -f
```

### **Banco de Dados:**
```bash
# Acessar banco (Docker)
docker-compose exec db psql -U glowmuse -d glowmuse

# Ver leads
./view-leads-secure.sh
```

---

## 🆘 **Solução de Problemas**

### **Erro de Conexão com Banco:**
1. Verifique se o DATABASE_URL está correto
2. Confirme se o banco está rodando
3. Teste a conexão localmente

### **Erro de Email:**
1. Configure as credenciais do Gmail
2. Use senha de app (não senha normal)
3. Verifique se o 2FA está ativado

### **Erro de Deploy:**
1. Verifique os logs da plataforma
2. Confirme se todas as dependências estão no package.json
3. Teste localmente primeiro

---

## 🎯 **Próximos Passos**

1. **Configure domínio personalizado** (opcional)
2. **Configure SSL/HTTPS** (automático na maioria das plataformas)
3. **Configure backup** do banco de dados
4. **Configure monitoramento** (opcional)
5. **Configure CDN** para performance (opcional)

---

## 📞 **Suporte**

Se tiver problemas:
1. Verifique os logs
2. Consulte a documentação da plataforma
3. Teste localmente primeiro
4. Verifique as variáveis de ambiente

**Boa sorte com o deploy! 🚀✨**
