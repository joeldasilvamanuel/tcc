// Toggle sidebar
document.getElementById('toggleSidebar').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('expanded');
    sidebar.classList.toggle('collapsed');
});

// Chat HEALTH ACCESS HUB

let profissionalSelecionado = null;

const messageInput = document.getElementById('messageInput');

const sendBtn = document.getElementById('sendBtn');

const messagesArea = document.getElementById('messagesArea');

const conversationsList = document.getElementById('conversationsList');

let conversaSelecionada = null;

let conversaAtual = null;

const socket = io();

socket.on(
    'receive_message',
    (mensagem) => {

        console.log(
            'Mensagem recebida:',
            mensagem
        );

        if (!profissionalSelecionado)
            return;

        const pertenceAoChatAtual =

            Number(
                mensagem.id_remetente
            ) ===
            Number(
                profissionalSelecionado.id_usuario
            )

            ||

            Number(
                mensagem.id_destinatario
            ) ===
            Number(
                profissionalSelecionado.id_usuario
            );

        if (pertenceAoChatAtual) {

            adicionarMensagemNaTela(
                mensagem
            );

            messagesArea.scrollTop =
                messagesArea.scrollHeight;
        }

    }
);

let utilizadorAtual = null;

async function iniciarChat() {

    try {

        const resposta = await fetch('/auth/me');

        utilizadorAtual = await resposta.json();

        console.log(
            'Utilizador autenticado:',
            utilizadorAtual
        );

        socket.emit(
            'join_room',
            utilizadorAtual.id_usuario
        );

        carregarConversas();

    } catch (erro) {

        console.error(
            'Erro ao iniciar chat:',
            erro
        );
    }
}

async function carregarConversas() {

    try {

        const resposta =
            await fetch(
                '/api/chat/profissionais'
            );

        const profissionais =
            await resposta.json();

        conversationsList.innerHTML = '';

        profissionais.forEach(
            profissional => {

                let icone = 'fa-user-doctor';

                if (
                    profissional.tipo_usuario ===
                    'enfermeiro'
                ) {

                    icone = 'fa-user-nurse';
                }

                if (
                    profissional.tipo_usuario ===
                    'recepcionista'
                ) {

                    icone = 'fa-hospital';
                }

                const item =
                    document.createElement(
                        'div'
                    );

                item.classList.add(
                    'conversation-item'
                );

                item.innerHTML = `
                    <div class="conversation-avatar">
                        <i class="fa-solid ${icone}"></i>
                    </div>

                    <div class="conversation-content">
                        <h4>
                            ${profissional.nome}
                        </h4>

                        <p>
                            ${profissional.tipo_usuario}
                        </p>
                    </div>
                `;

                item.addEventListener(
                    'click',
                    () => {

                        document
                            .querySelectorAll(
                                '.conversation-item'
                            )
                            .forEach(el =>
                                el.classList.remove(
                                    'active'
                                )
                            );

                        item.classList.add(
                            'active'
                        );

                        iniciarConversa(
                            profissional
                        );

                    }
                );

                conversationsList
                    .appendChild(item);

            }
        );

    } catch (erro) {

        console.error(
            erro
        );
    }
}

async function abrirConversa(idConversa) {

    try {

        conversaAtual = idConversa;

        const resposta = await fetch(
            `/api/chat/mensagens/${idConversa}`
        );

        const mensagens =
            await resposta.json();

        messagesArea.innerHTML = '';

        mensagens.forEach(mensagem => {

            adicionarMensagemNaTela(
                mensagem
            );

        });

        messagesArea.scrollTop =
            messagesArea.scrollHeight;

    } catch (erro) {

        console.error(
            'Erro ao abrir conversa:',
            erro
        );
    }
}

function adicionarMensagemNaTela(mensagem) {

    const div =
        document.createElement('div');

    const enviadaPorMim =
        Number(mensagem.id_remetente) ===
        Number(utilizadorAtual.id_usuario);

    div.classList.add(
        enviadaPorMim
            ? 'message-sent'
            : 'message-received'
    );

    div.innerHTML = `
        <div class="message-bubble">
            ${mensagem.conteudo}
        </div>
    `;

    messagesArea.appendChild(div);
}

function obterDestinatarioAtual() {

    if (!conversaSelecionada) {
        return null;
    }

    return conversaSelecionada.id_outro_utilizador;
}

async function iniciarConversa(profissional) {

    document.getElementById(
        'emptyChat'
    ).style.display = 'none';

    document.getElementById(
        'chatArea'
    ).style.display = 'flex';

    profissionalSelecionado =
        profissional;


    document.getElementById(
        'contactName'
    ).textContent =
        profissional.nome;

    messagesArea.innerHTML = '';

    try {

        const resposta =
            await fetch(
                `/api/chat/historico/${utilizadorAtual.id_usuario}/${profissional.id_usuario}`
            );

        const dados =
            await resposta.json();

        if (
            dados.mensagens
        ) {

            dados.mensagens.forEach(
                mensagem => {

                    adicionarMensagemNaTela(
                        mensagem
                    );

                }
            );
        }

    } catch (erro) {

        console.error(
            'Erro ao carregar histórico:',
            erro
        );
    }

    console.log(
        'Profissional selecionado:',
        profissional
    );
}

async function enviarMensagem() {
    console.log('ENVIAR MENSAGEM');
    const texto =
        messageInput.value.trim();

    if (!texto) return;

    if (!profissionalSelecionado) {

        alert(
            'Selecione um profissional'
        );

        return;
    }

    try {

        const resposta =
            await fetch(
                '/api/chat/mensagem',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':
                            'application/json'
                    },
                    body: JSON.stringify({
                        id_remetente:
                            utilizadorAtual.id_usuario,

                        id_destinatario:
                            profissionalSelecionado.id_usuario,

                        conteudo:
                            texto
                    })
                }
            );

        const resultado =
            await resposta.json();

        // socket.emit(
        //     'send_message',
        //     {
        //         id_conversa:
        //             resultado.id_conversa,

        //         id_remetente:
        //             utilizadorAtual.id_usuario,

        //         id_destinatario:
        //             profissionalSelecionado.id_usuario,

        //         conteudo:
        //             texto
        //     }
        // );

        messageInput.value = '';

        conversaAtual =
            resultado.id_conversa;

    } catch (erro) {

        console.error(
            'Erro ao enviar mensagem:',
            erro
        );
    }
}

sendBtn.addEventListener(
    'click',
    enviarMensagem
);

messageInput.addEventListener(
    'keypress',
    (e) => {

        if (e.key === 'Enter') {
            enviarMensagem();
        }

    }
);

iniciarChat();