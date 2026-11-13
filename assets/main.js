(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var WA = '5571992647606';

  // header: solid on scroll + mobile menu
  var hdr = document.querySelector('.hdr');
  function onScroll() { if (hdr) hdr.classList.toggle('solid', window.scrollY > 40 || hdr.classList.contains('open')); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var mb = document.querySelector('.menu-btn');
  if (mb) mb.addEventListener('click', function () {
    var open = !hdr.classList.contains('open');
    hdr.classList.toggle('open', open); mb.setAttribute('aria-expanded', open ? 'true' : 'false');
    mb.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); onScroll();
  });
  document.querySelectorAll('.mnav a').forEach(function (a) {
    a.addEventListener('click', function () { hdr.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); onScroll(); });
  });

  // reveal on scroll
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.rv').forEach(function (el) { ro.observe(el); });

    // videos: play only while visible
    var vo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && e.intersectionRatio >= 0.35) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else if (!v.dataset.keep) { v.pause(); }
      });
    }, { threshold: [0, 0.35, 0.8] });
    document.querySelectorAll('video[data-auto]').forEach(function (v) { v.muted = true; vo.observe(v); });
  } else {
    document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  // sound toggles
  document.querySelectorAll('.snd').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.closest('figure').querySelector('video');
      var turnOn = v.muted;
      document.querySelectorAll('video[data-auto]').forEach(function (o) { o.muted = true; });
      document.querySelectorAll('.snd').forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      if (turnOn) { v.muted = false; var p = v.play(); if (p && p.catch) p.catch(function () {}); b.setAttribute('aria-pressed', 'true'); }
    });
  });

  // filters
  document.querySelectorAll('[data-filter-group]').forEach(function (grp) {
    var target = document.getElementById(grp.dataset.filterGroup);
    grp.querySelectorAll('.chip').forEach(function (c) {
      c.addEventListener('click', function () {
        grp.querySelectorAll('.chip').forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
        c.setAttribute('aria-pressed', 'true');
        var f = c.dataset.f;
        target.querySelectorAll('[data-cat]').forEach(function (it) {
          var show = f === 'todos' || it.dataset.cat.split(' ').indexOf(f) > -1;
          it.hidden = !show;
          if (show) it.classList.add('in');
        });
      });
    });
  });

  // contact form -> WhatsApp
  var form = document.getElementById('form');
  if (form) {
    var q = new URLSearchParams(location.search);
    if (q.get('servico')) { var s = form.querySelector('[name=servico]'); s.value = q.get('servico'); }
    if (q.get('projeto')) { form.querySelector('[name=mensagem]').value = 'Vi o projeto "' + q.get('projeto') + '" no site e quero algo nesse estilo.'; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var t = 'Olá, Luah Produção! Meu nome é ' + d.get('nome') + '.' +
        (d.get('empresa') ? '\nEmpresa/evento: ' + d.get('empresa') : '') +
        '\nPreciso de: ' + d.get('servico') +
        (d.get('data') ? '\nData/período: ' + d.get('data') : '') +
        (d.get('mensagem') ? '\nSobre o projeto: ' + d.get('mensagem') : '');
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(t), '_blank', 'noopener');
    });
  }

  // lightbox
  var phs = Array.prototype.slice.call(document.querySelectorAll('.gal button.ph'));
  if (phs.length) {
    var lb = document.createElement('div');
    lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Foto ampliada');
    lb.innerHTML = '<img alt=""><button class="x" type="button" aria-label="Fechar">✕</button><button class="pv" type="button" aria-label="Foto anterior">←</button><button class="nx" type="button" aria-label="Próxima foto">→</button><p class="cnt"></p>';
    document.body.appendChild(lb);
    var img = lb.querySelector('img'), cnt = lb.querySelector('.cnt'), i = 0, last;
    function show(n) { i = (n + phs.length) % phs.length; var s = phs[i].querySelector('img'); img.src = s.dataset.full || s.src; img.alt = s.alt; cnt.textContent = (i + 1) + ' / ' + phs.length; }
    function open(n) { last = document.activeElement; show(n); lb.classList.add('open'); document.body.style.overflow = 'hidden'; lb.querySelector('.x').focus(); }
    function close() { lb.classList.remove('open'); document.body.style.overflow = ''; if (last) last.focus(); }
    phs.forEach(function (b, n) { b.addEventListener('click', function () { open(n); }); });
    lb.querySelector('.x').addEventListener('click', close);
    lb.querySelector('.pv').addEventListener('click', function () { show(i - 1); });
    lb.querySelector('.nx').addEventListener('click', function () { show(i + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });
    var sx = 0;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); });
  }

  var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
})();

/* ===== acabamento: abertura com logo, contagem, paralaxe, cursor ===== */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.querySelector('link[href*="style.css"]').getAttribute('href').split('assets/')[0];

  // abertura com o logo (uma vez por visita)
  try {
    if (!reduce && !sessionStorage.getItem('luahIntro')) {
      sessionStorage.setItem('luahIntro', '1');
      var pl = document.createElement('div');
      pl.className = 'preload';
      pl.innerHTML = '<img src="' + root + 'assets/img/logo-gold.png" alt=""><span>Luah Produção</span><i></i>';
      document.body.appendChild(pl);
      setTimeout(function () { pl.classList.add('out'); }, 1500);
      setTimeout(function () { pl.remove(); }, 2300);
    }
  } catch (e) {}

  // contagem dos números
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, end = +el.dataset.count, t0 = null; co.unobserve(el);
        if (reduce) return;
        function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach(function (el) { co.observe(el); });
  }

  // paralaxe suave
  var par = Array.prototype.slice.call(document.querySelectorAll('[data-par], .hero-media'));
  if (par.length && !reduce) {
    var tick = false;
    function upd() { var y = window.scrollY; par.forEach(function (el) { var f = +(el.dataset.par || 0.3); el.style.transform = 'translate3d(0,' + (y * f) + 'px,0)'; }); tick = false; }
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  }

  // cursor dourado (só com mouse)
  if (window.matchMedia && window.matchMedia('(pointer: fine)').matches && !reduce) {
    var c = document.createElement('div'); c.className = 'cur'; c.innerHTML = '<span>Ver</span>'; document.body.appendChild(c);
    var x = -100, y = -100, cx = x, cy = y;
    document.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; c.classList.add('on'); });
    document.addEventListener('mouseleave', function () { c.classList.remove('on'); });
    (function loop() { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; c.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)'; requestAnimationFrame(loop); })();
    document.querySelectorAll('.card, .gal button.ph').forEach(function (el) {
      el.addEventListener('mouseenter', function () { c.classList.add('big'); });
      el.addEventListener('mouseleave', function () { c.classList.remove('big'); });
    });
    document.querySelectorAll('a, button, input, select, textarea').forEach(function (el) {
      if (el.closest('.card') || el.closest('.gal')) return;
      el.addEventListener('mouseenter', function () { c.classList.add('hov'); });
      el.addEventListener('mouseleave', function () { c.classList.remove('hov'); });
    });
  }
})();

/* ===== revisão: setas do carrossel e retorno do formulário ===== */
(function () {
  document.querySelectorAll('.rbtn').forEach(function (b) {
    b.addEventListener('click', function () {
      var r = document.querySelector('.rail'); if (!r) return;
      var card = r.querySelector('.vc'); var step = card ? card.getBoundingClientRect().width + 14 : 300;
      r.scrollBy({ left: step * 2 * (+b.dataset.dir), behavior: 'smooth' });
    });
  });
  var f = document.getElementById('form');
  if (f) f.addEventListener('submit', function () {
    var ok = f.querySelector('.form-ok'); if (ok) ok.textContent = 'Abrindo o WhatsApp com a sua mensagem…';
  });
  // lightbox: manter o foco dentro
  document.addEventListener('keydown', function (e) {
    var lb = document.querySelector('.lb.open'); if (!lb || e.key !== 'Tab') return;
    var bs = lb.querySelectorAll('button'), first = bs[0], last = bs[bs.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();

/* ===== enviar a um cliente ===== */
(function () {
  var SITE = 'https://luahproducao.github.io/Luah-Producao-Site/';
  var btns = document.querySelectorAll('.share'); if (!btns.length) return;
  var sh = document.createElement('div'); sh.className = 'sheet'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true'); sh.setAttribute('aria-label', 'Enviar a um cliente');
  sh.innerHTML = '<div class="sheet-in"><button class="sheet-x" type="button" aria-label="Fechar">✕</button><h2>Enviar a um cliente</h2><p class="sh-url"></p>' +
    '<a class="btn btn-gold sh-wa" target="_blank" rel="noopener">Enviar pelo WhatsApp</a>' +
    '<button class="btn btn-line sh-copy" type="button">Copiar link</button>' +
    '<button class="btn btn-line sh-more" type="button" hidden>Outros aplicativos</button></div>';
  document.body.appendChild(sh);
  var cur = {}, last;
  function close() { sh.classList.remove('open'); if (last) last.focus(); }
  sh.querySelector('.sheet-x').addEventListener('click', close);
  sh.addEventListener('click', function (e) { if (e.target === sh) close(); });
  sh.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  sh.querySelector('.sh-copy').addEventListener('click', function () {
    var b = this;
    (navigator.clipboard ? navigator.clipboard.writeText(cur.url) : Promise.reject()).then(function () { b.textContent = 'Link copiado ✓'; }, function () { prompt('Copie o link:', cur.url); });
    setTimeout(function () { b.textContent = 'Copiar link'; }, 2200);
  });
  var more = sh.querySelector('.sh-more');
  if (navigator.share) { more.hidden = false; more.addEventListener('click', function () { navigator.share({ title: cur.title, text: cur.text, url: cur.url }).catch(function () {}); }); }
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      last = b;
      var path = b.dataset.path || '';
      if (b.dataset.random) path = 'v' + (1 + Math.floor(Math.random() * 8)) + '/';
      cur = { url: SITE + path, title: b.dataset.title, text: 'Olá! Conheça a Luah Produção — ' + b.dataset.title.replace(' — Luah Produção', '') + ':' };
      sh.querySelector('.sh-url').textContent = cur.url;
      sh.querySelector('.sh-wa').href = 'https://wa.me/?text=' + encodeURIComponent(cur.text + ' ' + cur.url);
      sh.classList.add('open'); sh.querySelector('.sh-wa').focus();
    });
  });
})();
