const express = require('express');
const router = express.Router();

const iotController = require('../controllers/iotController');

router.post('/leitura', iotController.receberLeitura);

router.get('/ultima/:idWearable', iotController.obterUltimaLeitura);

router.get('/minhas-leituras', iotController.minhasLeituras);

router.get('/historico', iotController.historico);

const { verificarToken } = require('../middleware/authMiddleware');

router.get('/minhas-leituras', iotController.minhasLeituras);

router.get("/ultima", iotController.ultimaLeitura);

module.exports = router;