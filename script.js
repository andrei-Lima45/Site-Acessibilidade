/**
 * Script principal do site NaturalFit
 * Gerencia interações do menu mobile e navegação
 */

document.addEventListener('DOMContentLoaded', function() {
    initMenuToggle();
    initNavigation();
    initSmoothScroll();
    initButtonInteractions();
    initAccessibility();
});

/**
 * Inicializa o toggle do menu mobile
 */
function initMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (!menuToggle || !navMenu) return;

    // Toggle do menu ao clicar no botão
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Atualizar aria-expanded para acessibilidade
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Fechar menu ao clicar em um link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Fechar menu ao clicar fora dele
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.header-container')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Melhora a navegação com scroll suave
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);

            // Se o target existe, fazer scroll suave
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Focar no elemento para acessibilidade
                if (target.tagName === 'SECTION') {
                    const firstHeading = target.querySelector('h1, h2, h3');
                    if (firstHeading) {
                        firstHeading.focus();
                    }
                }
            }
        });
    });
}

/**
 * Adiciona comportamento aos botões CTA
 */
function initSmoothScroll() {
    const ctaButtons = document.querySelectorAll('.cta-button, .secondary-button');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Previnir comportamento padrão se necessário
            if (this.getAttribute('aria-label')) {
                announceAction(this.getAttribute('aria-label'));
            }
        });
    });
}

/**
 * Inicializa interações adicionais para botões (CTA e secundários)
 */
function initButtonInteractions() {
    // Botão principal do hero: explorar cardápio
    const exploreBtn = document.querySelector('.hero .cta-button');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById('cardapio');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                announceAction('Abrindo o cardápio');

                // Destaque temporário no grid de pratos
                const grid = document.querySelector('.pratos-grid');
                if (grid) {
                    grid.classList.add('highlight');
                    setTimeout(() => grid.classList.remove('highlight'), 1800);
                }
            }
        });
    }

    // Botões secundários exibem um toast simples
    const secondaryButtons = document.querySelectorAll('.secondary-button');
    secondaryButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const label = btn.getAttribute('aria-label') || btn.textContent.trim();
            showToast(label || 'Ação realizada');
            announceAction(label || 'Ação realizada');
        });
    });

    // Outros CTAs (ex.: footer) recebem mensagem padrão
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(btn => {
        if (btn.closest('.hero')) return; // já tratado acima
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const label = btn.getAttribute('aria-label') || btn.textContent.trim();
            showToast(label || 'Ação iniciada');
            announceAction(label || 'Ação iniciada');
        });
    });
}

/**
 * Mostra um toast acessível no canto inferior direito
 */
function showToast(message, opts = {}) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    document.body.appendChild(toast);

    // Forçar reflow para animação
    void toast.offsetWidth;
    toast.classList.add('toast--visible');

    // Remover após tempo
    const duration = opts.duration || 3000;
    setTimeout(() => {
        toast.classList.remove('toast--visible');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Anuncia ações para leitores de tela
 */
function announceAction(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(function() {
        announcement.remove();
    }, 3000);
}

/**
 * Monitora a navegação durante scroll para destacar o link ativo
 */
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

/**
 * Melhorias de acessibilidade - Skip link funcional
 */
function initAccessibility() {
    // Permite que usuários pulem para o conteúdo principal
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Ir para conteúdo principal';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
}
