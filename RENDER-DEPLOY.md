# 🚀 Deploy no Render - GlowMuse Landing Page

## 📋 **Configuração do Render**

### **1. Criar novo serviço no Render**

1. Acesse [render.com](https://render.com)
2. Faça login na sua conta
3. Clique em "New +" → "Web Service"
4. Conecte seu repositório GitHub
5. Selecione o repositório `LP-glow`

### **2. Configurações do Serviço**

- **Name**: `glowmuse-landing`
- **Environment**: `Node`
- **Region**: `Oregon (US West)`
- **Branch**: `main` ou `migrar-banco-dados`
- **Root Directory**: `/` (deixar vazio)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### **3. Variáveis de Ambiente**

Adicione as seguintes variáveis de ambiente no painel do Render:

```bash
# Supabase Configuration
SUPABASE_URL=https://owsplwuwjkklwnfajddj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93c3Bsd3V3amtrbHduZmFqZGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4Nzg2MjgsImV4cCI6MjA3NjQ1NDYyOH0.saZai4dgFkZWbWBHCgMPtxrVkydBbUfQhQt1n4vj3Tk

# Environment
NODE_ENV=production

# Email Configuration (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app_gmail
ADMIN_EMAIL=admin@glowmuse.com.br

# Zapier Integration (opcional)
ZAPIER_API_KEY=sua_chave_zapier_super_secreta
```

### **4. Deploy**

1. Clique em "Create Web Service"
2. Aguarde o build e deploy (2-3 minutos)
3. Acesse a URL fornecida pelo Render

## ✅ **Verificação Pós-Deploy**

### **1. Testar API**
```bash
curl https://seu-app.onrender.com/api/health
```

### **2. Testar Cadastro**
```bash
curl -X POST https://seu-app.onrender.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Render",
    "email": "teste@render.com",
    "phone": "(11) 99999-9999"
  }'
```

### **3. Verificar no Supabase**
- Acesse o dashboard do Supabase
- Verifique se o lead foi cadastrado na tabela `leads`

## 🔧 **Troubleshooting**

### **Erro de Build**
- Verifique se todas as dependências estão no `package.json`
- Confirme se o comando `npm install` está funcionando

### **Erro de Conexão Supabase**
- Verifique se as variáveis `SUPABASE_URL` e `SUPABASE_ANON_KEY` estão corretas
- Confirme se o projeto Supabase está ativo

### **Erro 500 na API**
- Verifique os logs do Render
- Confirme se a tabela `leads` existe no Supabase

## 📊 **Monitoramento**

- **Logs**: Acesse a aba "Logs" no painel do Render
- **Métricas**: Monitore CPU, memória e requisições
- **Supabase**: Monitore uso do banco no dashboard

## 🎯 **Resultado Esperado**

- ✅ Aplicação rodando no Render
- ✅ Frontend acessível via URL do Render
- ✅ Cadastro de leads funcionando
- ✅ Dados salvos no Supabase
- ✅ API endpoints funcionando

---

**🎉 Sua aplicação estará online e funcionando com Supabase!**
