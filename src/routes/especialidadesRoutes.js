const express = require('express');
const router = express.Router();

const especialidadesController = require('../controllers/especialidadesController');

router.get('/especialidades', especialidadesController.listar);

module.exports = router;