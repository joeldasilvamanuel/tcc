const express = require('express');

const router = express.Router();

const chatController =
    require('../controllers/chatController');

router.get('/conversas/:id_usuario', chatController.listarConversas);

router.get('/mensagens/:id_conversa', chatController.listarMensagens);

router.post('/mensagem', chatController.enviarMensagem);

router.get('/profissionais', chatController.listarProfissionais);

router.get('/historico/:id_user1/:id_user2', chatController.obterHistorico);

module.exports = router;