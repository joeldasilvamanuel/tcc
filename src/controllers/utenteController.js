// src/controllers/utenteController.js

const { connection: db } = require('../config/db');

const utenteController = {

    // Buscar especialidades
    getEspecialidades: (req, res) => {

        const query = `
            SELECT
                id_esp AS id,
                nome_esp AS nome
            FROM especialidades
            ORDER BY nome_esp ASC
        `;

        db.query(query, (err, results) => {

            if (err) {
                console.error("Erro ao buscar especialidades:", err);

                return res.status(500).json({
                    error: "Erro ao carregar especialidades."
                });
            }

            return res.status(200).json(results);
        });
    },

    // Criar agendamento
    criarAgendamento: (req, res) => {

        const {
            nome_completo,
            telefone,
            email,
            id_esp,
            data_consulta,
            horario_consult,
            observacoes
        } = req.body;

        // Validação
        if (
            !nome_completo ||
            !telefone ||
            !id_esp ||
            !data_consulta ||
            !horario_consult
        ) {

            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }

        // Verificar conflito de horário
        const checkQuery = `
            SELECT id_agenda
            FROM agendamentos
            WHERE
                id_esp = ?
                AND data_consulta = ?
                AND horario_consulta = ?
                AND status != 'Cancelado'
        `;

        db.query(
            checkQuery,
            [
                id_esp,
                data_consulta,
                horario_consult
            ],
            (err, results) => {

                if (err) {

                    console.error(err);

                    return res.status(500).json({
                        mensagem: "Erro interno no servidor."
                    });
                }

                // Horário já ocupado
                if (results.length > 0) {

                    return res.status(409).json({
                        mensagem: "Este horário já está ocupado."
                    });
                }

                // Inserir consulta
                const insertQuery = `
                    INSERT INTO agendamentos (
                        nome_completo,
                        telefone,
                        email,
                        id_esp,
                        data_consulta,
                        horario_consulta,
                        observacoes,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'Pendente')
                `;

                db.query(
                    insertQuery,
                    [
                        nome_completo,
                        telefone,
                        email || null,
                        id_esp,
                        data_consulta,
                        horario_consult,
                        observacoes || null
                    ],
                    (err, result) => {

                        if (err) {

                            console.error("Erro ao inserir consulta:", err);

                            return res.status(500).json({
                                mensagem: "Erro ao gravar agendamento."
                            });
                        }

                        return res.status(201).json({
                            sucesso: true,
                            mensagem: "Consulta agendada com sucesso!"
                        });
                    }
                );
            }
        );
    }
};

// ===================== CRUD UTENTES (ADMIN) =====================

// LISTAR UTENTES
utenteController.listarUtentes = (req, res) => {
    const sql = `
        SELECT id_usuario, nome, email, ativo
        FROM usuario
        WHERE tipo_usuario = 'utente'
        ORDER BY id_usuario DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro listar utentes:", err);
            return res.status(500).json({ error: err.message });
        }

        const utentes = results.map(u => ({
            id: u.id_usuario,
            nome: u.nome,
            email: u.email,
            status: u.ativo ? "ativo" : "inativo"
        }));

        res.json(utentes);
    });
};

// CRIAR UTENTE
utenteController.criarUtente = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Campos obrigatórios em falta" });
    }

    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash(senha, 10);

    const sql = `
        INSERT INTO usuario (nome, email, senha_hash, tipo_usuario)
        VALUES (?, ?, ?, 'utente')
    `;

    db.query(sql, [nome, email, hash], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }

        res.json({ success: true, id: result.insertId });
    });
};

// GET UTENTE POR ID
utenteController.getUtenteById = (req, res) => {
    const sql = `
        SELECT id_usuario, nome, email, ativo
        FROM usuario
        WHERE id_usuario = ?
    `;

    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results[0]);
    });
};

// TOGGLE STATUS
utenteController.toggleStatusUtente = (req, res) => {
    const sql = `
        UPDATE usuario
        SET ativo = NOT ativo
        WHERE id_usuario = ?
    `;

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ success: true });
    });
};

// DELETE UTENTE
utenteController.deleteUtente = (req, res) => {
    const sql = `
        DELETE FROM usuario
        WHERE id_usuario = ?
    `;

    db.query(sql, [req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }

        res.json({ success: true });
    });
};

module.exports = utenteController;