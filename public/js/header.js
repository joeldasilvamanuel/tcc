document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/user-info');
        if (!res.ok) throw new Error();

        const data = await res.json();

        const avatarPadrao = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nome)}&background=007bff&color=fff`;
        const fotoFinal = data.foto_perfil || avatarPadrao;

        // Header
        const headerAvatar = document.getElementById('headerAvatar');
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');

        if (headerAvatar) headerAvatar.src = fotoFinal;
        if (userName) userName.textContent = data.nome;
        if (userRole) userRole.textContent = data.role;

    } catch (err) {
        window.location.href = '/';
    }
});
