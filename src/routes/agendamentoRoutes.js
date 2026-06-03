const express = require('express');
const router = express.Router();

const agendamentoController = require('../controllers/agendamentoController');

// ==============================
// ESPECIALIDADES
// ==============================
router.get(
    '/especialidades',
    agendamentoController.listarEspecialidades
);

// ==============================
// CRIAR AGENDAMENTO
// ==============================
router.post(
    '/',
    agendamentoController.salvarAgendamento
);

// ==============================
// LISTAR TODOS
// ==============================
router.get(
    '/',
    agendamentoController.listarTodos
);

// ==============================
// FILTRAR POR DATA
// ==============================
router.get(
    '/data/:data',
    agendamentoController.filtrarPorData
);

// ==============================
// ATUALIZAR STATUS
// ==============================
router.put(
    '/:id/status',
    agendamentoController.atualizarStatus
);

module.exports = router;