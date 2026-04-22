// ================== IMPORTS ==================
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Banco de dados
const { connection: db, testConnection } = require('./src/config/db');

// Rotas e controllers
const authRoutes = require('./src/routes/authRoutes');
const { handleLogout } = require('./src/controllers/authController');

// ================== APP ==================
const app = express();

// ================== MIDDLEWARES GLOBAIS ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Novo: Essencial para ler o token nos cookies
app.use(express.static('public'));

// Isso resolve o problema de as imagens e estilos não carregarem
app.use(express.static(path.join(__dirname, '../02_siteHAH/hah')));

// ================== MIDDLEWARES DE PROTEÇÃO (JWT) ==================

const verificarToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contém userId e role
        next();
    } catch (err) {
        res.clearCookie('token');
        res.redirect('/');
    }
};

const verificarUtente = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === 'utente') {
            req.user = decoded;
            return next();
        }
        res.redirect('/');
    } catch (err) { res.clearCookie('token'); res.redirect('/'); }
};

const verificarProfissional = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === 'profissional') {
            req.user = decoded;
            return next();
        }
        res.redirect('/');
    } catch (err) { res.clearCookie('token'); res.redirect('/'); }
};

const verificarAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === 'admin') {
            req.user = decoded;
            return next();
        }
        res.redirect('/');
    } catch (err) { res.clearCookie('token'); res.redirect('/'); }
};

// ================== ROTAS DE AUTENTICAÇÃO ==================
app.use('/auth', authRoutes);
app.get('/auth/logout', handleLogout);

// ================== ROTAS DE PÁGINAS ==================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'src/views/auth/login.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'src/views/auth/login.html')));
app.get('/recuperar', (req, res) => res.sendFile(path.join(__dirname, 'src/views/auth/recuperar.html')));

// ROTAS DO SITE DA HEALTH ACCESS HUB
// 2. Rota para o Admin (Mantendo o teu padrão de URLs protegidas)
// app.get('/dashboard/admin/clinicas', verificarAdmin, (req, res) => {
//     res.sendFile(path.join(__dirname, '../02_siteHAH/hah/admin.html'));
// });

// app.get('/empresa', (req, res) => {
//     res.sendFile(path.join(__dirname, '../02_siteHAH/hah/inicio.html'));
// });

// --- DASHBOARDS (Protegidas) ---

// --- Paginas do utente ---
// dashboard
app.get('/dashboard/utente', verificarUtente, (req, res) => {
    const subpath = req.params[0] || '/dashboard.html';
    res.sendFile(path.join(__dirname, 'src/views/utente', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// consultas
app.get('/dashboard/utente/consultas', verificarUtente, (req, res) => {
    const subpath = req.params[0] || '/consultas.html';
    res.sendFile(path.join(__dirname, 'src/views/utente', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// mensagens
app.get('/dashboard/utente/mensagens', verificarUtente, (req, res) => {
    const subpath = req.params[0] || '/mensagens.html';
    res.sendFile(path.join(__dirname, 'src/views/utente', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// monitoramento
app.get('/dashboard/utente/exames', verificarUtente, (req, res) => {
    const subpath = req.params[0] || '/exames.html';
    res.sendFile(path.join(__dirname, 'src/views/utente', subpath.includes('.html') ? subpath : subpath + '.html'));
});


// perfil
app.get('/dashboard/utente/perfil', verificarUtente, (req, res) => {
    const subpath = req.params[0] || '/perfil.html';
    res.sendFile(path.join(__dirname, 'src/views/utente', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// definicoes
app.get('/dashboard/utente/definicoes', verificarUtente, (req, res) => {
    const subpath = req.params[0] || '/definicoes.html';
    res.sendFile(path.join(__dirname, 'src/views/utente', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// --- Paginas do profissional de saude ---
// dashboard
app.get('/dashboard/profissional', verificarProfissional, (req, res) => {
    const subpath = req.params[0] || '/dashboard.html';
    res.sendFile(path.join(__dirname, 'src/views/profissional', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// mensagens
app.get('/dashboard/profissional/mensagens', verificarProfissional, (req, res) => {
    const subpath = req.params[0] || '/mensagens.html';
    res.sendFile(path.join(__dirname, 'src/views/profissional', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// monitorar
app.get('/dashboard/profissional/monitorar', verificarProfissional, (req, res) => {
    const subpath = req.params[0] || '/monitorar.html';
    res.sendFile(path.join(__dirname, 'src/views/profissional', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// agendamento
app.get('/dashboard/profissional/agendamento', verificarProfissional, (req, res) => {
    const subpath = req.params[0] || '/agendamento.html';
    res.sendFile(path.join(__dirname, 'src/views/profissional', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// alertas
app.get('/dashboard/profissional/alertas', verificarProfissional, (req, res) => {
    const subpath = req.params[0] || '/alertas.html';
    res.sendFile(path.join(__dirname, 'src/views/profissional', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// utentes
app.get('/dashboard/profissional/utentes', verificarProfissional, (req, res) => {
    const subpath = req.params[0] || '/utentes.html';
    res.sendFile(path.join(__dirname, 'src/views/profissional', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// perfil
app.get('/dashboard/profissional/perfil', verificarProfissional, (req, res) => {
    const subpath = req.params[0] || '/perfil.html';
    res.sendFile(path.join(__dirname, 'src/views/profissional', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// definicoes
app.get('/dashboard/profissional/definicoes', verificarProfissional, (req, res) => {
    const subpath = req.params[0] || '/definicoes.html';
    res.sendFile(path.join(__dirname, 'src/views/profissional', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// --- Paginas do administrador ---
// dashboard
app.get('/dashboard/admin', verificarAdmin, (req, res) => {
    const subpath = req.params[0] || '/dashboard.html';
    res.sendFile(path.join(__dirname, 'src/views/admin', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// visao geral
app.get('/dashboard/admin/visao-geral', verificarAdmin, (req, res) => {
    const subpath = req.params[0] || '/visao-geral.html';
    res.sendFile(path.join(__dirname, 'src/views/admin', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// prof
app.get('/dashboard/admin/profissionais', verificarAdmin, (req, res) => {
    const subpath = req.params[0] || '/profissionais.html';
    res.sendFile(path.join(__dirname, 'src/views/admin', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// utentes
app.get('/dashboard/admin/utentes', verificarAdmin, (req, res) => {
    const subpath = req.params[0] || '/utentes.html';
    res.sendFile(path.join(__dirname, 'src/views/admin', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// gerir consultas
app.get('/dashboard/admin/consultas', verificarAdmin, (req, res) => {
    const subpath = req.params[0] || '/consultas.html';
    res.sendFile(path.join(__dirname, 'src/views/admin', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// relatorios
app.get('/dashboard/admin/relatorios', verificarAdmin, (req, res) => {
    const subpath = req.params[0] || '/relatorios.html';
    res.sendFile(path.join(__dirname, 'src/views/admin', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// configuracoes
app.get('/dashboard/admin/configuracoes', verificarAdmin, (req, res) => {
    const subpath = req.params[0] || '/configuracoes.html';
    res.sendFile(path.join(__dirname, 'src/views/admin', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// perfil
app.get('/dashboard/admin/perfil', verificarAdmin, (req, res) => {
    const subpath = req.params[0] || '/perfil.html';
    res.sendFile(path.join(__dirname, 'src/views/admin', subpath.includes('.html') ? subpath : subpath + '.html'));
});

// ================== API ==================
// app.get('/api/user-info', verificarToken, (req, res) => {
//     // console.log("Buscando dados para o ID:", req.user.userId); // Debug
//     const query = `SELECT nome, email, tipo_usuario AS role, foto_perfil FROM usuario WHERE id_usuario = ? LIMIT 1`;
//     db.query(query, [req.user.userId], (err, results) => {
//         if (err || results.length === 0) return res.status(500).json({ message: 'Erro ao buscar utilizador' });
//         res.json(results[0]);
//     });
// });
// Localize e altere para isso:
app.get('/api/user-info', verificarToken, (req, res) => {
    // Removemos o 'foto_perfil' da linha abaixo
    const query = `SELECT nome, email, tipo_usuario AS role FROM usuario WHERE id_usuario = ? LIMIT 1`;

    db.query(query, [req.user.userId], (err, results) => {
        if (err) {
            console.error("❌ ERRO NO BANCO DE DADOS:", err);
            return res.status(500).json({ message: 'Erro interno' });
        }

        if (results.length === 0) return res.status(404).json({ message: 'Não encontrado' });

        res.json(results[0]);
    });
});

app.get('/api/utentes', verificarProfissional, (req, res) => {
    const query = `SELECT u.id_usuario AS id, u.nome, u.email, ut.data_nascimento, ut.sexo AS genero FROM usuario u INNER JOIN utente ut ON u.id_usuario = ut.id_usuario WHERE u.tipo_usuario = 'utente'`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Erro na base de dados" });
        res.json(results);
    });
});

// ================== API GESTÃO DE CLÍNICAS ==================

// // Listar todas as clínicas (Público ou Admin)
// app.get('/api/clinicas', (req, res) => {
//     const { busca } = req.query;
//     let query = "SELECT * FROM clinica WHERE status = 'ativo'";
//     let params = [];

//     if (busca) {
//         query += " AND (nome LIKE ? OR especialidade LIKE ?)";
//         params = [`%${busca}%`, `%${busca}%`];
//     }

//     db.query(query, params, (err, results) => {
//         if (err) return res.status(500).json({ error: "Erro ao buscar clínicas" });
//         res.json(results);
//     });
// });

// // Cadastrar clínica (Protegido por Admin)
// app.post('/api/clinicas', verificarAdmin, (req, res) => {
//     const { nome, endereco, telefone, especialidade, descricao } = req.body;
//     const query = "INSERT INTO clinica (nome, endereco, telefone, especialidade, descricao) VALUES (?, ?, ?, ?, ?)";

//     db.query(query, [nome, endereco, telefone, especialidade, descricao], (err, result) => {
//         if (err) return res.status(500).json({ error: "Erro ao cadastrar clínica" });
//         res.json({ success: true, id: result.insertId });
//     });
// });

// // Remover clínica (Protegido por Admin)
// app.delete('/api/clinicas/:id', verificarAdmin, (req, res) => {
//     db.query("DELETE FROM clinica WHERE id_clinica = ?", [req.params.id], (err) => {
//         if (err) return res.status(500).json({ error: "Erro ao eliminar" });
//         res.sendStatus(200);
//     });
// });

// ================== MULTER & FOTOS ==================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'public/uploads/perfil');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `user_${req.user.userId}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

app.post('/api/upload-foto', verificarToken, upload.single('foto'), (req, res) => {
    const fotoUrl = `/uploads/perfil/${req.file.filename}`;
    db.query("UPDATE usuario SET foto_perfil = ? WHERE id_usuario = ?", [fotoUrl, req.user.userId], (err) => {
        if (err) return res.status(500).send("Erro ao salvar no banco");
        res.json({ success: true, url: fotoUrl });
    });
});

app.post('/api/remover-foto', verificarToken, (req, res) => {
    db.query("UPDATE usuario SET foto_perfil = NULL WHERE id_usuario = ?", [req.user.userId], (err) => {
        if (err) return res.status(500).send("Erro ao remover foto");
        res.sendStatus(200);
    });
});

// ================== INICIALIZAÇÃO ==================
const PORT = process.env.PORT || 3000;
testConnection().then(() => {
    app.listen(PORT, () => console.log(`🚀 Health Access Hub (JWT) em: http://localhost:${PORT}`));
}).catch(() => console.error("❌ Erro na conexão MySQL."));