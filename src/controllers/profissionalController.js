const { connection: db } = require('../config/db');
const bcrypt = require('bcrypt');

// =========================
// LISTAR PROFISSIONAIS
// =========================
exports.listarProfissionais = (req, res) => {

    const sql = `
        SELECT
            u.id_usuario,
            u.nome,
            u.email,
            u.tipo_usuario,
            u.ativo,
            u.foto_perfil
        FROM usuario u
        WHERE u.tipo_usuario IN (
            'medico',
            'enfermeiro',
            'recepcionista',
            'admin_clinica'
        )
        ORDER BY u.id_usuario DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("ERRO SQL:", err);
            return res.status(500).json({
                error: err.message
            });
        }

        try {

            const profissionais = results.map(u => ({
                id: u.id_usuario,
                nome: u.nome,
                email: u.email,
                tipo: u.tipo_usuario,
                status: u.ativo ? "ativo" : "inativo",
                foto: u.foto_perfil || "/img/fotoPadra.png",
                especialidades: []
            }));

            res.json(profissionais);

        } catch (e) {

            console.error("ERRO MAP:", e);

            res.status(500).json({
                error: e.message
            });
        }
    });
};

// =========================
// LISTAR ESPECIALIDADES DO MÉDICO
// =========================
exports.getEspecialidadesMedico = (req, res) => {
    const idMedico = req.params.id;

    const sql = `
        SELECT e.nome_esp
        FROM medico_especialidade me
        JOIN especialidades e ON e.id_esp = me.id_esp
        WHERE me.id_medico = ?
    `;

    db.query(sql, [idMedico], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results.map(r => r.nome_esp));
    });
};

// =========================
// CRIAR PROFISSIONAL
// =========================
exports.criarProfissional = async (req, res) => {
    const { nome, email, senha, tipo_usuario, especialidades } = req.body;

    if (!nome || !email || !senha || !tipo_usuario) {
        return res.status(400).json({ error: "Campos obrigatórios em falta" });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const sqlUser = `
        INSERT INTO usuario (nome, email, senha_hash, tipo_usuario)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sqlUser, [nome, email, senha_hash, tipo_usuario], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const idUsuario = result.insertId;

        // Se for médico, associa especialidades
        if (tipo_usuario === "medico" && Array.isArray(especialidades)) {
            const values = especialidades.map(idEsp => [idUsuario, idEsp]);

            const sqlEsp = `
                INSERT INTO medico_especialidade (id_medico, id_esp)
                VALUES ?
            `;

            db.query(sqlEsp, [values]);
        }

        res.json({ success: true, id: idUsuario });
    });
};

// =========================
// ATIVAR / DESATIVAR
// =========================
exports.toggleStatus = (req, res) => {
    const id = req.params.id;

    const sql = `
        UPDATE usuario
        SET ativo = NOT ativo
        WHERE id_usuario = ?
    `;

    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ success: true });
    });
};

// =========================
// DELETE
// =========================
exports.deleteProfissional = (req, res) => {
    const id = req.params.id;

    console.log("DELETE ID RECEBIDO:", id);

    db.query("DELETE FROM usuario WHERE id_usuario = ?", [id], (err, result) => {
        
        if (err) {
            console.error("ERRO DELETE SQL:", err);
            return res.status(500).json({ error: err.message });
        }

        console.log("RESULT DELETE:", result);

        return res.json({ success: true, affectedRows: result.affectedRows });
    });
};