const { connection: db } = require('../config/db');

const AgendamentoModel = {

    // =========================
    // BUSCAR ESPECIALIDADES
    // =========================
    buscarEspecialidades: () => {
        return new Promise((resolve, reject) => {

            const sql = `
                SELECT id_esp, nome_esp
                FROM especialidades
                ORDER BY nome_esp ASC
            `;

            db.query(sql, (err, results) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }

                resolve(results);
            });
        });
    },

    // =========================
    // VERIFICAR DISPONIBILIDADE
    // =========================
    verificarDisponibilidade: async (id_esp, data, horario_consulta) => {

        return new Promise((resolve, reject) => {

            const sql = `
                SELECT *
                FROM agendamentos
                WHERE id_esp = ?
                AND data_consulta = ?
                AND horario_consulta = ?
                AND status != 'Cancelado'
            `;

            db.query(sql, [id_esp, data, horario_consulta], (err, results) => {

                if (err) {
                    console.error(err);
                    return reject(err);
                }

                resolve(results.length > 0);
            });
        });
    },

    // =========================
    // CRIAR AGENDAMENTO
    // =========================
    criar: (dados) => {

        return new Promise((resolve, reject) => {

            const {
                nome_completo,
                telefone,
                email,
                id_esp,
                data_consulta,
                horario_consulta,
                observacoes
            } = dados;

            const sql = `
                INSERT INTO agendamentos
                (
                    nome_completo,
                    telefone,
                    email,
                    id_esp,
                    data_consulta,
                    horario_consulta,
                    observacoes,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const valores = [
                nome_completo,
                telefone,
                email,
                id_esp,
                data_consulta,
                horario_consulta,
                observacoes || null,
                'Pendente'
            ];

            db.query(sql, valores, (err, result) => {

                if (err) {
                    console.error(err);
                    return reject(err);
                }

                resolve({
                    id_agenda: result.insertId,
                    ...dados,
                    status: 'Pendente'
                });
            });
        });
    }
};

module.exports = AgendamentoModel;