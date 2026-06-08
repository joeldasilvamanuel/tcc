const { connection: db } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Importação dos teus modelos (Mantidos conforme o teu original)
const Especialidade = require('../models/especialidadeModel');
const Agendamento = require('../models/agendamentoModel');

// 1. REGISTO DE UTENTE
const handleRegisterUtente = async (req, res) => {
    const { nome, email, password, data_nascimento, sexo } = req.body;
    const conn = db.promise();
    try {
        const hash = await bcrypt.hash(password, 10);
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

        res.send(`
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            <script>
                window.onload = () => {
                    Swal.fire({title: 'Sucesso!', text: 'Cadastro realizado.', icon: 'success'})
                    .then(() => window.location.href = '/login');
                };
            </script>
        `);
    } catch (error) {
        if (conn) await conn.rollback();
        console.error("Erro no cadastro:", error);
        res.status(500).send("<script>alert('Erro no cadastro: " + error.message + "'); window.history.back();</script>");
    }
};

// 2. LOGIN
const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.promise().query("SELECT * FROM usuario WHERE email = ?", [email]);

        if (rows.length === 0) return res.redirect('/error.html?erro=usuario_nao_encontrado');

        const user = rows[0];
        const match = await bcrypt.compare(password, user.senha_hash);

        if (!match) return res.redirect('/error.html?erro=senha_incorreta');

        // Gerar Token JWT com os dados necessários para os middlewares
        const token = jwt.sign(
            { userId: user.id_usuario, role: user.tipo_usuario, nome: user.nome },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Guardar Token num Cookie Seguro
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Define como true se usares HTTPS
            maxAge: 7200000 // 2 horas
        });

        // MAPEAMENTO ATUALIZADO: Direciona cada um para a sua aba específica
        const rotas = {
            'utente': '/dashboard/utente',
            'medico': '/dashboard/profissional/medico',
            'enfermeiro': '/dashboard/profissional/enfermeiro',
            'recepcionista': '/dashboard/profissional/rececao',
            'admin_geral': '/dashboard/admin/adminGeral',
            'admin_clinica': '/dashboard/admin/adminClinica'
        };

        // Redireciona ou volta para a home caso o tipo seja inválido
        res.redirect(rotas[user.tipo_usuario] || '/');

    } catch (error) {
        console.error("Erro no Login:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};

// 3. ESQUECEU SENHA
const handleForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const [rows] = await db.promise().query("SELECT * FROM usuario WHERE email =?", [email]);
        if (rows.length === 0) {
            return res.status(200).json({ msg: 'Se o email existir, enviamos um link' });
        }

        const user = rows[0];
        const token = crypto.randomBytes(32).toString('hex');
        const expira = new Date(Date.now() + 3600000);

        await db.promise().query(
            "UPDATE usuario SET reset_token =?, reset_expira =? WHERE id_usuario =?",
            [token, expira, user.id_usuario]
        );

        console.log(`Link de recuperação para ${email}: http://localhost:3000/auth/redefinir-senha?token=${token}`);
        res.status(200).json({ msg: 'Email enviado' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
};

// 4. REDEFINIR SENHA
const handleResetPassword = async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).redirect('/error.html?erro=dados');

    try {
        const [rows] = await db.promise().query(
            "SELECT * FROM usuario WHERE reset_token =? AND reset_expira > NOW()",
            [token]
        );

        if (rows.length === 0) return res.status(400).redirect('/error.html?erro=token');

        const hash = await bcrypt.hash(password, 10);
        await db.promise().query(
            "UPDATE usuario SET senha_hash =?, reset_token = NULL, reset_expira = NULL WHERE id_usuario =?",
            [hash, rows[0].id_usuario]
        );

        res.redirect('/login?reset=sucesso');
    } catch (error) {
        res.status(500).redirect('/error.html?erro=servidor');
    }
};

// 5. LOGOUT
const handleLogout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};

// ============================================================
// FUNÇÕES DE AGENDAMENTO (Recuperadas e Mantidas)
// ============================================================

const getEspecialidades = async (req, res) => {
    try {
        const especialidades = await Especialidade.listarTodas();
        res.status(200).json(especialidades);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar especialidades' });
    }
};

const criarAgendamento = async (req, res) => {
    try {
        await Agendamento.criar(req.body);
        res.status(201).json({ msg: 'Agendamento criado com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao agendar' });
    }
};

const obterUtilizadorAtual = async (req, res) => {

    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                erro: 'Não autenticado'
            });
        }

        const dados = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        return res.json({
            id_usuario: dados.userId,
            nome: dados.nome,
            tipo_usuario: dados.role
        });

    } catch (erro) {

        return res.status(401).json({
            erro: 'Token inválido'
        });
    }
};

// Exportação completa de todas as funções
module.exports = {
    handleRegisterUtente,
    handleLogin,
    handleLogout,
    handleForgotPassword,
    handleResetPassword,
    getEspecialidades,
    criarAgendamento,
    obterUtilizadorAtual
};

