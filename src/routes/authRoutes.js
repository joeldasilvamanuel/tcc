const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const path = require('path');

// Rotas POST (Formulario)
router.post('/login', authController.handleLogin);
router.post('/register/utente', authController.handleRegisterUtente);
router.post('/forgot-password', authController.handleForgotPassword);
router.post('/reset-password', authController.handleResetPassword);

// Rota GET (links)
router.get('/logout', authController.handleLogout);

// Rota GET para a tela de redefinir senha com token
router.get('/redefinir-senha', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/auth/redefinir-senha.html'))
});

module.exports = router;































// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');

// // Rotas POST (Formulários)
// router.post('/login', authController.handleLogin);
// router.post('/register/utente', authController.handleRegisterUtente);

// // Rota GET (Links)
// router.get('/logout', authController.handleLogout);

// module.exports = router;