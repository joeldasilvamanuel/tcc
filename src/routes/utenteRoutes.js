const express = require('express');
const router = express.Router();
const utenteController = require('../controllers/utenteController');
const { verificarToken } = require('../../server'); // Ajuste o caminho para importar o middleware do app.js se necessário, ou declare-o

// API para buscar especialidades (Protegida)
router.get('/api/especialidades', utenteController.getEspecialidades);

// Rota para salvar agendamento (Protegida)
router.post('/agendar', utenteController.criarAgendamento);

module.exports = router;