// Toggle sidebar
document.getElementById('toggleSidebar').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('expanded');
    sidebar.classList.toggle('collapsed');
});

const messageInput = document.getElementById('messageInput');

const sendBtn = document.getElementById('sendBtn');

const socket = io();

let conversaAtual = null;

let utenteSelecionado = null;

const messagesArea = document.getElementById('messagesArea');

let utilizadorAtual = null;

const conversationsList = document.getElementById('conversationsList');

socket.on(
    'receive_message',
    (mensagem) => {

        console.log('RECEBIDA:', mensagem);

        if (
            Number(
                mensagem.id_conversa
            ) ===
            Number(
                conversaAtual
            )
        ) {

            adicionarMensagemNaTela(
                mensagem
            );

            messagesArea.scrollTop =
                messagesArea.scrollHeight;
        }

        carregarConversas();
    }
);

async function iniciarChat() {

    try {

        const resposta =
            await fetch('/auth/me');

        utilizadorAtual =
            await resposta.json();

        console.log(
            'PROFISSIONAL AUTENTICADO:',
            utilizadorAtual
        );

        socket.emit(
            'join_room',
            utilizadorAtual.id_usuario
        );

        carregarConversas();

    } catch (erro) {

        console.error(erro);
    }
}

async function carregarConversas() {

    try {

        const resposta =
            await fetch(
                `/api/chat/conversas/${utilizadorAtual.id_usuario}`
            );

        const conversas =
            await resposta.json();

        conversationsList.innerHTML = '';

        conversas.forEach(
            conversa => {

                const item =
                    document.createElement(
                        'div'
                    );

                item.classList.add(
                    'conversation-item'
                );

                item.innerHTML = `
                    <div class="conversation-avatar">
                        <i class="fa-solid fa-user"></i>
                    </div>

                    <div class="conversation-content">
                        <h4>
                            ${conversa.nome_outro_utilizador}
                        </h4>

                        <p>
                            Utente
                        </p>
                    </div>
                `;

                item.addEventListener(
                    'click',
                    () => {

                        abrirConversa(
                            conversa
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

async function abrirConversa(
    conversa
) {

    document.getElementById(
        'emptyChat'
    ).style.display = 'none';

    document.getElementById(
        'chatArea'
    ).style.display = 'flex';

    conversaAtual =
        conversa.id_conversa;

    utenteSelecionado =
        conversa;

    document.getElementById(
        'contactName'
    ).textContent =
        conversa.nome_outro_utilizador;

    try {

        const resposta =
            await fetch(
                `/api/chat/mensagens/${conversa.id_conversa}`
            );

        const mensagens =
            await resposta.json();

        messagesArea.innerHTML = '';

        mensagens.forEach(
            mensagem => {

                adicionarMensagemNaTela(
                    mensagem
                );

            }
        );

    } catch (erro) {

        console.error(
            erro
        );
    }
}

function adicionarMensagemNaTela(
    mensagem
) {
    console.log('ADICIONAR NA TELA:', mensagem);

    const div =
        document.createElement(
            'div'
        );

    const enviadaPorMim =

        Number(
            mensagem.id_remetente
        ) ===
        Number(
            utilizadorAtual.id_usuario
        );

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

    messagesArea.appendChild(
        div
    );
}

async function enviarMensagem() {

    const texto =
        messageInput.value.trim();

    if (!texto) return;

    if (!utenteSelecionado) {

        alert(
            'Selecione uma conversa'
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
                            utenteSelecionado.id_outro_utilizador,

                        conteudo:
                            texto
                    })
                }
            );

        await resposta.json();

        messageInput.value = '';

    } catch (erro) {

        console.error(
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

        if (
            e.key === 'Enter'
        ) {

            enviarMensagem();
        }

    }
);

iniciarChat();