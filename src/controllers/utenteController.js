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

module.exports = utenteController;