const { connection: db } = require('../config/db');

const usuariosController = {

    listarUtentes: (req, res) => {

        const sql = `
            SELECT id_usuario AS id, nome AS nome_completo
            FROM usuario
            WHERE tipo_usuario = 'utente'
            ORDER BY nome ASC
        `;

        db.query(sql, (err, results) => {
            if (err) {
                console.error("ERRO LISTAR UTENTES:", err);
                return res.status(500).json({
                    mensagem: 'Erro ao listar utentes',
                    erro: err.message
                });
            }

            res.json(results);
        });
    }

};

module.exports = usuariosController;