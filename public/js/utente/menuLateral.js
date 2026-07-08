
(function () {
    // Executa imediatamente para evitar flickers visuais na transição de páginas
    const sidebar = document.getElementById("sidebar");
    const savedState = localStorage.getItem('sidebarState');

    if (savedState === 'collapsed' && sidebar) {
        sidebar.className = 'collapsed';
    } else if (sidebar) {
        sidebar.className = 'expanded';
    }

    // Aguarda o DOM estar pronto para mapear os cliques de forma global
    document.addEventListener("DOMContentLoaded", () => {
        const sidebarEl = document.getElementById("sidebar");

        document.addEventListener("click", (e) => {
            // 1. Clique no botão de fechar/recolher
            const toggleBtn = e.target.closest("#toggleSidebar");
            if (toggleBtn && sidebarEl) {
                e.preventDefault();
                e.stopPropagation();
                sidebarEl.className = 'collapsed';
                localStorage.setItem('sidebarState', 'collapsed');
                return;
            }

            // 2. Clique no Logotipo para expandir (Apenas se estiver recolhido)
            const logoBox = e.target.closest("#logoBox");
            if (logoBox && sidebarEl) {
                if (sidebarEl.classList.contains("collapsed")) {
                    e.preventDefault();
                    e.stopPropagation();
                    sidebarEl.className = 'expanded';
                    localStorage.setItem('sidebarState', 'expanded');
                }
            }
        });
    });
})();