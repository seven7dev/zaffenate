(() => {
    const menuBtn = document.querySelector('[data-menu]');
    const nav = document.querySelector('[data-nav]');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            const open = nav.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', String(open));
        });

        nav.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => nav.classList.remove('open'))
        );
    }

    document.querySelectorAll('[data-year]').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    const modal = document.querySelector('[data-gallery-modal]');
    if (!modal) return;

    const img = modal.querySelector('[data-gallery-image]');
    const video = modal.querySelector('[data-gallery-video]');
    const title = modal.querySelector('[data-gallery-title]');
    const count = modal.querySelector('[data-gallery-count]');

    let items = [];
    let index = 0;

    const isVideo = (src) => {
        return /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);
    };

    const show = () => {
        if (!items.length) return;

        const src = items[index];
        const videoFile = isVideo(src);

        // Limpa mídia anterior
        if (video) {
            video.pause();
            video.removeAttribute('src');
            video.load();
            video.style.display = 'none';
        }

        if (img) {
            img.removeAttribute('src');
            img.style.display = 'none';
        }

        // Vídeo
        if (videoFile && video) {
            video.src = src;
            video.style.display = 'block';
            video.controls = true;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;

            video.play().catch(() => {});
        }

        // Imagem
        else if (img) {
            img.src = src;
            img.alt =
                (title.textContent || 'Galeria Zaffenate') +
                ' — foto ' +
                (index + 1);

            img.style.display = 'block';
        }

        // Contador
        if (count) {
            count.textContent =
                `${videoFile ? 'Vídeo' : 'Imagem'} ${index + 1} de ${items.length}`;
        }
    };

    document.querySelectorAll('[data-gallery]').forEach(btn => {
        btn.addEventListener('click', () => {
            try {
                items = JSON.parse(btn.dataset.gallery);
            } catch (error) {
                console.error('Erro ao ler data-gallery:', error);
                return;
            }

            if (!Array.isArray(items) || !items.length) return;

            index = 0;

            if (title) {
                title.textContent = btn.dataset.title || 'Galeria';
            }

            show();

            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    const close = () => {
        modal.classList.remove('open');

        if (video) {
            video.pause();
            video.removeAttribute('src');
            video.load();
        }

        document.body.style.overflow = '';
    };

    const next = () => {
        if (!items.length) return;

        index = (index + 1) % items.length;
        show();
    };

    const prev = () => {
        if (!items.length) return;

        index = (index - 1 + items.length) % items.length;
        show();
    };

    const closeBtn = modal.querySelector('[data-close]');
    const prevBtn = modal.querySelector('[data-prev]');
    const nextBtn = modal.querySelector('[data-next]');

    if (closeBtn) {
        closeBtn.addEventListener('click', close);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prev);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', next);
    }

    modal.addEventListener('click', e => {
        if (e.target === modal) {
            close();
        }
    });

    addEventListener('keydown', e => {
        if (!modal.classList.contains('open')) return;

        if (e.key === 'Escape') {
            close();
        }

        if (e.key === 'ArrowRight') {
            next();
        }

        if (e.key === 'ArrowLeft') {
            prev();
        }
    });
})();
