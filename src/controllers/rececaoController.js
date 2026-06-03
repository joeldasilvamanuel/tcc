const { connection: db } = require('../config/db');

// LISTAR UTENTES
exports.listarUtentes = (req, res) => {

    const sql = `
        SELECT
            u.id_utente,
            u.id_usuario,
            us.nome,
            us.email,
            us.ativo,
            u.data_nascimento,
            u.sexo,
            u.contacto,
            u.endereco
        FROM utente u
        INNER JOIN usuario us ON us.id_usuario = u.id_usuario
        WHERE us.tipo_usuario = 'utente'
        ORDER BY u.id_utente DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error('Erro listar utentes:', err);
            return res.status(500).json({
                erro: 'Erro ao listar utentes'
            });
        }

        res.json(results);
    });
};

// CADASTRAR UTENTE
exports.criarUtente = (req, res) => {

    const {
        nome,
        email,
        senha,
        data_nascimento,
        sexo,
        contacto,
        endereco
    } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            erro: 'Dados obrigatórios em falta'
        });
    }

    // 1. cria usuário
    const sqlUser = `
        INSERT INTO usuario (nome, email, senha_hash, tipo_usuario)
        VALUES (?, ?, ?, 'utente')
    `;

    db.query(sqlUser, [nome, email, senha], (err, resultUser) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                erro: 'Erro ao criar usuário'
            });
        }

        const id_usuario = resultUser.insertId;

        // 2. cria utente
        const sqlUtente = `
            INSERT INTO utente (
                id_usuario,
                data_nascimento,
                sexo,
                contacto,
                endereco
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(sqlUtente, [
            id_usuario,
            data_nascimento,
            sexo,
            contacto,
            endereco
        ], (err2) => {

            if (err2) {
                console.error(err2);
                return res.status(500).json({
                    erro: 'Erro ao criar utente'
                });
            }

            res.status(201).json({
                sucesso: true,
                mensagem: 'Utente criado com sucesso'
            });
        });
    });
};

// BUSCAR PERFIL
exports.buscarUtente = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM utentes
        WHERE id_utente = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                erro: 'Erro ao buscar utente'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                erro: 'Utente não encontrado'
            });
        }

        res.json(results[0]);
    });
};

// ALTERAR STATUS
exports.alterarStatus = (req, res) => {

    const { id_usuario } = req.params;

    const sql = `
        UPDATE usuario
        SET ativo = NOT ativo
        WHERE id_usuario = ?
    `;

    db.query(sql, [id_usuario], (err) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                erro: 'Erro ao atualizar status'
            });
        }

        res.json({
            sucesso: true,
            mensagem: 'Estado atualizado'
        });
    });
};
