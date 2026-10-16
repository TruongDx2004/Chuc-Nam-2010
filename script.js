/**
 * 20/10 HỒNG NHUNG (NẤM) — YÊU XA VIỆT NAM 🇻🇳 ✈️ ĐỨC 🇩🇪
 * Tự động đồng bộ 2 múi giờ Hà Nội - Đức, đếm ngày yêu nhau từ 08/06/2024,
 * vườn nấm hái quà, hiệu ứng nấm & hoa hồng bay lấp lánh khi chạm màn hình.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. CANVAS PARTICLES (BÀO TỬ NẤM & ÁNH HOA HỒNG)
  // ==========================================
  const canvas = document.getElementById('bg');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    const parts = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const N = reducedMotion ? 0 : 45;

    // Các màu vàng champagne, đỏ nhung, cam nấm ấm áp
    const colors = ['244,208,111', '201,54,85', '224,83,68', '247,162,180'];

    for (let i = 0; i < N; i++) {
      parts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2.2 + 0.5,
        vy: Math.random() * 0.16 + 0.05,
        vx: (Math.random() - 0.5) * 0.15,
        c: colors[Math.floor(Math.random() * colors.length)],
        o: Math.random() * 0.5 + 0.15
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.y -= p.vy;
        p.x += p.vx;
        if (p.y < -10) {
          p.y = H + 10;
          p.x = Math.random() * W;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.o})`;
        ctx.fill();
      }
      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }

  // ==========================================
  // 2. SCROLL PROGRESS
  // ==========================================
  const progress = document.getElementById('progress');
  if (progress) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const scrollTotal = h.scrollHeight - h.clientHeight;
      const pct = scrollTotal > 0 ? (h.scrollTop / scrollTotal) * 100 : 0;
      progress.style.width = pct + '%';
    });
  }

  // ==========================================
  // 3. CUSTOM CURSOR
  // ==========================================
  const cur = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');

  if (cur && dot) {
    window.addEventListener('mousemove', (e) => {
      cur.style.left = e.clientX + 'px';
      cur.style.top = e.clientY + 'px';
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    });

    const hoverTargets = 'a, button, #airmail-gate, .muse-card, .photo-item-card, .mushroom-pick-item, .hero-avatar-wrap, .sound-toggle';
    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener('mouseenter', () => cur.classList.add('big'));
      el.addEventListener('mouseleave', () => cur.classList.remove('big'));
    });
  }

  // ==========================================
  // 4. ĐỒNG HỒ 2 MÚI GIỜ SONG HÀNH (HÀ NỘI 🇻🇳 & ĐỨC 🇩🇪)
  // ==========================================
  const clockVN = document.getElementById('clockVN');
  const dateVN = document.getElementById('dateVN');
  const clockDE = document.getElementById('clockDE');
  const dateDE = document.getElementById('dateDE');

  function updateClocks() {
    const now = new Date();

    // Giờ Hà Nội (Asia/Ho_Chi_Minh)
    const optionsTimeVN = { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const optionsDateVN = { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric' };
    if (clockVN) clockVN.textContent = new Intl.DateTimeFormat('vi-VN', optionsTimeVN).format(now);
    if (dateVN) dateVN.textContent = new Intl.DateTimeFormat('vi-VN', optionsDateVN).format(now);

    // Giờ Đức (Europe/Berlin)
    const optionsTimeDE = { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const optionsDateDE = { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric' };
    if (clockDE) clockDE.textContent = new Intl.DateTimeFormat('de-DE', optionsTimeDE).format(now);
    if (dateDE) dateDE.textContent = new Intl.DateTimeFormat('vi-VN', optionsDateDE).format(now);
  }
  updateClocks();
  setInterval(updateClocks, 1000);

  // ==========================================
  // 5. BỘ ĐẾM THỜI GIAN YÊU NHAU (TỪ 08/06/2024)
  // ==========================================
  const loveStartDate = new Date('2024-06-08T00:00:00');
  const elDays = document.getElementById('loveDays');
  const elHours = document.getElementById('loveHours');
  const elMinutes = document.getElementById('loveMinutes');
  const elSeconds = document.getElementById('loveSeconds');

  function updateLoveTimer() {
    const now = new Date();
    const diff = now - loveStartDate;

    if (diff < 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (elDays) elDays.textContent = days.toLocaleString();
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMinutes) elMinutes.textContent = String(minutes).padStart(2, '0');
    if (elSeconds) elSeconds.textContent = String(seconds).padStart(2, '0');
  }
  updateLoveTimer();
  setInterval(updateLoveTimer, 1000);

  // ==========================================
  // 6. ÂM NHẠC & BỘ ĐIỀU KHIỂN
  // ==========================================
  const soundBtn = document.getElementById('soundBtn');
  const bgm = document.getElementById('bgm');
  const soundText = soundBtn ? soundBtn.querySelector('.sound-text') : null;
  let isPlaying = false;

  function updateSoundUI(playing) {
    isPlaying = playing;
    if (soundBtn) {
      if (playing) {
        soundBtn.classList.add('playing');
        if (soundText) soundText.textContent = 'Nhạc: Bật';
      } else {
        soundBtn.classList.remove('playing');
        if (soundText) soundText.textContent = 'Nhạc: Tắt';
      }
    }
  }

  function toggleMusic() {
    if (!isPlaying) {
      if (bgm) {
        bgm.play().then(() => {
          updateSoundUI(true);
        }).catch((err) => {
          console.log('Autoplay restriction:', err);
          updateSoundUI(true);
        });
      }
    } else {
      if (bgm) bgm.pause();
      updateSoundUI(false);
    }
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', toggleMusic);
  }

  window.addEventListener('keydown', (e) => {
    if ((e.key === 'm' || e.key === 'M') && document.activeElement.tagName !== 'INPUT') {
      toggleMusic();
    }
  });

  // ==========================================
  // 7. MỞ PHONG THƯ AIRMAIL (#airmail-gate)
  // ==========================================
  const gate = document.getElementById('airmail-gate');
  const main = document.getElementById('main');
  document.body.style.overflow = 'hidden';

  if (gate && main) {
    gate.addEventListener('click', (e) => {
      // Bắn chùm nấm và hoa hồng
      spawnMushroomParticles(e.clientX, e.clientY, 16, true);

      // Tự động phát nhạc khi mở phong thư
      if (!isPlaying) {
        toggleMusic();
      }

      gate.classList.add('opening');
      main.classList.add('show');

      setTimeout(() => {
        gate.classList.add('hide');
        document.body.style.overflow = 'auto';
        buildTitle();
      }, 750);
    });
  }

  // ==========================================
  // 8. TIÊU ĐỀ GÕ TỪNG KÝ TỰ (HERO TITLE)
  // ==========================================
  function buildTitle() {
    const el = document.getElementById('heroTitle');
    if (!el) return;
    const text = 'Chúc Mừng 20/10 Công Chúa Của Anh';
    el.innerHTML = text
      .split('')
      .map((c, i) => `<span style="animation-delay:${i * 42}ms">${c === ' ' ? '&nbsp;' : c}</span>`)
      .join('');
  }

  // ==========================================
  // 9. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach((el) => io.observe(el));

  // ==========================================
  // 10. VƯỜN NẤM YÊU THƯƠNG — HÁI NẤM TẶNG EM 🍄
  // ==========================================
  const mushroomMessages = [
    {
      title: "Nấm Kiên Cường 🍄",
      msg: "Tròn 1 năm em ở Đức, anh càng hiểu em mạnh mẽ và giỏi giang đến nhường nào! Một cô gái nhỏ nhắn nơi xứ người nhưng luôn kiên cường. Anh tự hào về Hồng Nhung của anh lắm!"
    },
    {
      title: "Nấm Ấm Áp 🍄✨",
      msg: "Mùa thu nước Đức trời trở lạnh rồi, ra đường em nhớ mặc thật ấm, quàng khăn len và nhớ ăn uống đầy đủ bữa, đừng bỏ bữa nhé công chúa của anh!"
    },
    {
      title: "Nấm Yêu Xa 🍄💕",
      msg: "Dù cách nhau nửa vòng trái đất ~8.500 km, Hồng Nhung vẫn là cô gái duy nhất và mãi mãi trong tim anh. Không một khoảng cách nào có thể làm vơi bớt tình thương anh dành cho em."
    },
    {
      title: "Nấm Tự Lập 🍄⭐",
      msg: "Cảm ơn em vì từ 08/06/2024 đến nay vẫn luôn kiên nhẫn yêu một người ở xa như anh. Dù đôi lúc có tủi thân, cảm ơn vì em đã luôn bao dung và chờ đợi anh."
    },
    {
      title: "Nấm Yêu Em 🍄🌹",
      msg: "20/10 thật vui vẻ, xinh đẹp và hạnh phúc nhé công chúa của anh! Dù không thể trực tiếp ôm em hôm nay, anh gửi ngàn nụ hôn và cái ôm ấm áp xuyên lục địa đến Nấm. Anh thương em nhiều lắm!"
    }
  ];

  const mushroomItems = document.querySelectorAll('.mushroom-pick-item');
  const mRevealCard = document.getElementById('mushroomReveal');
  const mRevealTitle = document.getElementById('mRevealTitle');
  const mRevealMsg = document.getElementById('mRevealMsg');

  mushroomItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      const idx = parseInt(item.getAttribute('data-index'), 10) || 0;
      const data = mushroomMessages[idx];

      // Nhún nảy nấm
      item.style.transform = 'scale(1.25) translateY(-12px)';
      setTimeout(() => {
        item.style.transform = '';
      }, 400);

      // Bắn nấm và ánh sao
      spawnMushroomParticles(e.clientX, e.clientY, 12, true);

      if (mRevealCard && mRevealTitle && mRevealMsg) {
        mRevealTitle.textContent = data.title;
        mRevealMsg.textContent = `"${data.msg}"`;
        mRevealCard.style.display = 'block';

        showToast(`Em vừa hái được: ${data.title}!`, '🍄', 3500);
      }
    });
  });

  // ==========================================
  // 11. NÚT THẢ MƯA NẤM & HOA HỒNG (SECTION WISH)
  // ==========================================
  const btnShower = document.getElementById('btnShowerMushrooms');
  if (btnShower) {
    btnShower.addEventListener('click', () => {
      triggerMushroomAndRoseShower();
    });
  }

  function triggerMushroomAndRoseShower() {
    showToast('🌹 Gửi ngàn đóa hoa hồng & nấm yêu thương đến Đức cho em! 🍄', '💌', 4500);
    if (!isPlaying) toggleMusic();

    const symbols = ['🍄', '🌹', '✨', '💖', '🍁', '🍄', '💕', '🌷', '🎀'];
    const durationMs = 6000;
    const interval = 130;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      if (elapsed > durationMs) {
        clearInterval(timer);
        return;
      }

      for (let i = 0; i < 3; i++) {
        const drop = document.createElement('div');
        drop.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        const startX = Math.random() * window.innerWidth;
        const size = Math.random() * 1.1 + 1;
        drop.style.cssText = `
          position: fixed;
          left: ${startX}px;
          top: -30px;
          font-size: ${size}rem;
          pointer-events: none;
          z-index: 99999;
          user-select: none;
          opacity: 0.95;
          filter: drop-shadow(0 0 6px rgba(244, 208, 111, 0.6));
        `;
        document.body.appendChild(drop);

        const endX = startX + (Math.random() - 0.5) * 140;
        const fallDur = 2500 + Math.random() * 1500;

        drop.animate([
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${endX - startX}px, ${window.innerHeight + 60}px) rotate(${Math.random() * 360}deg)`, opacity: 0.2 }
        ], {
          duration: fallDur,
          easing: 'linear'
        }).onfinish = () => drop.remove();
      }
    }, interval);
  }

  // ==========================================
  // 12. HIỆU ỨNG CHẠM MÀN HÌNH (MUSHROOM & ROSE PARTICLES)
  // ==========================================
  const mushroomIcons = ['🍄', '🌹', '✨', '💖', '🍄', '🍁', '💕', '🌷', '🍄✨'];

  function spawnMushroomParticles(x, y, count = 7, isBig = false) {
    if (x === undefined || y === undefined) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      const icon = mushroomIcons[Math.floor(Math.random() * mushroomIcons.length)];
      p.textContent = icon;

      const baseSize = isBig ? (Math.random() * 0.8 + 1.4) : (Math.random() * 0.5 + 0.9);
      p.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${baseSize}rem;
        pointer-events: none;
        z-index: 99999;
        user-select: none;
        transform: translate(-50%, -50%) scale(0.3);
        opacity: 1;
        filter: drop-shadow(0 0 8px rgba(244, 208, 111, 0.75));
      `;
      document.body.appendChild(p);

      const ang = Math.random() * Math.PI * 2;
      const maxDist = isBig ? (80 + Math.random() * 110) : (45 + Math.random() * 75);
      const moveX = Math.cos(ang) * maxDist;
      const moveY = Math.sin(ang) * maxDist - (isBig ? 45 : 30);
      const rot = (Math.random() - 0.5) * 80;
      const dur = (isBig ? 1100 : 800) + Math.random() * 400;

      p.animate([
        { transform: 'translate(-50%, -50%) scale(0.3) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${moveX * 0.55}px), calc(-50% + ${moveY * 0.55}px)) scale(1.3) rotate(${rot * 0.5}deg)`, opacity: 0.95, offset: 0.45 },
        { transform: `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) scale(0.6) rotate(${rot}deg)`, opacity: 0 }
      ], {
        duration: dur,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }).onfinish = () => p.remove();
    }
  }

  // Chạm/Click vào bất kỳ đâu đều bung nấm & hoa
  window.addEventListener('pointerdown', (e) => {
    spawnMushroomParticles(e.clientX, e.clientY, 7, false);
  }, { passive: true });

  // Vuốt ngón tay tạo vệt nấm bay
  let isPointerDown = false;
  let lastMoveTime = 0;
  window.addEventListener('pointerdown', () => { isPointerDown = true; }, { passive: true });
  window.addEventListener('pointerup', () => { isPointerDown = false; }, { passive: true });
  window.addEventListener('pointercancel', () => { isPointerDown = false; }, { passive: true });

  window.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const now = Date.now();
    if (now - lastMoveTime < 65) return;
    lastMoveTime = now;
    spawnMushroomParticles(e.clientX, e.clientY, 2, false);
  }, { passive: true });

  // Nhấp vào avatar để bung nấm lớn
  const avatarWrap = document.querySelector('.hero-avatar-wrap');
  if (avatarWrap) {
    avatarWrap.addEventListener('click', (e) => {
      spawnMushroomParticles(e.clientX, e.clientY, 15, true);
    });
  }

  // ==========================================
  // 13. LIGHTBOX MODAL HD
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const mediaContainer = document.getElementById('lightboxMediaContainer');
  const captionEl = document.getElementById('lightboxCaption');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev = document.getElementById('lightboxPrev');
  const btnNext = document.getElementById('lightboxNext');

  const mediaItems = [];
  document.querySelectorAll('[data-src]').forEach((el) => {
    mediaItems.push({
      src: el.getAttribute('data-src'),
      caption: el.getAttribute('data-caption') || ''
    });
  });

  let currentIndex = 0;

  function renderLightboxItem(index) {
    if (index < 0 || index >= mediaItems.length) return;
    currentIndex = index;
    const item = mediaItems[index];

    mediaContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption;
    img.className = 'lightbox-img';
    mediaContainer.appendChild(img);

    if (captionEl) {
      captionEl.innerHTML = `🍄 ${item.caption} <span style="font-size:0.8em;opacity:0.6;margin-left:8px;">(${index + 1}/${mediaItems.length})</span>`;
    }
  }

  function openLightbox(index) {
    if (!lightbox) return;
    renderLightboxItem(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
    mediaContainer.innerHTML = '';
  }

  function nextItem() {
    let nextIdx = (currentIndex + 1) % mediaItems.length;
    renderLightboxItem(nextIdx);
  }

  function prevItem() {
    let prevIdx = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    renderLightboxItem(prevIdx);
  }

  document.querySelectorAll('[data-src]').forEach((el) => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-src');
      const idx = mediaItems.findIndex((it) => it.src === src);
      if (idx !== -1) openLightbox(idx);
    });
  });

  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (btnNext) btnNext.addEventListener('click', nextItem);
  if (btnPrev) btnPrev.addEventListener('click', prevItem);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === mediaContainer) {
        closeLightbox();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextItem();
    if (e.key === 'ArrowLeft') prevItem();
  });

  // Vuốt chạm trên điện thoại
  let touchStartX = 0;
  let touchEndX = 0;
  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (Math.abs(touchEndX - touchStartX) > 45) {
        if (touchEndX < touchStartX) nextItem();
        else prevItem();
      }
    }, { passive: true });
  }

  // ==========================================
  // 14. TOAST NOTIFICATION
  // ==========================================
  const sweetToast = document.getElementById('sweetToast');
  let toastTimer = null;
  function showToast(message, icon = '🍄', duration = 3500) {
    if (!sweetToast) return;
    if (toastTimer) clearTimeout(toastTimer);
    sweetToast.innerHTML = `<span style="font-size:1.3rem;">${icon}</span> <span>${message}</span>`;
    sweetToast.classList.add('active');
    toastTimer = setTimeout(() => {
      sweetToast.classList.remove('active');
    }, duration);
  }
});
