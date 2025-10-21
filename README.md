# GlowMuse Landing Page

Landing page moderna e responsiva para captura de leads da GlowMuse, site de anúncios para acompanhantes.

## 🚀 Características

- **Design Responsivo**: Otimizado para desktop, tablet e mobile
- **SEO Otimizado**: Meta tags, structured data e performance
- **Segurança**: Rate limiting, validação de dados e sanitização
- **Banco de Dados**: PostgreSQL com schema otimizado
- **Email Marketing**: Envio automático de emails de boas-vindas
- **Analytics**: Preparado para Google Analytics e Facebook Pixel

## 🎨 Design

- **Cores da Marca**: 
  - Rosa principal: `#c2767b`
  - Marrom escuro: `#5a1e2e`
  - Creme claro: `#faf3ef`
  - Cinza escuro: `#4a4a4a`
  - Bege quente: `#d1a37d`

- **Tipografia**:
  - Títulos: Playfair Display (serif)
  - Corpo: Poppins (sans-serif)

## 🛠️ Tecnologias

### Frontend
- HTML5 semântico
- CSS3 com variáveis customizadas
- JavaScript vanilla (ES6+)
- Design responsivo com CSS Grid e Flexbox

### Backend
- Node.js
- Express.js
- PostgreSQL
- Nodemailer (envio de emails)
- Express Rate Limit (proteção contra spam)
- Helmet (segurança)

## 📦 Instalação

### Pré-requisitos
- Node.js 16+ 
- PostgreSQL 12+
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone <repository-url>
cd LP-glow
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
# Crie o banco de dados
createdb glowmuse_leads

# Execute o schema
psql -d glowmuse_leads -f database.sql
```

4. **Configure as variáveis de ambiente**
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

5. **Inicie o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## ⚙️ Configuração

### Variáveis de Ambiente (.env)

```env
# Servidor
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://glowmuse.com.br

# Banco de Dados
DATABASE_URL=postgresql://user:pass@localhost:5432/glowmuse_leads

# Email (Gmail)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
ADMIN_EMAIL=admin@glowmuse.com.br

# Segurança
JWT_SECRET=seu-jwt-secret-super-seguro
SESSION_SECRET=seu-session-secret-super-seguro
```

### Configuração do Gmail

1. Ative a verificação em 2 etapas
2. Gere uma senha de app específica
3. Use essa senha no campo `EMAIL_PASS`

## 📊 Estrutura do Banco de Dados

### Tabela `leads`
- `id`: Chave primária (SERIAL)
- `name`: Nome completo (VARCHAR 100)
- `email`: Email único (VARCHAR 255)
- `phone`: Telefone formatado (VARCHAR 20)
- `created_at`: Data de criação (TIMESTAMP)
- `updated_at`: Data de atualização (TIMESTAMP)
- `ip_address`: IP do usuário (INET)
- `user_agent`: User agent do navegador (TEXT)
- `source`: Origem do lead (VARCHAR 50)
- `status`: Status do lead (VARCHAR 20)
- `notes`: Observações (TEXT)

## 🔒 Segurança

- **Rate Limiting**: 100 requests por IP a cada 15 minutos
- **Validação de Dados**: Sanitização e validação de todos os inputs
- **Headers de Segurança**: Helmet.js configurado
- **CORS**: Configurado para domínios específicos
- **SQL Injection**: Protegido com prepared statements

## 📈 SEO

- Meta tags otimizadas
- Structured data (JSON-LD)
- Open Graph e Twitter Cards
- Sitemap.xml (gerado automaticamente)
- Performance otimizada
- Imagens com alt text

## 🚀 Deploy

### Heroku
```bash
# Instale o Heroku CLI
# Configure as variáveis de ambiente no dashboard
# Conecte o repositório
heroku git:remote -a glowmuse-landing
git push heroku main
```

### Vercel
```bash
# Instale o Vercel CLI
npm i -g vercel
vercel --prod
```

### DigitalOcean App Platform
1. Conecte o repositório
2. Configure as variáveis de ambiente
3. Deploy automático

## 📱 Funcionalidades

### Formulário de Captura
- Validação em tempo real
- Formatação automática do telefone
- Feedback visual de sucesso/erro
- Prevenção de duplicatas

### Email Marketing
- Email de boas-vindas automático
- Notificação para admin
- Template responsivo
- Tracking de abertura (opcional)

### Analytics
- Google Analytics 4
- Facebook Pixel
- Eventos de conversão
- Métricas de performance

## 🔧 Manutenção

### Backup do Banco
```bash
pg_dump glowmuse_leads > backup_$(date +%Y%m%d).sql
```

### Logs
```bash
# Logs do servidor
pm2 logs glowmuse-landing

# Logs do banco
tail -f /var/log/postgresql/postgresql.log
```

### Monitoramento
- Health check: `GET /api/health`
- Contagem de leads: `GET /api/leads/count`
- Métricas de performance

## 📞 Suporte

Para dúvidas ou problemas:
- Email: dev@glowmuse.com.br
- Issues: GitHub Issues
- Documentação: Este README

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

---

**GlowMuse** - Sua profissão merece respeito. Sua história merece espaço.
