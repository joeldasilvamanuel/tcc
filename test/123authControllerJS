const { connection: db } = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * AuthController
 */

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

        // resposta apos a accao
        res.send(`
            <body style="font-family:sans-serif; background:#f4f7fe; display:flex; align-items:center; justify-content:center; height:100vh;">
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
                <script>
                    window.onload = () => {
                        Swal.fire({
                            title: 'Sucesso!',
                            text: 'Cadastro realizado com sucesso.',
                            icon: 'success',
                            confirmButtonColor: '#007bff'
                        }).then(() => window.location.href = '/');
                    };
                </script>
            </body>
        `);
    } catch (error) {
        if (conn) await conn.rollback();
        console.error(error);
        res.status(500).send("<script>alert('Erro no cadastro. Verifique se o e-mail já existe.'); window.history.back();</script>");
    }
};

// 2. LOGIN
const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.promise().query("SELECT * FROM usuario WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.send("<script>alert('E-mail não cadastrado.'); window.location='/';</script>");
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.senha_hash);

        if (!match) {
            return res.send("<script>alert('Senha incorreta.'); window.location='/';</script>");
        }

        // Sessão
        req.session.isLoggedIn = true;
        req.session.userId = user.id_usuario;
        req.session.nome = user.nome;
        req.session.role = user.tipo_usuario;
        req.session.email = user.email;

        // Redirecionamento Simples
        const rotas = {
            'utente': '/dashboard/utente',
            'profissional': '/dashboard/profissional',
            'admin': '/dashboard/admin'
        };
        res.redirect(rotas[user.tipo_usuario] || '/');

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno no servidor.");
    }
};

// 3. RECUPERAR SENHA
const handleResetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const [result] = await db.promise().query("UPDATE usuario SET senha_hash = ? WHERE email = ?", [hash, email]);

        if (result.affectedRows === 0) {
            return res.send("<script>alert('E-mail não encontrado.'); window.history.back();</script>");
        }

        res.send(`
            <body style="font-family:sans-serif; background:#f4f7fe; display:flex; align-items:center; justify-content:center; height:100vh;">
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
                <script>
                    window.onload = () => {
                        Swal.fire({
                            title: 'Atualizado!',
                            text: 'Sua senha foi alterada.',
                            icon: 'success',
                            confirmButtonColor: '#007bff'
                        }).then(() => window.location.href = '/');
                    };
                </script>
            </body>
        `);
    } catch (error) {
        res.status(500).send("Erro ao resetar senha.");
    }
};

// 4. LOGOUT
const handleLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

module.exports = { handleRegisterUtente, handleLogin, handleLogout, handleResetPassword };