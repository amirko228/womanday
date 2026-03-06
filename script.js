document.addEventListener('DOMContentLoaded', () => {
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  const card = document.getElementById('greeting-card');
  const cardScreen = document.getElementById('card-screen');
  const mainContent = document.getElementById('main-content');
  const cardHearts = document.getElementById('card-hearts');

  // ===== ОТКРЫТИЕ КОНВЕРТА =====
  function openCard() {
    if (!card) return;
    card.style.pointerEvents = 'none';

    const flap = card.querySelector('.card-env-flap') || card.querySelector('.envelope-flap');
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2 - 30;

    gsap.to(flap, {
      rotateX: -110,
      duration: 2.5,
      ease: 'power2.inOut',
      transformOrigin: 'top center',
      force3D: true,
      onComplete: () => {
        const heartSvg = '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
        const colors = ['#ea80b0', '#e8b4bc', '#f5c4d8', '#d4a5a5', '#fce4ec'];

        for (let i = 0; i < 30; i++) {
          const h = document.createElement('div');
          h.innerHTML = heartSvg;
          const size = 24 + Math.random() * 28;
          h.style.cssText = `position:fixed;left:${centerX}px;top:${centerY}px;width:${size}px;height:${size}px;pointer-events:none;transform:translate(-50%,-50%);filter:drop-shadow(0 0 10px rgba(234,128,176,0.6));z-index:9999;`;
          h.querySelector('path').setAttribute('fill', colors[i % colors.length]);
          cardHearts.appendChild(h);

          const angle = (i / 30) * 360 + Math.random() * 60;
          const dist = 150 + Math.random() * 150;
          const tx = Math.cos(angle * Math.PI / 180) * dist;
          const ty = Math.sin(angle * Math.PI / 180) * dist - 100;

          gsap.fromTo(h,
            { scale: 0, opacity: 1 },
            { scale: 1, opacity: 0, x: tx, y: ty, duration: 1.4, delay: i * 0.03, ease: 'power2.out', onComplete: () => h.remove() }
          );
        }

        gsap.to(cardScreen, {
          opacity: 0,
          duration: 1.2,
          delay: 1.8,
          onComplete: () => {
            cardScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
            initMainPage();
          }
        });
      }
    });
  }

  card.addEventListener('click', openCard);
  document.querySelector('.card-hint')?.addEventListener('click', openCard);

  // ===== ГЛАВНАЯ =====
  function initMainPage() {
    createPetals();
    createDecoFlowers();
    animateGreeting();
    animateFlowers();
    initScrollAnimations();
    initCongratsButton();
    initInteractivity();
    initParallax();
  }

  // Падающие лепестки
  function createPetals() {
    const container = document.getElementById('petals');
    const colors = ['#f5c4d8', '#ea80b0', '#e8b4bc', '#fce4ec'];
    const isNarrow = window.innerWidth < 500;
    const xRange = isNarrow ? 40 : 250;
    const count = isNarrow ? 18 : 30;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      p.style.left = (10 + Math.random() * 80) + '%';
      p.style.top = '-30px';
      p.style.background = `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`;
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(p);

      gsap.to(p, {
        y: window.innerHeight + 50,
        x: (Math.random() - 0.5) * xRange,
        rotation: Math.random() * 360,
        duration: 12 + Math.random() * 10,
        repeat: -1,
        ease: 'none',
        delay: Math.random() * 8
      });
    }
  }

  // Декоративные цветы — больше, разнообразнее, детальнее
  function createDecoFlowers() {
    const container = document.querySelector('.deco-flowers');
    const positions = [
      { left: '15%', top: '12%', size: 72 }, { left: '82%', top: '18%', size: 58 },
      { left: '18%', top: '72%', size: 65 }, { left: '80%', top: '68%', size: 70 },
      { left: '48%', top: '3%', size: 55 }, { left: '18%', top: '42%', size: 48 },
      { left: '80%', top: '48%', size: 62 }, { left: '25%', top: '88%', size: 45 },
      { left: '75%', top: '85%', size: 52 }
    ];

    const flowerTemplates = [
      (id) => `<svg viewBox="0 0 60 60"><defs><linearGradient id="${id}" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="#ea80b0"/><stop offset="100%" stop-color="#fce4ec"/></linearGradient></defs><circle cx="30" cy="30" r="6" fill="#fce4ec"/><ellipse cx="30" cy="14" rx="9" ry="13" fill="url(#${id})" transform="rotate(0 30 30)"/><ellipse cx="30" cy="14" rx="9" ry="13" fill="url(#${id})" transform="rotate(60 30 30)"/><ellipse cx="30" cy="14" rx="9" ry="13" fill="url(#${id})" transform="rotate(120 30 30)"/><ellipse cx="30" cy="14" rx="9" ry="13" fill="url(#${id})" transform="rotate(180 30 30)"/><ellipse cx="30" cy="14" rx="9" ry="13" fill="url(#${id})" transform="rotate(240 30 30)"/><ellipse cx="30" cy="14" rx="9" ry="13" fill="url(#${id})" transform="rotate(300 30 30)"/></svg>`,
      (id) => `<svg viewBox="0 0 60 60"><defs><linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f5c4d8"/><stop offset="100%" stop-color="#ea80b0"/></linearGradient></defs><circle cx="30" cy="30" r="6" fill="#fce4ec"/><circle cx="30" cy="16" r="10" fill="url(#${id})"/><circle cx="45" cy="24" r="10" fill="url(#${id})"/><circle cx="45" cy="40" r="10" fill="url(#${id})"/><circle cx="30" cy="48" r="10" fill="url(#${id})"/><circle cx="15" cy="40" r="10" fill="url(#${id})"/><circle cx="15" cy="24" r="10" fill="url(#${id})"/></svg>`,
      (id) => `<svg viewBox="0 0 60 60"><defs><linearGradient id="${id}" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="#e8b4bc"/><stop offset="100%" stop-color="#fce4ec"/></linearGradient></defs><circle cx="30" cy="30" r="7" fill="#fff"/><ellipse cx="30" cy="12" rx="11" ry="15" fill="url(#${id})" transform="rotate(0 30 30)"/><ellipse cx="30" cy="12" rx="11" ry="15" fill="url(#${id})" transform="rotate(72 30 30)"/><ellipse cx="30" cy="12" rx="11" ry="15" fill="url(#${id})" transform="rotate(144 30 30)"/><ellipse cx="30" cy="12" rx="11" ry="15" fill="url(#${id})" transform="rotate(216 30 30)"/><ellipse cx="30" cy="12" rx="11" ry="15" fill="url(#${id})" transform="rotate(288 30 30)"/></svg>`
    ];

    positions.forEach((pos, i) => {
      const f = document.createElement('div');
      f.className = 'deco-flower';
      f.style.left = pos.left;
      f.style.top = pos.top;
      f.style.width = pos.size + 'px';
      f.style.height = pos.size + 'px';
      f.style.animationDelay = i * 1.5 + 's';
      const gradId = 'deco-grad-' + i;
      f.innerHTML = flowerTemplates[i % flowerTemplates.length](gradId);
      container.appendChild(f);
    });
  }

  // Рисующееся поздравление
  function animateGreeting() {
    const text1 = document.getElementById('greeting-text');
    const text2 = document.getElementById('greeting-name');
    if (!text1) return;

    text1.style.strokeDasharray = '600';
    text1.style.strokeDashoffset = '600';
    if (text2) {
      text2.style.strokeDasharray = '400';
      text2.style.strokeDashoffset = '400';
    }

    gsap.to(text1, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' });
    if (text2) gsap.to(text2, { strokeDashoffset: 0, duration: 1.5, delay: 0.8, ease: 'power2.inOut' });
  }

  // Цветы — анимация через CSS (grow-flower-stem + blooming-flower)
  function animateFlowers() {
    // Анимации заданы в CSS, ничего не делаем
  }

  // Скролл анимации
  function initScrollAnimations() {
    const cards = document.querySelectorAll('[data-card]');
    const reveals = document.querySelectorAll('[data-reveal]');
    const photos = document.querySelectorAll('[data-photo]');
    const wishItems = document.querySelectorAll('.wish-item');
    const finalContent = document.querySelector('.final-card') || document.querySelector('.final-content');
    const sectionTitles = document.querySelectorAll('.section-title');

    sectionTitles.forEach(title => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: title,
          start: 'top 90%',
          onEnter: () => gsap.fromTo(title, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' })
        });
      }
    });

    cards.forEach((el, i) => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          onEnter: () => {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.6, delay: i * 0.1, ease: 'power2.out' });
            el.classList.add('visible');
          }
        });
      } else el.classList.add('visible');
    });

    reveals.forEach(el => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
            el.classList.add('visible');
          }
        });
      } else el.classList.add('visible');
    });

    // Конверт истории: закрытый → клик открывает → кнопка «Потяни» вытягивает записку
    const storyEnv = document.getElementById('story-envelope');
    const storyWrapper = storyEnv?.querySelector('.story-env-wrapper');
    const storyPullBtn = document.getElementById('story-pull-btn');

    if (storyWrapper) {
      storyWrapper.addEventListener('click', () => {
        if (!storyEnv.classList.contains('flap-open')) {
          storyEnv.classList.add('flap-open');
        }
      });
    }
    if (storyPullBtn) {
      storyPullBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        storyEnv?.classList.add('note-out');
      });
    }

    photos.forEach((el, i) => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          onEnter: () => {
            gsap.to(el, { opacity: 1, duration: 0.6, delay: i * 0.08, ease: 'power2.out' });
            el.classList.add('visible');
          }
        });
      } else el.classList.add('visible');
    });

    wishItems.forEach((el, i) => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          onEnter: () => {
            gsap.to(el, { opacity: 1, scale: 1, duration: 0.5, delay: i * 0.06, ease: 'back.out(1.4)' });
            el.classList.add('visible');
          }
        });
      } else el.classList.add('visible');
    });

    if (finalContent && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: finalContent,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(finalContent, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
          finalContent.classList.add('visible');
        }
      });
    }
  }

  // Кнопка Поздравляю
  let congratsTimeoutId = null;
  function initCongratsButton() {
    const btn = document.getElementById('congrats-btn');
    const modal = document.getElementById('congrats-page');
    const heartsContainer = document.getElementById('congrats-hearts');
    const confettiContainer = document.getElementById('congrats-confetti');
    const msgDisplay = document.getElementById('congrats-msg-display');
    const congratsTexts = ['Счастья, здоровья и любви!', 'Пусть сбываются все мечты!', 'Вдохновения и новых побед!', 'Тепла, уюта и прекрасных моментов!', 'Ты — самая лучшая!', 'С 8 марта, любимая!'];
    const closeBtn = document.querySelector('.close-modal');

    if (!btn || !modal) return;

    function showModal() {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      heartsContainer.innerHTML = '';
      confettiContainer.innerHTML = '';

      // Конфетти
      const confettiColors = ['#ea80b0', '#f5c4d8', '#e8b4bc', '#d4af37', '#fce4ec'];
      for (let i = 0; i < 60; i++) {
        const c = document.createElement('div');
        c.style.cssText = `position:absolute;width:${8 + Math.random() * 8}px;height:${8 + Math.random() * 8}px;background:${confettiColors[i % confettiColors.length]};left:${Math.random() * 100}%;top:-20px;border-radius:${Math.random() > 0.5 ? '50%' : '0'};pointer-events:none;z-index:1;`;
        confettiContainer.appendChild(c);
        gsap.to(c, {
          y: window.innerHeight + 50,
          x: (Math.random() - 0.5) * 200,
          rotation: Math.random() * 720,
          duration: 3 + Math.random() * 2,
          ease: 'power2.in',
          onComplete: () => c.remove()
        });
      }

      // Сердечки
      const heartSvg = '<svg viewBox="0 0 24 24"><path fill="#ea80b0" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
      for (let i = 0; i < 25; i++) {
        const h = document.createElement('div');
        h.innerHTML = heartSvg;
        const size = 24 + Math.random() * 36;
        h.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${50 + Math.random() * 40}%;pointer-events:none;z-index:1;opacity:0;filter:drop-shadow(0 0 10px rgba(234,128,176,0.5));`;
        h.querySelector('svg').style.width = '100%';
        h.querySelector('svg').style.height = '100%';
        heartsContainer.appendChild(h);
        gsap.to(h, { opacity: 1, scale: 1.4, duration: 0.5, ease: 'power2.out' });
        gsap.to(h, { y: -200, opacity: 0, duration: 2.5, delay: 0.3, ease: 'power1.in', onComplete: () => h.remove() });
      }

      // Поздравления по очереди — каждое один раз
      let idx = 0;
      const showNext = () => {
        if (idx >= congratsTexts.length || !msgDisplay) return;
        msgDisplay.textContent = congratsTexts[idx];
        gsap.fromTo(msgDisplay, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' });
        idx++;
        if (idx < congratsTexts.length) congratsTimeoutId = setTimeout(showNext, 2200);
      };
      if (congratsTimeoutId) clearTimeout(congratsTimeoutId);
      showNext();
    }

    function hideModal() {
      if (congratsTimeoutId) clearTimeout(congratsTimeoutId);
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', showModal);
    if (closeBtn) closeBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => { if (!e.target.closest('.congrats-card')) hideModal(); });
  }

  // ===== ИНТЕРАКТИВНОСТЬ — кликабельные элементы =====
  function spawnHearts(x, y, count = 5) {
    const container = document.getElementById('petals') || document.body;
    const heartSvg = '<svg viewBox="0 0 24 24"><path fill="#ea80b0" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
    for (let i = 0; i < count; i++) {
      const h = document.createElement('div');
      h.innerHTML = heartSvg;
      h.style.cssText = `position:fixed;width:${20 + Math.random() * 16}px;height:${20 + Math.random() * 16}px;left:${x}px;top:${y}px;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);`;
      document.body.appendChild(h);
      gsap.to(h, {
        y: -80 - Math.random() * 60,
        x: (Math.random() - 0.5) * 80,
        opacity: 0,
        scale: 1.2,
        duration: 1.2,
        ease: 'power2.out',
        onComplete: () => h.remove()
      });
    }
  }

  function initInteractivity() {
    // Цветы — клик = сердечки
    document.querySelectorAll('[data-click-flower]').forEach(el => {
      el.addEventListener('click', (e) => {
        spawnHearts(e.clientX, e.clientY, 6);
        gsap.to(el, { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1 });
      });
    });

    // Комплименты — клик = сердечки
    document.querySelectorAll('[data-click-card]').forEach(el => {
      el.addEventListener('click', (e) => {
        const rect = el.getBoundingClientRect();
        spawnHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 4);
      });
    });

    // Пожелания — клик = сердечки + анимация
    document.querySelectorAll('[data-click-wish]').forEach(el => {
      el.addEventListener('click', (e) => {
        const rect = el.getBoundingClientRect();
        spawnHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 5);
        gsap.to(el, { scale: 1.15, duration: 0.2, yoyo: true, repeat: 1 });
      });
    });

    // Фото — клик = сердечки
    document.querySelectorAll('[data-click-photo]').forEach(el => {
      el.addEventListener('click', (e) => {
        spawnHearts(e.clientX, e.clientY, 5);
      });
    });

    // Hero — клик по области = сердечки
    const heroArea = document.querySelector('[data-click-hero]');
    if (heroArea) {
      heroArea.style.cursor = 'pointer';
      heroArea.addEventListener('click', (e) => {
        if (!e.target.closest('[data-click-flower]')) {
          spawnHearts(e.clientX, e.clientY, 4);
        }
      });
    }

    // Декоративные цветы — кликабельные
    document.getElementById('deco-flowers')?.addEventListener('click', (e) => {
      const target = e.target.closest('.deco-flower');
      if (target) {
        const rect = target.getBoundingClientRect();
        spawnHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 3);
      }
    });

    // Приветствие — клик = сердечки + пульс
    const greeting = document.getElementById('drawn-greeting');
    if (greeting) {
      greeting.style.cursor = 'pointer';
      greeting.addEventListener('click', () => {
        const rect = greeting.getBoundingClientRect();
        spawnHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
        gsap.fromTo(greeting, { scale: 1.05 }, { scale: 1, duration: 0.6, ease: 'back.out(1.5)' });
      });
    }

  }

  // Конверт на начальном экране — hover
  if (card) {
    card.addEventListener('mouseenter', () => {
      if (cardScreen && !cardScreen.classList.contains('hidden')) {
        gsap.to(card, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
      }
    });
    card.addEventListener('mouseleave', () => gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' }));
  }

  // Параллакс при скролле
  function initParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroFlowers = document.querySelector('.hero-flowers');
    if (!hero || !heroContent || typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(heroContent, { y: progress * 40 });
        gsap.set(heroFlowers, { y: progress * 25 });
      }
    });
  }
});
