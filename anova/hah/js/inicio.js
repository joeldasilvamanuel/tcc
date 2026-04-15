(function () {
    // Elementos mobile drawer
    const menuBtn = document.getElementById('menuBtnMobile');
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        drawer.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (menuBtn) menuBtn.addEventListener('click', openDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);
    drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

    // active link highlight no scroll (simples)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    function highlightNav() {
        let scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                const id = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', highlightNav);
    highlightNav();

    // Form alerta (apenas simulação)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! (simulação) Em breve retornamos contacto.');
            contactForm.reset();
        });
    }

    // Botões principais acção demonstrativa
    // const findBtn = document.querySelector('.btn-primary:first-of-type');
    // if (findBtn && findBtn.innerText.includes('Encontrar')) {
    //     findBtn.addEventListener('click', () => alert('🔍 Redirecionar para página de clínicas (demo)'));
    // }
    // const saberMais = document.querySelector('.btn-outline');
    // if (saberMais && saberMais.innerText.includes('Saber')) {
    //     saberMais.addEventListener('click', () => alert('📘 Saiba mais sobre a nossa missão de saúde digital.'));
    // }
})();