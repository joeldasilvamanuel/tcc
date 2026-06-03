const { connection: db } = require('../config/db');
const AgendamentoModel = require('../models/agendamentoModel');

const agendamentoController = {

    // =====================================
    // EXIBIR TELA DE AGENDAMENTO
    // =====================================
    exibirTelaAgendar: (req, res) => {
        res.sendFile('agendar.html', {
            root: './src/views'
        });
    },

    // =====================================
    // LISTAR ESPECIALIDADES
    // =====================================
    listarEspecialidades: async (req, res) => {
        try {
            const especialidades =
                await AgendamentoModel.buscarEspecialidades();

            return res.status(200).json(especialidades);

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                mensagem: "Erro ao buscar especialidades."
            });
        }
    },

    // =====================================
    // SALVAR AGENDAMENTO
    // =====================================
    salvarAgendamento: async (req, res) => {
        try {
            const {
                nome_completo,
                telefone,
                email,
                id_esp,
                data_consulta,
                horario_consulta,
                observacoes
            } = req.body;

            if (
                !nome_completo ||
                !telefone ||
                !id_esp ||
                !data_consulta ||
                !horario_consulta
            ) {
                return res.status(400).json({
                    mensagem: "Por favor, preencha todos os campos obrigatórios."
                });
            }

            const horarioOcupado =
                await AgendamentoModel.verificarDisponibilidade(
                    id_esp,
                    data_consulta,
                    horario_consulta
                );

            if (horarioOcupado) {
                return res.status(409).json({
                    mensagem: "Este horário já foi preenchido. Escolha outro."
                });
            }

            const novoAgendamento =
                await AgendamentoModel.criar(req.body);

            return res.status(201).json({
                sucesso: true,
                mensagem: "Agendamento realizado com sucesso!",
                dados: novoAgendamento
            });

        } catch (error) {
            console.error("Erro ao salvar consulta:", error);
            return res.status(500).json({
                mensagem: "Erro interno no servidor."
            });
        }
    },

    // =====================================
    // LISTAR TODOS OS AGENDAMENTOS
    // =====================================
    listarTodos: (req, res) => {
        db.query(
            `
            SELECT *
            FROM agendamentos
            ORDER BY data_consulta DESC, horario_consulta ASC
            `,
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        mensagem: "Erro ao listar agendamentos."
                    });
                }

                res.json(results);
            }
        );
    },

    // =====================================
    // FILTRAR AGENDAMENTOS POR DATA
    // =====================================
    filtrarPorData: (req, res) => {
        const { data } = req.params;

        db.query(
            `
            SELECT *
            FROM agendamentos
            WHERE data_consulta = ?
            ORDER BY horario_consulta ASC
            `,
            [data],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        mensagem: "Erro ao filtrar por data."
                    });
                }

                res.json(results);
            }
        );
    },

    // =====================================
    // ATUALIZAR STATUS (CORRIGIDO)
    // =====================================
    atualizarStatus: (req, res) => {

        const { id } = req.params;
        let { status } = req.body;

        // ===============================
        // NORMALIZAÇÃO FRONTEND -> MYSQL
        // ===============================
        const mapaStatus = {
            "Confirmada": "Confirmado",
            "Cancelada": "Cancelado",
            "Pendente": "Pendente",
            "Realizado": "Realizado",
            "Nao_compareceu": "Nao_compareceu"
        };

        status = mapaStatus[status] || status;

        const statusValidos = [
            "Pendente",
            "Confirmado",
            "Cancelado",
            "Realizado",
            "Nao_compareceu"
        ];

        if (!statusValidos.includes(status)) {
            return res.status(400).json({
                mensagem: "Status inválido."
            });
        }

        db.query(
            `
            UPDATE agendamentos
            SET status = ?
            WHERE id_agenda = ?
            `,
            [status, id],
            (err, result) => {

                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        mensagem: "Erro ao atualizar status."
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        mensagem: "Agendamento não encontrado."
                    });
                }

                res.json({
                    sucesso: true,
                    mensagem: "Status atualizado com sucesso."
                });
            }
        );
    }
};

module.exports = agendamentoController;