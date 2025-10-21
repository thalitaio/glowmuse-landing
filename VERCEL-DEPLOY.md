# 🚀 Deploy na Vercel - GlowMuse Landing Page

## 📋 Pré-requisitos

- ✅ Conta na [Vercel](https://vercel.com)
- ✅ Projeto no GitHub
- ✅ Supabase configurado (já está!)
- ✅ Variáveis de ambiente do Supabase

## 🔧 Configuração

### 1. **Conectar GitHub à Vercel**

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **"New Project"**
4. Selecione o repositório `glowmuse-landing-page`
5. Clique em **"Import"**

### 2. **Configurar Variáveis de Ambiente**

No dashboard da Vercel, vá em **Settings > Environment Variables** e adicione:

```bash
# Supabase (OBRIGATÓRIO)
SUPABASE_URL=https://owsplwuwjkklwnfajddj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93c3Bsd3V3amtrbHduZmFqZGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4Nzg2MjgsImV4cCI6MjA3NjQ1NDYyOH0.saZai4dgFkZWbWBHCgMPtxrVkydBbUfQhQt1n4vj3Tk

# Environment
NODE_ENV=production

# Email (OPCIONAL - se quiser reativar)
EMAIL_USER=contatothalitanunes@gmail.com
EMAIL_PASS=dntupottcweqhada
ADMIN_EMAIL=thalita@glowmuse.com.br
```

### 3. **Configurações do Projeto**

- **Framework Preset**: `Other`
- **Root Directory**: `./` (raiz)
- **Build Command**: `npm run build` (ou deixar vazio)
- **Output Directory**: `./` (raiz)
- **Install Command**: `npm install`

**⚠️ Importante**: Com o `vercel.json` simplificado, essas configurações serão aplicadas normalmente.

## 🚀 Deploy

### **Deploy Automático**

1. **Push para main**: O deploy acontece automaticamente
2. **Preview Deploys**: Cada PR gera um preview
3. **Custom Domains**: Configure domínio personalizado se necessário

### **Deploy Manual**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

## 📁 Arquivos de Configuração

### **vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "server.js": {
      "maxDuration": 30
    }
  }
}
```

### **package.json** (já configurado)
- ✅ Scripts para Vercel
- ✅ Dependências corretas
- ✅ Engines especificados

## 🔍 Verificação Pós-Deploy

### **1. Testar Endpoints**

```bash
# Testar página principal
curl https://seu-projeto.vercel.app/

# Testar API de leads
curl -X POST https://seu-projeto.vercel.app/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@teste.com","phone":"11999999999"}'

# Testar contagem de leads
curl https://seu-projeto.vercel.app/api/leads/count
```

### **2. Verificar Logs**

- Acesse **Functions** no dashboard da Vercel
- Veja logs em tempo real
- Monitore erros e performance

### **3. Testar Funcionalidades**

- ✅ Modal de verificação de idade
- ✅ Formulário de cadastro
- ✅ Conexão com Supabase
- ✅ Botões CTA funcionando
- ✅ Responsividade

## 🆚 Vercel vs Render

| Aspecto | Vercel | Render |
|---------|--------|--------|
| **Performance** | ⚡ Edge Network | 🐌 Global |
| **Deploy** | ⚡ Instantâneo | 🐌 2-4 min |
| **Preview** | ✅ PR Previews | ❌ Não tem |
| **Domínio** | ✅ .vercel.app | ✅ Custom |
| **SSL** | ✅ Automático | ✅ Automático |
| **Logs** | ✅ Tempo real | ✅ Tempo real |
| **Custo** | 💰 Free tier generoso | 💰 Free tier limitado |

## 🎯 Vantagens da Vercel

### **✅ Performance**
- **Edge Network**: CDN global
- **Cold Start**: < 100ms
- **Caching**: Automático

### **✅ Developer Experience**
- **Git Integration**: Deploy automático
- **Preview Deploys**: Teste antes de publicar
- **Analytics**: Métricas detalhadas
- **CLI**: Deploy via terminal

### **✅ Escalabilidade**
- **Auto-scaling**: Escala automaticamente
- **Global**: Disponível mundialmente
- **Reliability**: 99.99% uptime

## 🔧 Troubleshooting

### **Erro: "No Output Directory named 'public' found"**
**Causa**: Vercel tentando usar configurações para projeto estático
**Solução**:
1. **Configurações do Projeto**:
   - Build Command: (deixar vazio)
   - Output Directory: (deixar vazio)
2. **Verificar vercel.json**: Deve ter apenas `builds` e `routes`
3. **Redeploy**: Fazer novo deploy após correções

### **Erro: "The `functions` property cannot be used in conjunction with the `builds` property"**
**Causa**: Conflito entre propriedades `functions` e `builds` no vercel.json
**Solução**:
1. **Remover propriedade `functions`** do vercel.json
2. **Manter apenas `builds` e `routes`**
3. **Redeploy**: Fazer novo deploy após correções

### **Erro: CSS/JS não carregando (página sem estilo)**
**Causa**: Arquivos estáticos não sendo servidos corretamente
**Solução**:
1. **Verificar vercel.json**: Deve ter rotas para arquivos estáticos
2. **Verificar server.js**: Deve ter `express.static` configurado
3. **Headers corretos**: CSS e JS devem ter Content-Type correto
4. **Redeploy**: Fazer novo deploy após correções

### **Warning: "Due to `builds` existing in your configuration file"**
**Causa**: Conflito entre `vercel.json` e configurações do dashboard
**Solução**:
1. **Simplificar vercel.json**: Usar apenas `functions` em vez de `builds`
2. **Configurações do dashboard**: Serão aplicadas normalmente
3. **Redeploy**: Fazer novo deploy após correções

### **Erro: Function timeout**
```json
// vercel.json
{
  "functions": {
    "server.js": {
      "maxDuration": 30
    }
  }
}
```

### **Erro: Environment variables**
- Verificar se todas as variáveis estão configuradas
- Verificar se os nomes estão corretos
- Fazer redeploy após alterar variáveis

### **Erro: Build failed**
- Verificar se todas as dependências estão no `package.json`
- Verificar se não há erros de sintaxe
- Verificar logs de build

## 📊 Monitoramento

### **Vercel Analytics**
- Acesse **Analytics** no dashboard
- Veja métricas de performance
- Monitore erros e uptime

### **Logs**
- **Functions**: Logs das funções serverless
- **Build**: Logs do processo de build
- **Runtime**: Logs em tempo real

## 🎉 Resultado Final

Após o deploy, você terá:

- ✅ **URL**: `https://seu-projeto.vercel.app`
- ✅ **Performance**: Edge network global
- ✅ **Deploy**: Automático via GitHub
- ✅ **Preview**: Deploys de PR
- ✅ **Analytics**: Métricas detalhadas
- ✅ **SSL**: Certificado automático
- ✅ **Supabase**: Conectado e funcionando

## 🚀 Próximos Passos

1. **Configurar domínio personalizado** (opcional)
2. **Configurar analytics** (opcional)
3. **Monitorar performance** e logs
4. **Configurar notificações** de deploy

---

**🎯 Sua aplicação estará rodando na Vercel com performance superior ao Render!**
