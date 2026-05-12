const db = require('../config/db');

const Agendamento = {
    criar: async (dados) => {
        const sql = `INSERT INTO agendamentos (nome_completo, telefone, email, id_esp, data_consulta, horario_consulta, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const [results] = await db.query(sql, [
            dados.nome_completo,
            dados.telefone,
            dados.email || null,
            dados.id_esp,
            dados.data_consulta,
            dados.horario_consulta,
            dados.observacoes || null
        ]);
        return results;
    }
};

module.exports = Agendamento;