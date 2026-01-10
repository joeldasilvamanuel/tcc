const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Configurações essenciais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'segredo_arco_iris',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

// Rotas
app.use('/auth', authRoutes);

// login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'auth', 'login.html'));
});

// recuperar senha
app.get('/recuperar', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'auth', 'recuperar.html'));
});

// dashboard =================================================== >

// 1. UTENTE
app.get('/dashboard/utente', (req, res) => {
    if (req.session.isLoggedIn && req.session.role === 'utente') {
        res.sendFile(path.join(__dirname, 'src', 'views', 'utente', 'dashboard.html'));
    } else {
        res.redirect('/');
    }
});

// 2. PROFISSIONAL (Ajustado para bater com o redirecionamento do controller)
app.get('/dashboard/profissional', (req, res) => {
    if (req.session.isLoggedIn && req.session.role === 'profissional') {
        // ATENÇÃO: Verifique se o nome da pasta é 'profissional' ou 'prof'
        res.sendFile(path.join(__dirname, 'src', 'views', 'profissional', 'dashboard.html'));
    } else {
        res.redirect('/');
    }
});

// 3. ADMINISTRADOR (Corrigido o caminho que estava /utente)
app.get('/dashboard/admin', (req, res) => {
    if (req.session.isLoggedIn && req.session.role === 'admin') {
        res.sendFile(path.join(__dirname, 'src', 'views', 'admin', 'dashboard.html'));
    } else {
        res.redirect('/');
    }
});

// Iniciar Servidor
const PORT = process.env.PORT || 3000;
testConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 SERVIDOR RODANDO EM: http://localhost:${PORT}`);
    });
});