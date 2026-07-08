<div align="center">

# Health Access Hub

**Plataforma de Monitoramento de Saúde**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![ESP32](https://img.shields.io/badge/ESP32-IoT-E7352C?style=flat-square)](https://www.espressif.com/)
[![Licença Académica](https://img.shields.io/badge/Licença-Académica-blue?style=flat-square)](#-licença)

_Desenvolvido como Trabalho de Conclusão de Curso (TCC) — Pensador do Futuro, 2026_

</div>

---

## 📋 Índice

1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Funcionalidades](#-funcionalidades)
3. [Tecnologias](#-tecnologias)
4. [Pré-requisitos](#-pré-requisitos)
5. [Instalação](#-instalação)
6. [Como Usar](#-como-usar)
7. [Contribuindo](#-contribuindo)
8. [Licença](#-licença)

---

## 🩺 Sobre o Projeto

O sector da saúde em Angola, à semelhança de muitos países em desenvolvimento, enfrenta desafios estruturais significativos: filas de espera prolongadas, registos médicos dispersos em papel, dificuldade de comunicação entre profissionais de saúde e pacientes, e ausência de sistemas integrados de monitoramento remoto. Estes problemas comprometem directamente a qualidade dos cuidados prestados e o acesso atempado aos serviços de saúde.

O **Health Access Hub** nasce como resposta directa a estes desafios. Trata-se de uma plataforma digital de gestão clínica desenvolvida para a **Clínica Arco-Íris**, com o objectivo de digitalizar, centralizar e optimizar todos os processos clínicos e administrativos da instituição.

### 🎯 Proposta de Valor

A solução propõe uma transformação digital completa do fluxo de trabalho clínico: desde o agendamento de consultas até ao acompanhamento pós-consulta, passando pela gestão de utentes, comunicação em tempo real entre médicos e pacientes, e futura integração com dispositivos IoT de monitoramento de sinais vitais.

Ao centralizar a informação clínica numa única plataforma segura e acessível, o Health Access Hub elimina redundâncias, reduz erros humanos associados ao registo manual e permite que os profissionais de saúde tomem decisões clínicas mais informadas e atempadas.

### 👥 Benefícios por Perfil

| Perfil        | Benefícios                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Pacientes** | Agendamento online, acesso ao historial clínico, comunicação directa com o médico, monitoramento remoto de saúde |
| **Médicos**   | Dashboard personalizado, calendário de consultas, chat integrado, acesso a dados biomédicos em tempo real        |
| **Clínica**   | Gestão centralizada, redução de papel, controlo administrativo completo, relatórios e estatísticas               |

### 🔌 Integração IoT

O sistema está arquitectado para suportar a integração futura com dispositivos de monitoramento biomédico baseados em **ESP32**, permitindo a recolha de dados como temperatura corporal, frequência cardíaca e saturação de oxigénio directamente na plataforma web — em tempo real e de forma segura. Esta camada de monitoramento remoto representa o próximo passo na evolução do sistema para uma solução de saúde verdadeiramente conectada.

---

## ✨ Funcionalidades

### 👤 Gestão de Utilizadores

- [x] Autenticação segura com JWT (login e logout)
- [x] Gestão de perfis de acesso por papel (administrador, médico, recepcionista)
- [x] Criação, edição e desactivação de contas de utilizador
- [x] Recuperação de palavra-passe

### 🧑‍⚕️ Gestão de Utentes

- [x] Cadastro completo de pacientes com dados pessoais e clínicos
- [x] Actualização e consulta de informações do utente
- [x] Pesquisa avançada por nome, número de processo ou contacto
- [x] Histórico de consultas por utente

### 👨‍⚕️ Gestão de Médicos

- [x] Cadastro de médicos com número de cédula e especialidade
- [x] Definição de horários e disponibilidade semanal
- [x] Gestão de especialidades clínicas
- [x] Associação de médico a consultas e utentes

### 📅 Agendamento de Consultas

- [x] Marcação de consultas com selecção de médico, data e hora
- [x] Reagendamento e cancelamento de consultas
- [x] Confirmação de presença pelo paciente ou recepcionista
- [x] Verificação automática de conflitos de horário
- [x] Envio de notificações de confirmação

### 📊 Dashboard Médico

- [x] Resumo diário de consultas agendadas
- [x] Estatísticas de atendimento (consultas realizadas, canceladas, pendentes)
- [x] Calendário interactivo com visualização semanal e mensal
- [x] Indicadores de desempenho clínico

### 💬 Chat em Tempo Real

- [x] Comunicação instantânea entre médico e paciente
- [x] Actualização em tempo real utilizando **Socket.IO**
- [x] Histórico de conversas persistido na base de dados
- [x] Indicador de presença online

### 🩻 Monitoramento de Saúde _(em desenvolvimento)_

- [ ] Integração com dispositivo ESP32
- [ ] Leitura de temperatura corporal via sensor DS18B20
- [ ] Leitura de frequência cardíaca
- [ ] Medição de saturação de oxigénio (SpO₂)
- [ ] Visualização de sinais vitais em tempo real no dashboard
- [ ] Display OLED para apresentação local dos dados

### 🔐 Administração

- [x] Painel de gestão de utilizadores e permissões
- [x] Controlo total de acessos por papel
- [x] Auditoria de acções no sistema
- [x] Configurações gerais da clínica

---

## 🛠️ Tecnologias

### Frontend

| Tecnologia                                                                                                                      | Descrição                         |
| ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white&style=flat-square) **HTML5**                     | Estrutura semântica das páginas   |
| ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white&style=flat-square) **CSS3**                         | Estilos e animações               |
| ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat-square) **JavaScript** | Lógica do lado do cliente         |
| ![Bootstrap](https://img.shields.io/badge/-Bootstrap-7952B3?logo=bootstrap&logoColor=white&style=flat-square) **Bootstrap 5**   | Framework de interface responsiva |
| **Font Awesome**                                                                                                                | Biblioteca de ícones vectoriais   |

### Backend

| Tecnologia                                                                                                                | Descrição                                   |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat-square) **Node.js**       | Ambiente de execução JavaScript no servidor |
| ![Express](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white&style=flat-square) **Express.js** | Framework minimalista para APIs REST        |

### Base de Dados

| Tecnologia                                                                                                    | Descrição                                     |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white&style=flat-square) **MySQL 8** | Sistema de gestão de base de dados relacional |

### Comunicação

| Tecnologia                                                                                                                  | Descrição                                           |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| ![Socket.IO](https://img.shields.io/badge/-Socket.IO-010101?logo=socket.io&logoColor=white&style=flat-square) **Socket.IO** | Comunicação bidirecional em tempo real (WebSockets) |

### Hardware (IoT)

| Componente                        | Função                                              |
| --------------------------------- | --------------------------------------------------- |
| **ESP32**                         | Microcontrolador principal do dispositivo biomédico |
| **Display OLED SSD1306**          | Apresentação local dos dados de saúde               |
| **Sensor DS18B20**                | Leitura de temperatura corporal                     |
| **Sensor de frequência cardíaca** | Monitoramento do ritmo cardíaco                     |
| **Sensor de SpO₂**                | Medição da saturação de oxigénio no sangue          |

### Ferramentas de Desenvolvimento

| Ferramenta                                                                                                                       | Descrição                                |
| -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| ![Git](https://img.shields.io/badge/-Git-F05032?logo=git&logoColor=white&style=flat-square) **Git**                              | Controlo de versões                      |
| ![GitHub](https://img.shields.io/badge/-GitHub-181717?logo=github&logoColor=white&style=flat-square) **GitHub**                  | Alojamento do repositório e colaboração  |
| ![VS Code](https://img.shields.io/badge/-VS%20Code-007ACC?logo=visual-studio-code&logoColor=white&style=flat-square) **VS Code** | Editor de código principal               |
| **Arduino IDE**                                                                                                                  | Desenvolvimento do firmware para o ESP32 |

---

## ✅ Pré-requisitos

Antes de instalar e executar o projecto, certifique-se de que possui os seguintes requisitos instalados no seu sistema:

- **[Node.js](https://nodejs.org/) (v18 ou superior)** — Ambiente de execução necessário para correr o servidor Express. Inclui o `npm` automaticamente.

- **[npm](https://www.npmjs.com/) (v9 ou superior)** — Gestor de pacotes do Node.js, utilizado para instalar todas as dependências do projecto. Vem incluído com o Node.js.

- **[MySQL](https://www.mysql.com/) (v8 ou superior)** — Sistema de base de dados relacional onde são armazenados todos os dados clínicos e de utilizadores. Pode ser instalado localmente ou via Docker.

- **[Git](https://git-scm.com/)** — Sistema de controlo de versões necessário para clonar o repositório e gerir alterações ao código.

- **Navegador moderno** — Google Chrome, Mozilla Firefox, Microsoft Edge ou Safari, com suporte a ES6+ e WebSockets. Recomenda-se a versão mais recente.

> **Nota:** Para o desenvolvimento do firmware do dispositivo IoT, é necessário instalar também a **Arduino IDE** com suporte à placa ESP32.

---

## 🚀 Instalação

Siga os passos abaixo para configurar e executar o projecto localmente.

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-utilizador/health-access-hub.git
```

### 2. Entrar na pasta do projecto

```bash
cd health-access-hub
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar a base de dados

Aceda ao MySQL e crie a base de dados do projecto:

```sql
CREATE DATABASE health_access_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Em seguida, importe o esquema da base de dados:

```bash
mysql -u root -p health_access_hub < database/schema.sql
```

### 5. Configurar as variáveis de ambiente

Crie um ficheiro `.env` na raiz do projecto com base no exemplo abaixo:

```bash
cp .env.example .env
```

Edite o ficheiro `.env` com as suas configurações:

```env
# Base de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=health_access_hub
DB_PORT=3306

# Servidor
PORT=3000

# Autenticação
JWT_SECRET=insira_aqui_um_segredo_forte_e_longo
JWT_EXPIRES_IN=7d

# Ambiente
NODE_ENV=development
```

> ⚠️ **Atenção:** Nunca partilhe o ficheiro `.env` nem o submeta ao repositório. Este ficheiro já está incluído no `.gitignore`.

### 6. Iniciar a aplicação

**Modo de produção:**

```bash
npm start
```

**Modo de desenvolvimento** (com reinício automático via Nodemon):

```bash
nodemon server.js
```

A aplicação estará disponível em: **[http://localhost:3000](http://localhost:3000)**

---

## 📖 Como Usar

Após iniciar a aplicação, siga este guia para começar a utilizar o Health Access Hub.

### 1. 🔐 Iniciar sessão

Aceda a `http://localhost:3000` e introduza as suas credenciais. O sistema redireccionará automaticamente para o dashboard correspondente ao seu papel (administrador, médico ou recepcionista).

> **Credenciais de teste (modo desenvolvimento):**
>
> - Administrador: `admin@clinica.ao` / `admin123`
> - Médico: `medico@clinica.ao` / `medico123`

### 2. 📊 Aceder ao Dashboard

Após autenticação, o dashboard apresenta um resumo em tempo real das consultas do dia, estatísticas de atendimento e notificações pendentes. O calendário interactivo permite uma visão semanal ou mensal da agenda clínica.

### 3. 👥 Gerir Pacientes

No menu **Utentes**, é possível registar novos pacientes preenchendo o formulário com os dados pessoais e clínicos. Os registos existentes podem ser pesquisados por nome, número de processo ou número de telefone, e editados sempre que necessário.

### 4. 📅 Gerir Consultas

Aceda ao menu **Consultas** para marcar uma nova consulta. Seleccione o utente, o médico e a data/hora disponível. O sistema verifica automaticamente conflitos de horário. Consultas existentes podem ser reagendadas ou canceladas com um único clique.

### 5. 🗓️ Utilizar o Calendário

O calendário interactivo apresenta todas as consultas agendadas, com código de cores por estado (confirmada, pendente, cancelada). É possível clicar em qualquer consulta para ver os detalhes ou proceder ao seu reagendamento.

### 6. 💬 Utilizar o Chat

No menu **Mensagens**, seleccione o médico ou paciente com quem pretende comunicar. O chat funciona em tempo real com Socket.IO — as mensagens aparecem instantaneamente sem necessidade de recarregar a página.

### 7. 🩺 Visualizar Informações Clínicas

O perfil de cada utente centraliza toda a informação clínica: historial de consultas, notas médicas e, futuramente, dados de sinais vitais recolhidos pelo dispositivo IoT. Os médicos têm acesso a um painel detalhado com o historial completo do paciente antes de cada consulta.

---

## 🤝 Contribuindo

Este projecto foi desenvolvido no âmbito de um TCC, mas contribuições são bem-vindas para melhorar e expandir as suas funcionalidades. Para contribuir, siga os passos abaixo:

### 1. Faça o fork do projecto

Clique no botão **Fork** no topo desta página para criar uma cópia do repositório na sua conta GitHub.

### 2. Clone o seu fork localmente

```bash
git clone https://github.com/seu-utilizador/health-access-hub.git
cd health-access-hub
```

### 3. Crie uma branch para a sua funcionalidade

```bash
git checkout -b feature/nome-da-sua-funcionalidade
```

> Utilize prefixos descritivos: `feature/` para novas funcionalidades, `fix/` para correcções de erros, `docs/` para melhorias na documentação.

### 4. Faça as suas alterações

Implemente as suas melhorias, seguindo as convenções de código do projecto. Certifique-se de testar todas as alterações antes de submeter.

### 5. Confirme as alterações com um commit descritivo

```bash
git add .
git commit -m "feat: adicionar funcionalidade de exportação de relatórios"
```

### 6. Envie para o seu fork

```bash
git push origin feature/nome-da-sua-funcionalidade
```

### 7. Abra um Pull Request

Aceda ao repositório original no GitHub e clique em **New Pull Request**. Descreva claramente as alterações efectuadas e o problema que resolvem.

---

## 📄 Licença

```
Licença Académica — Health Access Hub

Copyright (c) 2026 Joel Da Silva Manuel

Este projecto foi desenvolvido exclusivamente para fins académicos e de investigação
no âmbito do Trabalho de Conclusão de Curso (TCC) apresentado ao Instituto Superior
Politécnico de Tecnologias e Ciências (ISPTEC), como requisito parcial para a obtenção
do grau de Licenciado em Engenharia Informática.

É permitida a reprodução e distribuição deste trabalho para fins não comerciais,
desde que seja dado o devido crédito ao autor e à instituição de origem.

Qualquer utilização comercial ou integração em produtos de terceiros requer
autorização expressa por escrito do autor.
```

---

<div align="center">

## 👨‍💻 Autor

**Joel Da Silva Manuel**

_Engenharia Informática — ISPTEC, 2026_

---

|                 |                                                                   |
| --------------- | ----------------------------------------------------------------- |
| **Projecto**    | Health Access Hub                                                 |
| **Instituição** | Instituto Superior Politécnico de Tecnologias e Ciências (ISPTEC) |
| **Curso**       | Engenharia Informática                                            |
| **Ano**         | 2026                                                              |
| **Tipo**        | Trabalho de Conclusão de Curso (TCC)                              |

---

_Desenvolvido com dedicação para transformar o acesso à saúde em Angola_ 🇦🇴

</div>
