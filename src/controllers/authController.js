const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

const handleRegisterUtente = async (req, res) => {
    const { nome, email, password, data_nascimento, sexo } = req.body;
    let conn;
    try {
        const hash = await bcrypt.hash(password, 10);
        conn = await pool.getConnection();
        await conn.beginTransaction();

        const [resUsuario] = await conn.query(
            "INSERT INTO usuario (nome, email, senha_hash, tipo_usuario) VALUES (?, ?, ?, 'utente')",
            [nome, email, hash]
        );

        await conn.query(
            "INSERT INTO utente (id_usuario, data_nascimento, sexo) VALUES (?, ?, ?)",
            [resUsuario.insertId, data_nascimento, sexo]
        );

        await conn.commit();
        res.send('<h1>Cadastro OK!</h1><a href="/">Ir para Login</a>');
    } catch (error) {
        if (conn) await conn.rollback();
        console.error(error);
        res.status(500).send("Erro no cadastro.");
    } finally {
        if (conn) conn.release();
    }
};

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query("SELECT * FROM usuario WHERE email = ?", [email]);
        if (rows.length === 0) return res.status(401).send("Usuário não encontrado.");

        const user = rows[0];
        const match = await bcrypt.compare(password, user.senha_hash);
        if (!match) return res.status(401).send("Senha incorreta.");

        // Guarda os dados na sessão
        req.session.isLoggedIn = true;
        req.session.userId = user.id_usuario;
        req.session.nome = user.nome;
        req.session.role = user.tipo_usuario;

        // --- LÓGICA DE REDIRECIONAMENTO COMPLETA ---
        if (user.tipo_usuario === 'utente') {
            return res.redirect('/dashboard/utente');
        } else if (user.tipo_usuario === 'profissional') {
            return res.redirect('/dashboard/profissional');
        } else if (user.tipo_usuario === 'admin') {
            return res.redirect('/dashboard/admin');
        } else {
            return res.send(`Tipo de usuário ${user.tipo_usuario} sem dashboard definido.`);
        }

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};

// Nova função para a tela de recuperar que você criou
const handleResetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            "UPDATE usuario SET senha_hash = ? WHERE email = ?",
            [hash, email]
        );

        if (result.affectedRows === 0) {
            return res.send('<h1>Erro: E-mail não encontrado!</h1><a href="/recuperar">Voltar</a>');
        }

        res.send('<h1>Senha atualizada!</h1><a href="/">Ir para o Login</a>');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao resetar senha.");
    }
};

const handleLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

// EXPORTAÇÃO ATUALIZADA
module.exports = {
    handleRegisterUtente,
    handleLogin,
    handleLogout,
    handleResetPassword
};