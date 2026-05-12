const express = require('express');
const router = express.Router();
const utenteController = require('../controllers/utenteController');

// API para buscar especialidades
router.get('/api/especialidades', utenteController.getEspecialidades);

// Rota para salvar agendamento
router.post('/agendar', utenteController.criarAgendamento);

module.exports = router;