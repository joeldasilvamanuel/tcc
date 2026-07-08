/**
 * Health Access Hub - Professional Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Elementos da Interface
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("toggleSidebar");
    const navLinks = document.querySelectorAll('.nav-link');

    // --- LÓGICA DA SIDEBAR ---

    // Restaurar estado salvo (Expandido ou Recolhido)
    const savedState = localStorage.getItem('sidebarState');
    if (savedState === 'collapsed' && sidebar) {
        sidebar.classList.add('collapsed');
        sidebar.classList.remove('expanded');
    }

    if (toggle && sidebar) {
        toggle.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
            sidebar.classList.toggle("expanded");

            // Salvar estado para as outras páginas lembrarem
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarState', isCollapsed ? 'collapsed' : 'expanded');
        });
    }

    // --- CARREGAR DADOS DO PROFISSIONAL (API) ---
    try {
        const response = await fetch('/api/user-info', { credentials: 'include' });
        if (!response.ok) throw new Error('Não autenticado');

        const data = await response.json();

        // Atualizar Nome e Role no Header
        if (document.getElementById('userName')) document.getElementById('userName').textContent = data.nome;
        if (document.getElementById('userRole')) document.getElementById('userRole').textContent = data.role;

        // Atualizar Nome no Banner de Boas-Vindas (apenas o primeiro nome)
        const welcomeName = document.getElementById('welcomeName');
        if (welcomeName) welcomeName.textContent = data.nome.split(' ')[0];

        // Atualizar Avatar Dinâmico
        const avatarImg = document.querySelector('.user-avatar img');
        if (avatarImg) {
            avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nome)}&background=007bff&color=fff&size=40`;
        }
    } catch (err) {
        console.error('Erro ao buscar info do usuário:', err);
        // Se não houver sessão, manda de volta para o login
        if (window.location.pathname !== '/') window.location.href = '/';
    }

    // --- INICIALIZAR GRÁFICO (Se existir na página) ---
    const chartCanvas = document.getElementById('hospitalChart');
    if (chartCanvas) {
        initHospitalChart();
    }
});

/**
 * Função para o Gráfico Hospitalar "Soft"
 */
function initHospitalChart() {
    const ctx = document.getElementById('hospitalChart').getContext('2d');

    let gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.4)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');

    let ecgData = Array(40).fill(5);
    let labels = Array(40).fill('');

    const hospitalChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: ecgData,
                borderColor: '#22c55e',
                borderWidth: 2.5,
                pointRadius: 0,
                tension: 0.4,
                fill: true,
                backgroundColor: gradient
            }]
        },
        options: {
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { display: true, min: 0, max: 20, grid: { color: '#f1f5f9' }, ticks: { display: false } },
                x: { display: false }
            },
            plugins: { legend: { display: false } }
        }
    });

    let counter = 0;
    setInterval(() => {
        let newValue = 5;
        let step = counter % 15;
        if (step === 3) newValue = 15;
        else if (step === 2 || step === 4) newValue = 2;
        else newValue = 5 + (Math.random() * 1);

        ecgData.push(newValue);
        ecgData.shift();

        if (counter % 10 === 0 && document.getElementById('bpmValue')) {
            document.getElementById('bpmValue').textContent = Math.floor(Math.random() * (78 - 72 + 1)) + 72;
        }

        hospitalChart.update('none');
        counter++;
    }, 100);

    // Lógica de pesquisa em tempo real na tabela
    const inputBusca = document.getElementById('searchUtente');
    if (inputBusca) {
        inputBusca.addEventListener('input', function () {
            const termo = this.value.toLowerCase();
            const linhas = document.querySelectorAll('#utentesList tr');

            linhas.forEach(linha => {
                const nome = linha.querySelector('.nome').textContent.toLowerCase();
                const id = linha.querySelector('.id-tag').textContent.toLowerCase();

                if (nome.includes(termo) || id.includes(termo)) {
                    linha.style.display = "";
                } else {
                    linha.style.display = "none";
                }
            });
        });
    }
}

// --- INTERAÇÕES SIMPLES (Alertas/Agenda) ---
document.addEventListener('click', (e) => {
    if (e.target.closest('.notification-icon')) {
        alert('Notificações: 3 novas mensagens de utentes.');
    }

    if (e.target.closest('.action-btn')) {
        alert('A carregar a sua agenda de consultas...');
    }
});

