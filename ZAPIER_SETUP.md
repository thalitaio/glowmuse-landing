# 🔌 Zapier + GlowMuse - Configuração

## 📋 **Endpoints Disponíveis**

### **1. Buscar Leads**
```
GET https://glowmuse.com.br/api/zapier/leads
```

**Parâmetros:**
- `limit` (opcional): Número de leads por página (padrão: 100)
- `offset` (opcional): Página atual (padrão: 0)
- `status` (opcional): Filtrar por status (`new`, `recent`, `all`)

**Exemplo:**
```
https://glowmuse.com.br/api/zapier/leads?limit=50&status=new
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "(11) 99999-9999",
      "created_at": "2024-01-15T10:30:00Z",
      "ip_address": "192.168.1.1",
      "lead_status": "new"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 1
  }
}
```

### **2. Webhook para Novos Leads**
```
POST https://glowmuse.com.br/api/zapier/webhook
```

**Body:**
```json
{
  "event": "new_lead",
  "data": {
    "lead_id": 1,
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

## 🚀 **Configuração no Zapier**

### **Passo 1: Criar Zap**
1. Acesse [zapier.com](https://zapier.com)
2. Clique em "Create Zap"
3. Escolha "Webhooks by Zapier" como Trigger

### **Passo 2: Configurar Trigger**
1. **Trigger**: "Catch Hook"
2. **URL**: `https://glowmuse.com.br/api/zapier/leads`
3. **Method**: GET
4. **Query String**: `limit=1&status=new`
5. **Teste** o trigger para ver se está funcionando

### **Passo 3: Configurar Action**
Escolha uma das opções:

#### **Opção A: Gmail**
1. **Action**: "Send Email"
2. **To**: `{{email}}`
3. **Subject**: "Bem-vindo ao GlowMuse, {{name}}!"
4. **Body**: Template personalizado

#### **Opção B: Mailchimp**
1. **Action**: "Add Subscriber"
2. **List**: Sua lista do Mailchimp
3. **Email**: `{{email}}`
4. **First Name**: `{{name}}`
5. **Phone**: `{{phone}}`

#### **Opção C: Slack**
1. **Action**: "Send Channel Message"
2. **Channel**: #leads
3. **Message**: "🎉 Novo lead: {{name}} ({{email}})"

### **Passo 4: Testar e Ativar**
1. **Test** o Zap
2. **Turn on** se estiver funcionando
3. **Monitor** os logs no Zapier

## 📊 **Exemplos de Automações**

### **1. Email de Boas-vindas**
```
Trigger: Novo lead cadastrado
Action: Enviar email via Gmail
Template: "Olá {{name}}, obrigado por se cadastrar!"
```

### **2. Notificação no Slack**
```
Trigger: Novo lead cadastrado
Action: Enviar mensagem no Slack
Mensagem: "🎉 Novo lead: {{name}} ({{email}}) - {{phone}}"
```

### **3. Adicionar ao Mailchimp**
```
Trigger: Novo lead cadastrado
Action: Adicionar à lista do Mailchimp
Tags: "glowmuse-lead", "{{lead_status}}"
```

### **4. Criar Tarefa no Trello**
```
Trigger: Novo lead cadastrado
Action: Criar card no Trello
Título: "Follow-up: {{name}}"
Descrição: "Email: {{email}} | Telefone: {{phone}}"
```

## 🔧 **Configurações Avançadas**

### **Filtros por Status**
- `status=new`: Leads dos últimos 24h
- `status=recent`: Leads dos últimos 7 dias
- `status=all`: Todos os leads

### **Paginação**
- `limit=50`: 50 leads por vez
- `offset=0`: Primeira página
- `offset=50`: Segunda página

### **Webhook para Tempo Real**
Se quiser notificações em tempo real, configure um webhook que chama:
```
POST https://glowmuse.com.br/api/zapier/webhook
```

## 🚨 **Troubleshooting**

### **Erro 404**
- Verifique se a URL está correta
- Confirme se o servidor está rodando

### **Erro 500**
- Verifique os logs do servidor
- Confirme se o banco está conectado

### **Dados não aparecem**
- Verifique se há leads no banco
- Teste o endpoint diretamente no navegador

## 📞 **Suporte**

Se precisar de ajuda:
1. Verifique os logs do servidor
2. Teste os endpoints manualmente
3. Verifique a configuração do Zapier
4. Entre em contato para suporte técnico

---

**🎯 Próximos passos:**
1. Teste os endpoints
2. Configure seu primeiro Zap
3. Monitore os resultados
4. Expanda as automações conforme necessário
