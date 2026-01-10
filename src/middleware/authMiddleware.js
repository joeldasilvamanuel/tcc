// src/middleware/authMiddleware.js

// Verifica se o usuário tem uma sessão ativa
exports.isLoggedIn = (req, res, next) => {
    if (req.session && req.session.isLoggedIn) {
        return next();
    }
    res.redirect('/'); // Se não logado, volta para o login
};

// Verifica se o nível de acesso (role) é o correto
exports.checkRole = (role) => {
    return (req, res, next) => {
        if (req.session.role === role) {
            return next();
        }
        res.status(403).send('Acesso Negado: Você não tem permissão para esta área.');
    };
};