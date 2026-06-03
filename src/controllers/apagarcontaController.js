const { connection: db } = require('../config/db');

const apagarcontaController = {};

// DELETE UTENTE
apagarcontaController.deleteConta = (req, res) => {
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

module.exports = apagarcontaController;