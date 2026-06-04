const express = require('express');
const router = express.Router();

const usuariosController = require('../controllers/usuariosController');

// listar utentes (pacientes)
router.get('/utentes', usuariosController.listarUtentes);

module.exports = router;