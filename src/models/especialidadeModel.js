const db = require('../config/db');

const Especialidade = {
    listarTodas: async () => {
        const [rowns] = await db.query('SELECT id_esp, nome_completo FROM especialidades ORDER BY nome_completo ASC');
        return rowns;
    }
};

module.exports = Especialidade;