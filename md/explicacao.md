# 🏥 Health Access Hub - Clínica Arco-Íris

> **Status do Projeto:** 🚀 Em Desenvolvimento (Fase de Reestruturação)
> **Equipa:** Joel Manuel & Saron

Este documento serve como o roteiro oficial para a implementação técnica do TCC. Todas as tarefas devem seguir a ordem cronológica abaixo para garantir a integridade dos dados e a segurança do sistema.

---

## 🛠️ 1. Infraestrutura e Base de Dados (Prioridade Alta)

- [ ] **Criar Base de Dados:** Executar o script SQL atualizado (21 tabelas em minúsculas).
- [ ] **Configurar `.env`:** Criar o ficheiro na raiz com as variáveis `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `SESSION_SECRET` e `PORT`.
- [ ] **Validar Conexão:** Garantir que o ficheiro `src/config/db.js` utiliza `mysql2/promise` e passa no teste de conectividade.
- [ ] **Instalação de Pacotes:** `npm install express mysql2 bcrypt jsonwebtoken dotenv express-session`.

## 🔐 2. Autenticação e Segurança

- [ ] **Middleware de Sessão:** Configurar o `express-session` no `server.js`.
- [ ] **Proteção de Rotas:** Criar `authMiddleware.js` com as funções `isLoggedIn` e `checkRole`.
- [ ] **Cadastro (Register):** Implementar transação SQL para inserir em `usuario` e `utente` simultaneamente.
- [ ] **Login:** Implementar comparação de hash com `bcrypt.compare` e criação de sessão.
- [ ] **Logout:** Rota para destruir a sessão e redirecionar para a página inicial.

## 📊 3. Desenvolvimento dos Dashboards

- [ ] **Frontend Base:** Criar a estrutura de pastas em `src/views/` (auth, utente, profissional, admin).
- [ ] **Dashboard Utente:** Listagem de dados de saúde e formulários para registos manuais.
- [ ] **Dashboard Profissional:** Visualização de alertas e gráficos dos utentes vinculados.
- [ ] **Dashboard Admin:** Gestão de utilizadores e configurações da clínica.

## ⌚ 4. Módulo IoT e Alertas

- [ ] **Simulador de Wearable:** Criar um script para enviar dados aleatórios (BPM/Temperatura) para a tabela `leitura_sensor`.
- [ ] **Lógica de Alertas:** Criar função que monitoriza as leituras e insere na tabela `alerta` se os valores forem críticos.
- [ ] **Integração Chart.js:** Renderizar gráficos em tempo real no dashboard usando os dados do banco.

## 💬 5. Comunicação e Finalização

- [ ] **Chat em Tempo Real:** Implementar Socket.IO utilizando as tabelas `conversa` e `mensagem`.
- [ ] **Documentação Técnica:** Gerar o Diagrama de Entidade-Relacionamento (DER) final.
- [ ] **Testes de Stress:** Validar se o sistema bloqueia acessos não autorizados a rotas restritas.
- [ ] **Apresentação:** Preparar uma base de dados com dados fictícios para a demonstração prática.

---

## 📂 Estrutura de Pastas Recomendada

```text
moniPlataSaude/
├── public/              # CSS, JS (Frontend), Imagens
├── src/
│   ├── config/          # db.js
│   ├── controllers/     # authController.js, chatController.js
│   ├── middleware/      # authMiddleware.js
│   ├── routes/          # authRoutes.js
│   └── views/           # login.html, dashboards...
├── .env                 # Variáveis sensíveis
├── server.js            # Entrada da aplicação
└── package.json         # Dependências
```
