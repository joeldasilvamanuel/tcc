const express = require('express');
const router = express.Router();

const rececaoController = require('../controllers/rececaoController');

// CRUD RECEPCIONISTA

// LISTAR UTENTES
router.get('/utentes', rececaoController.listarUtentes);

// CADASTRAR UTENTE
router.post('/utentes', rececaoController.criarUtente);

// VER PERFIL
router.get('/utentes/:id', rececaoController.buscarUtente);

// ALTERAR STATUS
router.patch('/utentes/:id/status', rececaoController.alterarStatus);

module.exports = router;