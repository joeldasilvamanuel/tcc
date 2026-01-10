const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rotas POST (Formulários)
router.post('/login', authController.handleLogin);
router.post('/register/utente', authController.handleRegisterUtente);

// Rota GET (Links)
router.get('/logout', authController.handleLogout);

module.exports = router;