const { connection: db } = require('../config/db');

const especialidadesController = {

    listar: (req, res) => {

        const sql = `
            SELECT
                id_esp AS id,
                nome_esp AS nome
            FROM especialidades
            ORDER BY nome_esp ASC
        `;

        db.query(sql, (err, results) => {
            if (err) {
                console.error('ERRO MYSQL ESPECIALIDADES:', err);

                return res.status(500).json({
                    mensagem: 'Erro ao listar especialidades',
                    erro: err.message
                });
            }

            res.json(results);
        });
    }

};

module.exports = especialidadesController;