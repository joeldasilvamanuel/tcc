const express = require('express');
const router = express.Router();
const utenteController = require('../controllers/utenteController');
const { verificarToken } = require('../../server'); // Ajuste o caminho para importar o middleware do app.js se necessário, ou declare-o

// API para buscar especialidades (Protegida)
router.get('/api/especialidades', utenteController.getEspecialidades);

// Rota para salvar agendamento (Protegida)
router.post('/agendar', utenteController.criarAgendamento);

// ================= CRUD UTENTES =================
router.get('/', utenteController.listarUtentes);
router.post('/', utenteController.criarUtente);
router.get('/:id', utenteController.getUtenteById);
router.patch('/:id/status', utenteController.toggleStatusUtente);
router.delete('/:id', utenteController.deleteUtente);

module.exports = router;