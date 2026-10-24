/* Zaffenate — interações progressivas; não depende de servidor ou bibliotecas externas. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const ANALYTICS_ID = 'G-VL4V1VJZNK';
  const CONSENT_KEY = 'zaffenate-analytics-consent-v1';
  let analyticsLoaded = false;

  const readConsent = () => {
    try { return localStorage.getItem(CONSENT_KEY); }
    catch { return null; }
  };
  const saveConsent = (value) => {
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* storage may be blocked */ }
  };

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', ANALYTICS_ID, { anonymize_ip: true });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ANALYTICS_ID);
    document.head.appendChild(script);
  }

  // Set basic privacy consent before loading any optional analytics request.
  let banner;
  const showBanner = () => {
    if (banner) { banner.hidden = false; return; }
    banner = document.createElement('section');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Preferências de privacidade');
    banner.innerHTML = '<div><strong>Privacidade e cookies</strong><p>Usamos análise de visitas somente se você permitir. O mapa também só é carregado mediante sua escolha. <a href="/privacidade/">Leia a política de privacidade</a>.</p></div><div class="cookie-actions"><button class="btn btn-outline" type="button" data-cookie-reject>Recusar opcionais</button><button class="btn btn-primary" type="button" data-cookie-accept>Aceitar análises</button></div>';
    document.body.appendChild(banner);
    $('[data-cookie-reject]', banner).addEventListener('click', () => updateConsent('rejected'));
    $('[data-cookie-accept]', banner).addEventListener('click', () => updateConsent('accepted'));
  };
  const updateConsent = (choice) => {
    const previous = readConsent();
    saveConsent(choice);
    if (banner) banner.hidden = true;
    if (choice === 'accepted') loadAnalytics();
    if (choice === 'rejected' && (analyticsLoaded || previous === 'accepted')) {
      // A loaded third-party script cannot be reliably unloaded; reload with Analytics blocked.
      const names = ['_ga', '_gid', '_gat', '_ga_' + ANALYTICS_ID.slice(2).replaceAll('-', '_')];
      const hosts = [location.hostname, '.' + location.hostname, '.zaffenate.com.br'];
      names.forEach(name => hosts.forEach(domain => {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + domain + '; SameSite=Lax';
      }));
      location.reload();
    }
  };
  if (readConsent() === 'accepted') loadAnalytics();
  else if (readConsent() !== 'rejected') showBanner();
  $$('[data-privacy-settings]').forEach(button => button.addEventListener('click', showBanner));

  $$('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  const menuBtn = $('[data-menu]');
  const nav = $('[data-nav]');
  if (menuBtn && nav) {
    const toggle = (isOpen) => {
      nav.classList.toggle('open', isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    };
    menuBtn.addEventListener('click', () => toggle(!nav.classList.contains('open')));
    $$('a', nav).forEach(a => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  // Google Maps: no connection to third parties until user explicitly requests it.
  $$('[data-load-map]').forEach(button => button.addEventListener('click', () => {
    const frame = button.closest('[data-map]');
    const template = frame && $('[data-map-template]', frame);
    if (!template || !frame) return;
    frame.replaceChildren(template.content.cloneNode(true));
    frame.classList.add('map-loaded');
  }));

  const form = $('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      if (data.get('consentimento') !== 'on') return;
      const fields = ['nome', 'empresa', 'email', 'cidade', 'servico', 'detalhes'];
      const values = Object.fromEntries(fields.map(key => [key, String(data.get(key) || '').trim()]));
      if (!values.nome || !values.empresa || !values.cidade || !values.servico || !values.detalhes) return;
      const message = [
        'Olá, Zaffenate! Solicito uma cotação empresarial.',
        'Nome: ' + values.nome, 'Empresa: ' + values.empresa,
        ...(values.email ? ['E-mail: ' + values.email] : []),
        'Cidade / local: ' + values.cidade,
        'Serviço: ' + values.servico,
        'Descrição: ' + values.detalhes
      ].join('\n');
      // No data is stored in localStorage or sent to site servers.
      const url = 'https://wa.me/5541997766152?text=' + encodeURIComponent(message);
      const status = $('[data-form-status]', form);
      if (status) status.textContent = 'Você será direcionado ao WhatsApp. Revise a mensagem antes de enviar.';
      window.location.assign(url);
    });
  }

  const modal = $('[data-gallery-modal]');
  if (!modal) return;
  const image = $('[data-gallery-image]', modal);
  const title = $('[data-gallery-title]', modal);
  const count = $('[data-gallery-count]', modal);
  let sources = [];
  let currentIndex = 0;
  let opener = null;
  const draw = () => {
    if (!sources.length) return;
    image.src = sources[currentIndex];
    image.alt = (title.textContent || 'Projeto Zaffenate') + ' — fotografia ' + (currentIndex + 1);
    count.textContent = (currentIndex + 1) + ' de ' + sources.length;
  };
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gallery-open-body');
    image.src = 'data:,';
    if (opener) opener.focus();
  };
  const shift = (dir) => { currentIndex = (currentIndex + dir + sources.length) % sources.length; draw(); };
  $$('[data-gallery]').forEach(button => {
    button.addEventListener('click', () => {
      try {
        const parsed = JSON.parse(button.dataset.gallery || '[]');
        sources = parsed.filter(value => typeof value === 'string' && /^\/src\/(industrial|serralheria)\/[0-9]+\.webp$/.test(value));
      } catch { sources = []; }
      if (!sources.length) return;
      opener = button;
      currentIndex = 0;
      title.textContent = button.dataset.title || 'Projetos Zaffenate';
      draw();
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('gallery-open-body');
      $('[data-close]', modal).focus();
    });
  });
  $('[data-close]', modal).addEventListener('click', close);
  $('[data-prev]', modal).addEventListener('click', () => shift(-1));
  $('[data-next]', modal).addEventListener('click', () => shift(1));
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'ArrowRight') shift(1);
    if (e.key === 'ArrowLeft') shift(-1);
    if (e.key === 'Tab') {
      const focusable = $$('button:not([disabled])', modal);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
