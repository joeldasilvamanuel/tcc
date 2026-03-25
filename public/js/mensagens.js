// Toggle sidebar
document.getElementById('toggleSidebar').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('expanded');
    sidebar.classList.toggle('collapsed');
});

// Simulação de chat
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatWith = document.getElementById('chatWith');

// Mensagens mock por utente
const conversations = {
    maria: [
        { text: "Bom dia Doutor, a minha frequência cardíaca subiu muito esta manhã...", sent: false, time: "10:15" },
        { text: "Bom dia Maria. Pode medir novamente e me enviar o valor exato?", sent: true, time: "10:18" },
        { text: "Medir agora... 138 bpm em repouso", sent: false, time: "10:20" }
    ],
    joao: [
        { text: "Olá Dr. Silva, será que dava para remarcar a consulta de quinta?", sent: false, time: "14:45" }
    ],
    ana: [
        { text: "Os resultados chegaram, tudo normal?", sent: false, time: "09:12" },
        { text: "Bom dia Ana. Sim, está tudo dentro dos parâmetros normais. Vamos manter o tratamento atual.", sent: true, time: "09:30" }
    ]
};

let currentUser = 'maria';

function loadConversation(user) {
    currentUser = user;
    chatWith.textContent = document.querySelector(`[data-user="${user}"] h4`).textContent;
    messagesContainer.innerHTML = '';

    (conversations[user] || []).forEach(msg => {
        const div = document.createElement('div');
        div.className = `message ${msg.sent ? 'sent' : 'received'}`;
        div.innerHTML = `
                    ${msg.text}
                    <div class="message-time">${msg.time}</div>
                `;
        messagesContainer.appendChild(div);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    const div = document.createElement('div');
    div.className = 'message sent';
    div.innerHTML = `
                ${text}
                <div class="message-time">Agora</div>
            `;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    messageInput.value = '';

    // Simula resposta automática após 2s (opcional)
    setTimeout(() => {
        if (Math.random() > 0.5) {
            const reply = document.createElement('div');
            reply.className = 'message received';
            reply.innerHTML = `Obrigada Doutor! Vou seguir a indicação. <div class="message-time">Agora</div>`;
            messagesContainer.appendChild(reply);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, 1800);
}

// Eventos
document.querySelectorAll('.conversation-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.conversation-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        loadConversation(item.dataset.user);
    });
});

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
});

// Carrega conversa inicial
loadConversation('maria');