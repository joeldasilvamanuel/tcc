const express = require('express');
const router = express.Router();

const {
    listarProfissionais,
    criarProfissional,
    toggleStatus,
    deleteProfissional
} = require('../controllers/profissionalController');

router.get('/', listarProfissionais);
router.post('/', criarProfissional);
router.patch('/:id/status', toggleStatus);
router.delete('/:id', deleteProfissional);

module.exports = router;