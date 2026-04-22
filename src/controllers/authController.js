const { connection: db } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Novo
const crypto = require('crypto'); // Novo

// 1. REGISTO DE UTENTE
// const handleRegisterUtente = async (req, res) => {
//     const { nome, email, password, data_nascimento, sexo } = req.body;
//     const conn = db.promise();
//     try {
//         const hash = await bcrypt.hash(password, 10);
//         await conn.beginTransaction();
//         const [resUsuario] = await conn.query("INSERT INTO usuario (nome, email, senha_hash, tipo_usuario) VALUES (?, ?, ?, 'utente')", [nome, email, hash]);
//         await conn.query("INSERT INTO utente (id_usuario, data_nascimento, sexo) VALUES (?, ?, ?)", [resUsuario.insertId, data_nascimento, sexo]);
//         await conn.commit();
//         // res.send(`<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script><script>window.onload = () => { Swal.fire({title: 'Sucesso!', text: 'Cadastro realizado.', icon: 'success'}).then(() => window.location.href = '/'); };</script>`);
//     } catch (error) {
//         if (conn) await conn.rollback();
//         res.status(500).send("<script>alert('Erro no cadastro.'); window.history.back();</script>");
//     }
// };

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

        // RESPOSTA DE SUCESSO (Obrigatória para não cair no catch do frontend)
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
        console.error("Erro no cadastro:", error); // Veja o erro real no terminal
        res.status(500).send("<script>alert('Erro no cadastro: " + error.message + "'); window.history.back();</script>");
    }
};

// 2. LOGIN (JWT + Cookie)
const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.promise().query("SELECT * FROM usuario WHERE email = ?", [email]);
        // if (rows.length === 0) return res.send("<script>alert('E-mail não cadastrado.'); window.location='/';</script>");
        if (rows.length === 0) return res.redirect('/error.html');

        const user = rows[0];
        const match = await bcrypt.compare(password, user.senha_hash);
        // if (!match) return res.send("<script>alert('Senha incorreta.'); window.location='/';</script>");
        if (!match) return res.redirect('/error.html');

        // Gerar Token JWT
        const token = jwt.sign(
            { userId: user.id_usuario, role: user.tipo_usuario, nome: user.nome },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Guardar Token num Cookie HTTP-Only
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Mudar para true se usar HTTPS
            maxAge: 7200000 // 2 horas
        });

        const rotas = { 'utente': '/dashboard/utente', 'profissional': '/dashboard/profissional', 'admin': '/dashboard/admin' };
        res.redirect(rotas[user.tipo_usuario] || '/');

    } catch (error) {
        res.status(500).send("Erro interno no servidor.");
    }
};

// 3. ESQUECEU SENHA - ETAPA 1: Gerar token e "enviar email"
const handleForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const [rows] = await db.promise().query("SELECT * FROM usuario WHERE email =?", [email]);

        // Sempre retorna 200 pra não vazar quais emails existem
        if (rows.length === 0) {
            return res.status(200).json({ msg: 'Se o email existir, enviamos um link' });
        }

        const user = rows[0];
        const token = crypto.randomBytes(32).toString('hex');
        const expira = new Date(Date.now() + 3600000); // Expira em 1h

        await db.promise().query(
            "UPDATE usuario SET reset_token =?, reset_expira =? WHERE id_usuario =?",
            [token, expira, user.id_usuario]
        );

        // TODO: Substituir por Nodemailer. Por enquanto só loga no console.
        const link = `http://localhost:3000/auth/redefinir-senha?token=${token}`;
        console.log(`Link de recuperação para ${email}: ${link}`);

        res.status(200).json({ msg: 'Email enviado' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
};

// 4. REDEFINIR SENHA - ETAPA 2: Validar token e salvar senha nova
const handleResetPassword = async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).redirect('/error.html?erro=dados');
    }

    try {
        const [rows] = await db.promise().query(
            "SELECT * FROM usuario WHERE reset_token =? AND reset_expira > NOW()",
            [token]
        );

        if (rows.length === 0) {
            return res.status(400).redirect('/error.html?erro=token');
        }

        const user = rows[0];
        const hash = await bcrypt.hash(password, 10);

        await db.promise().query(
            "UPDATE usuario SET senha_hash =?, reset_token = NULL, reset_expira = NULL WHERE id_usuario =?",
            [hash, user.id_usuario]
        );

        // Redireciona pro login com aviso de sucesso
        res.redirect('/login?reset=sucesso');

    } catch (error) {
        console.error(error);
        res.status(500).redirect('/error.html?erro=servidor');
    }
};

// 4. LOGOUT (Limpar Cookie)
const handleLogout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};

// module.exports = { handleRegisterUtente, handleLogin, handleLogout, handleResetPassword };
// Não esquece de exportar as novas funções
module.exports = {
    handleRegisterUtente,
    handleLogin,
    handleLogout,
    handleForgotPassword,
    handleResetPassword
};