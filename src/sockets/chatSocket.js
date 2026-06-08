const ChatService = require('../services/chatServices');

module.exports = (io) => {

    io.on('connection', (socket) => {

        console.log('Utilizador conectado');

        socket.on('join_room', (idUsuario) => {

            socket.join(`user_${idUsuario}`);

            console.log(
                `Utilizador ${idUsuario} entrou na sala`
            );
        });

        socket.on('send_message', async (dados) => {

            try {

                const {
                    id_remetente,
                    id_destinatario,
                    conteudo
                } = dados;

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

                await ChatService.criarNotificacao(
                    id_destinatario,
                    'Nova mensagem recebida',
                    1
                );

                io.to(`user_${id_destinatario}`)
                    .emit('receive_message', mensagem);

                io.to(`user_${id_remetente}`)
                    .emit('receive_message', mensagem);

            } catch (erro) {

                console.error(erro);

                socket.emit(
                    'chat_error',
                    'Erro ao enviar mensagem'
                );
            }
        });

        socket.on('disconnect', () => {

            console.log('Utilizador desconectado');
        });
    });
};