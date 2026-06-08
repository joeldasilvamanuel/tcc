const ChatService = require('../services/chatServices');

const chatController = {

    async listarConversas(req, res) {

        try {

            const { id_usuario } = req.params;

            const conversas =
                await ChatService
                    .listarConversasPorUtilizador(id_usuario);

            return res.json(conversas);

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro: 'Erro ao listar conversas'
            });
        }
    },

    async listarMensagens(req, res) {

        try {

            const { id_conversa } = req.params;

            const mensagens =
                await ChatService
                    .listarMensagens(id_conversa);

            return res.json(mensagens);

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro: 'Erro ao listar mensagens'
            });
        }
    },

    async enviarMensagem(req, res) {
        console.log(req.body);
        try {

            const {
                id_remetente,
                id_destinatario,
                conteudo
            } = req.body;

            const idConversa =
                await ChatService.criarConversaSeNaoExistir(
                    id_remetente,
                    id_destinatario
                );

            const mensagem =
                await ChatService.guardarMensagem(
                    idConversa,
                    id_remetente,
                    id_destinatario,
                    conteudo
                );

            const io = req.app.get('io');

            io.to(`user_${id_destinatario}`)
                .emit(
                    'receive_message',
                    mensagem
                );

            io.to(`user_${id_remetente}`)
                .emit(
                    'receive_message',
                    mensagem
                );

            await ChatService.criarNotificacao(
                id_destinatario,
                'Nova mensagem'
            );

            return res.json({
                sucesso: true,
                mensagem,
                id_conversa: idConversa
            });

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro: 'Erro ao enviar mensagem'
            });
        }
    },

    async listarProfissionais(req, res) {

        try {

            const profissionais =
                await ChatService.listarProfissionais();

            return res.json(profissionais);

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro: 'Erro ao listar profissionais'
            });
        }
    },

    async obterHistorico(req, res) {

        try {

            const {
                id_user1,
                id_user2
            } = req.params;

            const resultado =
                await ChatService
                    .obterConversaPorUtilizadores(
                        id_user1,
                        id_user2
                    );

            return res.json(
                resultado || {
                    mensagens: []
                }
            );

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                erro:
                    'Erro ao carregar histórico'
            });
        }
    }
};

module.exports = chatController;