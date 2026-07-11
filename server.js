const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const { connection: db, testConnection } = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const { handleLogout } = require('./src/controllers/authController');

// para o agendamento
const utenteRouter = require('./src/routes/utenteRoutes');
const agendamentoRoutes = require('./src/routes/agendamentoRoutes');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.set('io', io);

require('./src/sockets/chatSocket')(io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../02_siteHAH/hah')));

// Rota para lidar com os profissionais
const profissionalRoutes = require('./src/routes/profissionalRoutes');
app.use('/api/profissionais', profissionalRoutes);

// Rotas para lidar com utentes
app.use('/api/utentes', utenteRouter);

// Rota para rececao
const rececaoRoutes = require('./src/routes/rececaoRoutes');
app.use('/api/rececao', rececaoRoutes);

// para a tela de agendamento dos medicos verem os utentes no form de criar agendamento
const usuariosRoutes = require('./src/routes/usuariosRoutes');
app.use('/api/usuarios', usuariosRoutes);

const especialidadesRoutes = require('./src/routes/especialidadesRoutes');
app.use('/api', especialidadesRoutes);

// rotas de chat
const chatRoutes = require('./src/routes/chatRoutes');



// Sistema de Protecao - verificar acesso de utilizadores
const verificarAcesso = (rolesPermitidos) => {
    return (req, res, next) => {
        const token = req.cookies.token;
        if (!token) return res.redirect('/login');
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (rolesPermitidos.includes(decoded.role)) {
                req.user = decoded;
                return next();
            }
            res.redirect('/login?erro=acesso_negado');
        } catch (err) {
            res.clearCookie('token');
            res.redirect('/login');
        }
    };
};

const verificarToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Não autorizado' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) { res.status(401).json({ message: 'Token inválido' }); }
};


// Rotas publicas do sistema
app.use('/auth', authRoutes);
app.get('/auth/logout', handleLogout);
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'src/views/auth/login.html')));
app.get('/recuperar', (req, res) => res.sendFile(path.join(__dirname, 'src/views/auth/recuperar.html')));



// Rotas para o site da clinica arco-iris
app.get('/start', (req, res) => res.sendFile(path.join(__dirname, 'src/views/clinica/start.html')));
app.get('/equipa', (req, res) => res.sendFile(path.join(__dirname, 'src/views/clinica/equipa.html')));
app.get('/servicos', (req, res) => res.sendFile(path.join(__dirname, 'src/views/clinica/servicos.html')));
app.get('/agendar', (req, res) => res.sendFile(path.join(__dirname, 'src/views/clinica/agendar.html')));



// UTENTES - Rotas para acessar as abas do utente
app.get('/dashboard/utente', verificarAcesso(['utente']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/utente/dashboard.html'));
});

app.get('/dashboard/utente/consultas', verificarAcesso(['utente']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/utente/consultas.html'));
});

app.get('/dashboard/utente/mensagens', verificarAcesso(['utente']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/utente/mensagens.html'));
});

app.get('/dashboard/utente/perfil', verificarAcesso(['utente']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/utente/perfil.html'));
});

app.get('/dashboard/utente/definicoes', verificarAcesso(['utente']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/utente/definicoes.html'));
});

app.get('/dashboard/utente/exames', verificarAcesso(['utente']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/utente/exames.html'));
});

app.get('/dashboard/utente/prescricao', verificarAcesso(['utente']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/utente/prescricao.html'));
});

app.get('/dashboard/utente/historico', verificarAcesso(['utente']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/utente/historico.html'));
});



// PROFISSIONAIS - Rotas para acessar as abas dos Profissionais, com suas respetivas reparticoes de acesso
// MÉDICO - Pasta: src/views/profissional/medico/
app.get('/dashboard/profissional/medico', verificarAcesso(['medico']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/medico/dashboard.html'));
});

app.get('/dashboard/profissional/medico/utentes', verificarAcesso(['medico']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/medico/utentes.html'));
});

app.get('/dashboard/profissional/medico/mensagens', verificarAcesso(['medico']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/medico/mensagens.html'));
});

app.get('/dashboard/profissional/medico/perfil', verificarAcesso(['medico']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/medico/perfil.html'));
});

app.get('/dashboard/profissional/medico/definicoes', verificarAcesso(['medico']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/medico/definicoes.html'));
});

app.get('/dashboard/profissional/medico/monitorar', verificarAcesso(['medico']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/medico/monitorar.html'));
});

app.get('/dashboard/profissional/medico/agendamento', verificarAcesso(['medico']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/medico/agendamento.html'));
});

app.get('/dashboard/profissional/medico/alertas', verificarAcesso(['medico']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/medico/alertas.html'));
});

app.get('/dashboard/profissional/medico/prescricao', verificarAcesso(['medico']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/medico/prescricao.html'));
});

app.get('/dashboard/profissional/medico/historico', verificarAcesso(['medico']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/medico/historico.html'));
});

// ENFERMEIRO - Pasta: src/views/profissional/enfermeiro/
app.get('/dashboard/profissional/enfermeiro', verificarAcesso(['enfermeiro']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/enfermeiro/dashboard.html'));
});

app.get('/dashboard/profissional/enfermeiro/utentes', verificarAcesso(['enfermeiro']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/enfermeiro/utentes.html'));
});

app.get('/dashboard/profissional/enfermeiro/mensagens', verificarAcesso(['enfermeiro']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/enfermeiro/mensagens.html'));
});

app.get('/dashboard/profissional/enfermeiro/perfil', verificarAcesso(['enfermeiro']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/enfermeiro/perfil.html'));
});

app.get('/dashboard/profissional/enfermeiro/definicoes', verificarAcesso(['enfermeiro']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/enfermeiro/definicoes.html'));
});

app.get('/dashboard/profissional/enfermeiro/monitorar', verificarAcesso(['enfermeiro']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/enfermeiro/monitorar.html'));
});

app.get('/dashboard/profissional/enfermeiro/agendamento', verificarAcesso(['enfermeiro']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/enfermeiro/agendamento.html'));
});

app.get('/dashboard/profissional/enfermeiro/alertas', verificarAcesso(['enfermeiro']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/enfermeiro/alertas.html'));
});

// RECEÇÃO - Pasta: src/views/profissional/rececao/
app.get('/dashboard/profissional/rececao', verificarAcesso(['recepcionista']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/rececao/dashboard.html'));
});

app.get('/dashboard/profissional/rececao/utentes', verificarAcesso(['recepcionista']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/rececao/utentes.html'));
});

app.get('/dashboard/profissional/rececao/mensagens', verificarAcesso(['recepcionista']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/rececao/mensagens.html'));
});

app.get('/dashboard/profissional/rececao/perfil', verificarAcesso(['recepcionista']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/rececao/perfil.html'));
});

app.get('/dashboard/profissional/rececao/definicoes', verificarAcesso(['recepcionista']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/rececao/definicoes.html'));
});

app.get('/dashboard/profissional/rececao/monitorar', verificarAcesso(['recepcionista']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/rececao/monitorar.html'));
});

app.get('/dashboard/profissional/rececao/agendamento', verificarAcesso(['recepcionista']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/rececao/agendamento.html'));
});

app.get('/dashboard/profissional/rececao/alertas', verificarAcesso(['recepcionista']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/rececao/alertas.html'));
});



// ADMIN - Rotas para acessar as respetivas abas dos admin do sistema, ADMIN GERAL e o CLINICO
// ADMIN GERAL - Localização: src/views/admin/adminGeral/
app.get('/dashboard/admin/adminGeral', verificarAcesso(['admin_geral']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/admin/adminGeral/dashboard.html'));
});

app.get('/dashboard/admin/adminGeral/utilizadores', verificarAcesso(['admin_geral']), (req, res) => {
    // Rota para gerir a lista de médicos, enfermeiros e rececionistas
    res.sendFile(path.join(__dirname, 'src/views/admin/adminGeral/utilizadores.html'));
});

app.get('/dashboard/admin/adminGeral/relatorios', verificarAcesso(['admin_geral']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/admin/adminGeral/relatorios.html'));
});

app.get('/dashboard/admin/adminGeral/configuracoes', verificarAcesso(['admin_geral']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/admin/adminGeral/configuracoes.html'));
});

app.get('/dashboard/admin/adminGeral/perfil', verificarAcesso(['admin_geral']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/admin/adminGeral/perfil.html'));
});

// rotas de administracao e cadastro de utilizadores
app.get('/dashboard/admin/adminGeral/profissionais', verificarAcesso(['admin_geral']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/admin/adminGeral/profissionais.html'));
});

app.get('/dashboard/admin/adminGeral/utentes', verificarAcesso(['admin_geral']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/admin/adminGeral/utentes.html'));
});

// ADMIN CLÍNICA - Localização: src/views/admin/adminClinica/
app.get('/dashboard/admin/adminClinica', verificarAcesso(['admin_clinica']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/admin/adminClinica/dashboard.html'));
});

app.get('/dashboard/admin/adminClinica/relatorios', verificarAcesso(['admin_clinica']), (req, res) => {
    // Rota para ver estatísticas de agendamentos e performance
    res.sendFile(path.join(__dirname, 'src/views/admin/adminClinica/relatorios.html'));
});

app.get('/dashboard/admin/adminClinica/utentes', verificarAcesso(['admin_clinica', 'admin_geral']), (req, res) => {
    // Ambos os admins podem gerir a base de dados de utentes
    res.sendFile(path.join(__dirname, 'src/views/admin/adminClinica/utentes.html'));
});

app.get('/dashboard/admin/adminClinica/configuracoes', verificarAcesso(['admin_clinica']), (req, res) => {
    // Ambos os admins podem gerir a base de dados de utentes
    res.sendFile(path.join(__dirname, 'src/views/admin/adminClinica/configuracoes.html'));
});

app.get('/dashboard/admin/adminClinica/perfil', verificarAcesso(['admin_clinica']), (req, res) => {
    // Ambos os admins podem gerir a base de dados de utentes
    res.sendFile(path.join(__dirname, 'src/views/admin/adminClinica/perfil.html'));
});
// FINISH - Sessao de rotas concluida -------------------------------------------------------------

// SESSA DE API's 
// API para agendamento de consultas
app.use('/api/agendamentos', agendamentoRoutes);

// API para chat em tempo real
app.use('/api/chat', chatRoutes);

// API's para configuracoes de 
// Verificar token
app.get('/api/user-info', verificarToken, (req, res) => {
    db.query(`SELECT nome, email, tipo_usuario AS role FROM usuario WHERE id_usuario = ?`, [req.user.userId], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: 'Erro' });
        res.json(results[0]);
    });
});

// Fotos de Perfil
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'public/uploads/perfil');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => cb(null, `user_${req.user.userId}_${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({ storage });

// Ainda foto de perfil
app.post('/api/upload-foto', verificarToken, upload.single('foto'), (req, res) => {
    const fotoUrl = `/uploads/perfil/${req.file.filename}`;
    db.query("UPDATE usuario SET foto_perfil = ? WHERE id_usuario = ?", [fotoUrl, req.user.userId], (err) => {
        if (err) return res.status(500).send("Erro");
        res.json({ success: true, url: fotoUrl });
    });
});

// APT para o dispositivo, recepcao de dados
const iotRoutes = require('./src/routes/iotRoutes');
app.use('/api/iot', iotRoutes);
// FINISH - Fim da sessao de API's

// INICIALIZACAO DO PROJECTO...
const PORT = process.env.PORT || 3000;

testConnection().then(() => {

    // server.listen(PORT, () => {

    //     console.log(
    //         `🚀 Servidor Health Access Hub ligado na porta http://localhost:${PORT}`
    //     );

    // });

    server.listen(PORT, "0.0.0.0", () => {
        console.log("==================================");
        console.log("Health Access Hub");
        console.log("Servidor iniciado");
        console.log("Local:  http://localhost:" + PORT);
        console.log("Rede :  http://192.168.52.14:" + PORT);
        console.log("==================================");
    });

});