// ================== IMPORTS & MIDDLEWARES GLOBAIS (Mantidos) ==================
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { connection: db, testConnection } = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const { handleLogout } = require('./src/controllers/authController');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../02_siteHAH/hah')));

// ================== SISTEMA DE PROTEÇÃO (Mantido/Refinado) ==================
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

// ================== ROTAS PÚBLICAS & UTENTE (SEM ALTERAÇÕES) ==================
app.use('/auth', authRoutes);
app.get('/auth/logout', handleLogout);
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'src/views/auth/login.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'src/views/auth/login.html')));
app.get('/start', (req, res) => res.sendFile(path.join(__dirname, 'src/views/clinica/start.html')));
app.get('/agendar', (req, res) => res.sendFile(path.join(__dirname, 'src/views/clinica/agendar.html')));

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

// ================== DASHBOARD: PROFISSIONAL (ACTUALIZADO COM SUBPASTAS) ==================

// MÉDICO - Pasta: src/views/profissional/medico/
app.get('/dashboard/profissional/medico', verificarAcesso(['medico']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/medico/dashboard.html'));
});

// ENFERMEIRO - Pasta: src/views/profissional/enfermeiro/
app.get('/dashboard/profissional/enfermeiro', verificarAcesso(['enfermeiro']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/enfermeiro/dashboard.html'));
});

// RECEÇÃO - Pasta: src/views/profissional/rececao/
app.get('/dashboard/profissional/rececao', verificarAcesso(['recepcionista']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/rececao/dashboard.html'));
});

// Rotas internas que podem estar dentro das subpastas de cada um
app.get('/dashboard/profissional/medico/monitorar', verificarAcesso(['medico']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/profissional/medico/monitorar.html'));
});

// ================== DASHBOARD: ADMIN (ACTUALIZADO COM SUBPASTAS) ==================


// --- ADMIN GERAL ---
// Localização: src/views/admin/adminGeral/
app.get('/dashboard/admin/geral', verificarAcesso(['admin_geral']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/admin/adminGeral/dashboard.html'));
});

app.get('/dashboard/admin/geral/profissionais', verificarAcesso(['admin_geral']), (req, res) => {
    // Rota para gerir a lista de médicos, enfermeiros e rececionistas
    res.sendFile(path.join(__dirname, 'src/views/admin/adminGeral/profissionais.html'));
});

app.get('/dashboard/admin/geral/configuracoes', verificarAcesso(['admin_geral']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/admin/adminGeral/configuracoes.html'));
});


// --- ADMIN CLÍNICA ---
// Localização: src/views/admin/adminClinica/
app.get('/dashboard/admin/clinica', verificarAcesso(['admin_clinica']), (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/admin/adminClinica/dashboard.html'));
});

app.get('/dashboard/admin/clinica/relatorios', verificarAcesso(['admin_clinica']), (req, res) => {
    // Rota para ver estatísticas de agendamentos e performance
    res.sendFile(path.join(__dirname, 'src/views/admin/adminClinica/relatorios.html'));
});

app.get('/dashboard/admin/clinica/utentes', verificarAcesso(['admin_clinica', 'admin_geral']), (req, res) => {
    // Ambos os admins podem gerir a base de dados de utentes
    res.sendFile(path.join(__dirname, 'src/views/admin/adminClinica/utentes.html'));
});

// ================== APIS & CONFIGURAÇÕES (MANTIDAS) ==================

app.get('/api/user-info', verificarToken, (req, res) => {
    db.query(`SELECT nome, email, tipo_usuario AS role FROM usuario WHERE id_usuario = ?`, [req.user.userId], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: 'Erro' });
        res.json(results[0]);
    });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'public/uploads/perfil');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => cb(null, `user_${req.user.userId}_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

app.post('/api/upload-foto', verificarToken, upload.single('foto'), (req, res) => {
    const fotoUrl = `/uploads/perfil/${req.file.filename}`;
    db.query("UPDATE usuario SET foto_perfil = ? WHERE id_usuario = ?", [fotoUrl, req.user.userId], (err) => {
        if (err) return res.status(500).send("Erro");
        res.json({ success: true, url: fotoUrl });
    });
});

const PORT = process.env.PORT || 3000;
testConnection().then(() => {
    app.listen(PORT, () => console.log(`🚀 Servidor Health Access Hub ligado na porta http://localhost:${PORT}`));
});