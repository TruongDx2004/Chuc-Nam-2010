/**
 * HANA BIRTHDAY - INTERACTIVE JAVASCRIPT
 * Tích hợp âm thanh, video player mượt mà, bộ đếm ngày yêu nhau từ 08/05/2023,
 * bộ sưu tập ảnh Polaroid/Grid và Lightbox HD có Next/Prev.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. AMBIENT PARTICLES (CANVAS BACKGROUND)
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

    for (let i = 0; i < N; i++) {
      parts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2.2 + 0.4,
        vy: Math.random() * 0.18 + 0.05,
        vx: (Math.random() - 0.5) * 0.15,
        c: Math.random() > 0.5 ? '127,214,184' : '232,138,160',
        o: Math.random() * 0.45 + 0.15
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

    const hoverTargets = 'a, button, .h22, #gate, .polaroid-card, .media-card, input, .hero-avatar, .sound-toggle, .filter-btn';
    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener('mouseenter', () => cur.classList.add('big'));
      el.addEventListener('mouseleave', () => cur.classList.remove('big'));
    });
  }

  // ==========================================
  // 4. BỘ ĐẾM THỜI GIAN YÊU NHAU (TỪ 08/05/2023)
  // ==========================================
  const loveStartDate = new Date('2023-05-08T00:00:00');
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
  // 5. ÂM NHẠC & XỬ LÝ BACKGROUND MUSIC
  // ==========================================
  const soundBtn = document.getElementById('soundBtn');
  const bgm = document.getElementById('bgm');
  const soundText = soundBtn ? soundBtn.querySelector('.sound-text') : null;
  let isPlaying = false;
  let synthActive = false;
  let audioCtx = null;
  let synthInterval = null;
  let wasPlayingBeforeVideo = false;

  function playMusicBoxFallback() {
    if (synthActive) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      synthActive = true;
      const notes = [
        { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.8 }, { f: 261.63, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 329.63, d: 1.4 },
        { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.8 }, { f: 261.63, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 349.23, d: 1.4 },
        { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 523.25, d: 0.8 }, { f: 440.00, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 329.63, d: 0.8 }, { f: 293.66, d: 1.2 },
        { f: 466.16, d: 0.4 }, { f: 466.16, d: 0.4 }, { f: 440.00, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 349.23, d: 1.8 }
      ];

      function playChime(freq, duration) {
        if (!synthActive || !audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.8);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration * 1.8);
      }

      function scheduleLoop() {
        let delay = 0;
        notes.forEach((n) => {
          setTimeout(() => {
            if (synthActive) playChime(n.f, n.d);
          }, delay * 1000);
          delay += n.d * 0.72;
        });

        synthInterval = setTimeout(() => {
          if (synthActive) scheduleLoop();
        }, (delay + 1.2) * 1000);
      }

      scheduleLoop();
    } catch (err) {
      console.warn('Web Audio Fallback not supported:', err);
    }
  }

  function stopMusicBoxFallback() {
    synthActive = false;
    if (synthInterval) {
      clearTimeout(synthInterval);
      synthInterval = null;
    }
    if (audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend();
    }
  }

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
        const playPromise = bgm.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            updateSoundUI(true);
          }).catch((err) => {
            console.log('Audio file play failed, fallback to synth:', err);
            playMusicBoxFallback();
            updateSoundUI(true);
          });
        } else {
          updateSoundUI(true);
        }
      } else {
        playMusicBoxFallback();
        updateSoundUI(true);
      }
    } else {
      if (bgm) bgm.pause();
      stopMusicBoxFallback();
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
  // 6. CỔNG MỞ ĐẦU (#GATE) & TỰ ĐỘNG PHÁT NHẠC
  // ==========================================
  const gate = document.getElementById('gate');
  const main = document.getElementById('main');
  document.body.style.overflow = 'hidden';

  if (gate && main) {
    gate.addEventListener('click', () => {
      if (!isPlaying) {
        toggleMusic();
      }

      gate.classList.add('opening');
      main.classList.add('show');

      setTimeout(() => {
        gate.classList.add('hide');
        document.body.style.overflow = 'auto';
        buildTitle();
      }, 700);
    });
  }

  // ==========================================
  // 7. TIÊU ĐỀ GÕ TỪNG KÝ TỰ (HERO TITLE)
  // ==========================================
  function buildTitle() {
    const el = document.getElementById('heroTitle');
    if (!el) return;
    const text = 'Chúc Mừng Sinh Nhật Hana';
    el.innerHTML = text
      .split('')
      .map((c, i) => `<span style="animation-delay:${i * 40}ms">${c === ' ' ? '&nbsp;' : c}</span>`)
      .join('');
  }

  // ==========================================
  // 8. SCROLL REVEAL (INTERSECTION OBSERVER)
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
  // 9. VIDEO PREVIEW TRÊN CARD (HOVER / SCROLL)
  // ==========================================
  const cardVideos = document.querySelectorAll('.media-card-video');
  cardVideos.forEach((vid) => {
    const card = vid.closest('.media-card');
    if (card) {
      card.addEventListener('mouseenter', () => {
        vid.play().catch(() => {});
      });
      card.addEventListener('mouseleave', () => {
        vid.pause();
      });
    }
  });

  // Tự động phát preview nhẹ nhàng khi cuộn tới trên điện thoại
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const vid = entry.target;
      if (entry.isIntersecting) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, { threshold: 0.6 });

  cardVideos.forEach((vid) => videoObserver.observe(vid));

  // ==========================================
  // 10. BỘ LỌC TABS (ALL / PHOTO / VIDEO)
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const togetherCards = document.querySelectorAll('#together-section .media-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      togetherCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ==========================================
  // 11. LIGHTBOX MODAL CHO ẢNH & VIDEO (HD)
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const mediaContainer = document.getElementById('lightboxMediaContainer');
  const captionEl = document.getElementById('lightboxCaption');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev = document.getElementById('lightboxPrev');
  const btnNext = document.getElementById('lightboxNext');

  // Thu thập danh sách tất cả các item có thể mở xem
  const mediaItems = [];
  document.querySelectorAll('[data-src]').forEach((el) => {
    mediaItems.push({
      type: el.getAttribute('data-media-type') || 'image',
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

    if (item.type === 'video') {
      // Khi phát video trong lightbox, tạm dừng nhạc nền để nghe rõ âm thanh
      if (isPlaying) {
        wasPlayingBeforeVideo = true;
        if (bgm) bgm.pause();
        stopMusicBoxFallback();
      }

      const video = document.createElement('video');
      video.src = item.src;
      video.className = 'lightbox-video';
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      mediaContainer.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.caption;
      img.className = 'lightbox-img';
      mediaContainer.appendChild(img);
    }

    if (captionEl) {
      captionEl.innerHTML = `${item.caption} <span style="font-size:0.8em;opacity:0.6;margin-left:8px;">(${index + 1}/${mediaItems.length})</span>`;
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

    // Dừng video nếu đang phát
    const currentVideo = mediaContainer.querySelector('video');
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.src = '';
    }
    mediaContainer.innerHTML = '';

    // Khôi phục nhạc nền nếu trước đó đang bật
    if (wasPlayingBeforeVideo) {
      wasPlayingBeforeVideo = false;
      if (bgm) {
        bgm.play().then(() => updateSoundUI(true)).catch(() => {});
      } else {
        playMusicBoxFallback();
        updateSoundUI(true);
      }
    }
  }

  function nextItem() {
    let nextIdx = (currentIndex + 1) % mediaItems.length;
    renderLightboxItem(nextIdx);
  }

  function prevItem() {
    let prevIdx = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    renderLightboxItem(prevIdx);
  }

  // Gán sự kiện click cho tất cả các phần tử có data-src
  document.querySelectorAll('[data-src]').forEach((el) => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-src');
      const idx = mediaItems.findIndex((it) => it.src === src);
      if (idx !== -1) openLightbox(idx);
    });
  });

  const heroAvatar = document.querySelector('.hero-avatar');
  if (heroAvatar) {
    heroAvatar.addEventListener('click', () => {
      const idx = mediaItems.findIndex((it) => it.src.includes('hana.jpg'));
      openLightbox(idx !== -1 ? idx : 0);
    });
  }

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

  // Điều hướng bằng bàn phím
  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextItem();
    if (e.key === 'ArrowLeft') prevItem();
  });

  // Hỗ trợ vuốt cảm ứng trên điện thoại cho Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff < 0) nextItem(); // Vuốt sang trái -> Xem tiếp
      else prevItem();         // Vuốt sang phải -> Xem lùi
    }
  }

  // ==========================================
  // 12. HIỆU ỨNG TRÁI TIM KHI CHẠM MÀN HÌNH & SỐ 22
  // ==========================================
  const heartIcons = ['💖', '💕', '💗', '✨', '🌸', '🌷', '❤️'];

  function spawnHearts(x, y, count = 7, isBig = false) {
    if (x === undefined || y === undefined) return;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      const icon = heartIcons[Math.floor(Math.random() * heartIcons.length)];
      heart.textContent = icon;

      const baseSize = isBig ? (Math.random() * 0.8 + 1.4) : (Math.random() * 0.5 + 0.9);
      heart.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${baseSize}rem;
        pointer-events: none;
        z-index: 99999;
        user-select: none;
        transform: translate(-50%, -50%) scale(0.3);
        opacity: 1;
        filter: drop-shadow(0 0 8px rgba(232, 138, 160, 0.75));
      `;
      document.body.appendChild(heart);

      const ang = Math.random() * Math.PI * 2;
      const maxDist = isBig ? (80 + Math.random() * 110) : (45 + Math.random() * 75);
      const moveX = Math.cos(ang) * maxDist;
      const moveY = Math.sin(ang) * maxDist - (isBig ? 45 : 30);
      const rot = (Math.random() - 0.5) * 80;
      const dur = (isBig ? 1100 : 800) + Math.random() * 400;

      heart.animate([
        { transform: 'translate(-50%, -50%) scale(0.3) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${moveX * 0.55}px), calc(-50% + ${moveY * 0.55}px)) scale(1.3) rotate(${rot * 0.5}deg)`, opacity: 0.95, offset: 0.45 },
        { transform: `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) scale(0.6) rotate(${rot}deg)`, opacity: 0 }
      ], {
        duration: dur,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }).onfinish = () => heart.remove();
    }
  }

  // Chạm/Click vào bất kỳ đâu trên màn hình đều bung nở trái tim
  window.addEventListener('pointerdown', (e) => {
    // Tránh bắn trùng nếu click đúng số 22
    if (e.target && (e.target.id === 'h22' || e.target.closest('#h22'))) return;
    spawnHearts(e.clientX, e.clientY, 7, false);
  }, { passive: true });

  // Vệt tim bay lướt theo ngón tay/chuột khi vuốt màn hình
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
    spawnHearts(e.clientX, e.clientY, 2, false);
  }, { passive: true });

  // Khi bấm vào số 22: Hiệu ứng bùng nổ tim đặc biệt lớn
  const h22 = document.getElementById('h22');
  if (h22) {
    h22.addEventListener('click', (e) => {
      const isEnlarged = h22.style.transform === 'scale(1.4)';
      h22.style.transform = isEnlarged ? 'scale(1)' : 'scale(1.4)';
      spawnHearts(e.clientX, e.clientY, 18, true);
    });
  }

  // Khi bấm vào số 22 ở cổng mở đầu #gate
  const gateBlobNum = document.querySelector('#gate .blob .num');
  if (gateBlobNum) {
    gateBlobNum.addEventListener('click', (e) => {
      spawnHearts(e.clientX, e.clientY, 15, true);
    });
  }

  // ==========================================
  // 13. CÂU ĐỐ TÊN HANA (PUZZLE)
  // ==========================================
  const pInput = document.getElementById('puzzleInput');
  const pReveal = document.getElementById('puzzleReveal');

  if (pInput && pReveal) {
    pInput.addEventListener('input', () => {
      const val = pInput.value.trim().toLowerCase();
      if (val === 'hana') {
        pReveal.classList.add('open');
        pInput.style.borderColor = '#e88aa0';

        const rect = pInput.getBoundingClientRect();
        for (let i = 0; i < 14; i++) {
          const spark = document.createElement('div');
          spark.textContent = '✨';
          spark.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top}px;font-size:1rem;pointer-events:none;z-index:9999;`;
          document.body.appendChild(spark);
          const ang = Math.random() * Math.PI * 2;
          const dist = 60 + Math.random() * 80;
          spark.animate([
            { transform: 'translate(0,0) scale(0.5)', opacity: 1 },
            { transform: `translate(${Math.cos(ang) * dist}px,${Math.sin(ang) * dist}px) scale(1.3)`, opacity: 0 }
          ], {
            duration: 1100,
            easing: 'cubic-bezier(.22,.9,.32,1)'
          }).onfinish = () => spark.remove();
        }
      }
    });
  }

  // ==========================================
  // 14. ĐẾM NGƯỢC ĐẾN NGÀY 19.10
  // ==========================================
  function updateCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    const now = new Date();
    const curYear = now.getFullYear();
    let nextBday = new Date(curYear, 9, 19);

    const today = new Date(curYear, now.getMonth(), now.getDate());
    const isToday = (now.getMonth() === 9 && now.getDate() === 19);

    if (isToday) {
      countdownEl.innerHTML = '✦ Hôm nay chính là ngày đặc biệt ấy — Chúc mừng sinh nhật Hana! ✦';
      return;
    }

    if (nextBday < today) {
      nextBday = new Date(curYear + 1, 9, 19);
    }

    const diffDays = Math.ceil((nextBday - today) / (1000 * 60 * 60 * 24));
    countdownEl.textContent = `còn ${diffDays} ngày nữa đến sinh nhật em (19.10)`;
  }
  updateCountdown();

  // ==========================================
  // 15. NÚT THẢ CÁNH HOA YÊU THƯƠNG
  // ==========================================
  const petalBtn = document.getElementById('petalBtn');
  if (petalBtn) {
    petalBtn.addEventListener('click', (e) => {
      const colors = ['#7fd6b8', '#e88aa0', '#f7d3da', '#f7f2e8', '#ffd1dc'];
      const count = 28;

      for (let i = 0; i < count; i++) {
        const petal = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 6;

        petal.style.cssText = `
          position: fixed;
          left: ${e.clientX}px;
          top: ${e.clientY}px;
          width: ${size}px;
          height: ${size * 1.5}px;
          border-radius: 50% 50% 50% 0;
          background: ${color};
          pointer-events: none;
          z-index: 9998;
          opacity: 0.95;
          box-shadow: 0 0 6px ${color};
        `;
        document.body.appendChild(petal);

        const ang = Math.random() * Math.PI * 2;
        const dist = 80 + Math.random() * 150;
        const rotate = Math.random() * 720 - 360;

        petal.animate([
          { transform: 'translate(0, 0) rotate(0deg) scale(0.6)', opacity: 1 },
          { transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist - 80}px) rotate(${rotate}deg) scale(1)`, opacity: 0 }
        ], {
          duration: 1300 + Math.random() * 500,
          easing: 'cubic-bezier(.22,.9,.32,1)'
        }).onfinish = () => petal.remove();
      }
    });
  }

  // ==========================================
  // 16. SWEET TOAST NOTIFICATION (THÔNG BÁO NGỌT NGÀO)
  // ==========================================
  const sweetToast = document.getElementById('sweetToast');
  let toastTimer = null;
  function showToast(message, icon = '💌', duration = 3500) {
    if (!sweetToast) return;
    if (toastTimer) clearTimeout(toastTimer);
    sweetToast.innerHTML = `<span style="font-size:1.3rem;">${icon}</span> <span>${message}</span>`;
    sweetToast.classList.add('active');
    toastTimer = setTimeout(() => {
      sweetToast.classList.remove('active');
    }, duration);
  }

  // ==========================================
  // 17. TRÒ CHƠI THA THỨ TINH NGHỊCH (RUN-AWAY BUTTON)
  // ==========================================
  const btnNo = document.getElementById('btnForgiveNo');
  const btnYes = document.getElementById('btnForgiveYes');
  const forgiveArea = document.getElementById('forgiveArea');
  const forgiveTaunt = document.getElementById('forgiveTaunt');
  let noAttempts = 0;

  const tauntMessages = [
    'Ơ kìa bấm trượt rồi hihi :P',
    'Nút bên kia to đùng sao hông bấm em ơi! 😆',
    'Anh biết lỗi rồi màaaa tha cho anh điii 🥺',
    'Lêu lêu bấm hông đượcc đố bắt được anh! 😜',
    'Đừng cố nữa em ơi, số trời đã định là phải tha thứ rồi! 💖'
  ];

  function dodgeButton() {
    if (!btnNo || !forgiveArea) return;
    noAttempts++;

    if (noAttempts >= 5) {
      btnNo.textContent = 'Thực ra là yêu anh chết đi được ❤️';
      btnNo.style.transform = 'none';
      btnNo.style.background = 'linear-gradient(135deg, #a84a63, #e88aa0)';
      btnNo.style.color = '#fff';
      btnNo.style.borderColor = '#e88aa0';
      if (forgiveTaunt) forgiveTaunt.textContent = 'Biết ngay mà, làm sao mà không tha thứ cho anh được hihi 🥰';
      btnNo.onclick = () => {
        acceptForgiveness(true);
      };
      return;
    }

    const areaRect = forgiveArea.getBoundingClientRect();
    const maxMoveX = Math.min(130, areaRect.width / 2);
    const maxMoveY = 50;

    const randX = (Math.random() - 0.5) * maxMoveX * 2;
    const randY = (Math.random() - 0.5) * maxMoveY * 2;

    btnNo.style.transform = `translate(${randX}px, ${randY}px)`;
    if (forgiveTaunt) {
      forgiveTaunt.textContent = tauntMessages[(noAttempts - 1) % tauntMessages.length];
    }
  }

  if (btnNo) {
    btnNo.addEventListener('mouseenter', dodgeButton);
    btnNo.addEventListener('touchstart', (e) => {
      if (noAttempts < 5) {
        e.preventDefault();
        dodgeButton();
      }
    }, { passive: false });
  }

  function acceptForgiveness(fromSurrender = false) {
    if (btnYes && btnNo) {
      btnYes.style.display = 'none';
      btnNo.style.display = 'none';
      if (forgiveTaunt) {
        forgiveTaunt.innerHTML = `
          <div style="font-size:1.3rem;color:#7fd6b8;margin-bottom:8px;">🏆 CHỨNG NHẬN ĐẶC BIỆT 🏆</div>
          <div>Hana đã chính thức tha thứ cho anh người yêu hay chọc ghẹo!</div>
          <div style="font-size:0.95rem;color:#f7d3da;margin-top:6px;">Phần thưởng: 1000 cái ôm ấm áp và trọn đời yêu thương 💕</div>
        `;
      }

      const rect = forgiveArea.getBoundingClientRect();
      for (let i = 0; i < 35; i++) {
        setTimeout(() => {
          spawnHearts(rect.left + rect.width / 2 + (Math.random() - 0.5) * 120, rect.top + (Math.random() - 0.5) * 60, 4, true);
        }, i * 40);
      }

      showToast('Bé ngoan nhất trần đời! Yêu Hana 3000 lần 💕', '🎉', 4000);
    }
  }

  if (btnYes) {
    btnYes.addEventListener('click', () => acceptForgiveness(false));
  }

  // ==========================================
  // 18. TỪ ĐIỂN GIẢI MÃ: FLIP CARDS
  // ==========================================
  document.querySelectorAll('.decoder-card').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  // ==========================================
  // 19. MÁY RÚT PHIẾU ĐẶC QUYỀN SINH NHẬT
  // ==========================================
  const vouchers = [
    {
      badge: 'Đặc Quyền #1',
      title: 'Phiếu Miễn Chê Bai 24 Giờ',
      desc: 'Trong 24 giờ tới, anh cam kết chỉ khen Hana xinh xắn, ngoan ngoãn và đáng yêu. Nghiêm cấm chọc ghẹo hay chê bai bất kỳ điều gì dù chỉ 1 câu!'
    },
    {
      badge: 'Đặc Quyền #2',
      title: 'Phiếu Trà Sữa Lúc Nửa Đêm',
      desc: 'Có giá trị triệu hồi anh người yêu đi mua trà sữa full topping hoặc đồ ăn vặt cho Hana bất kể trời mưa, trời nắng hay nửa đêm!'
    },
    {
      badge: 'Đặc Quyền #3',
      title: 'Phiếu Hana Luôn Luôn Đúng',
      desc: 'Trong mọi cuộc tranh luận: Điều 1: Hana luôn luôn đúng. Điều 2: Nếu Hana có lỡ sai, hãy tự động xem lại Điều 1!'
    },
    {
      badge: 'Đặc Quyền #4',
      title: 'Phiếu Ôm Ấm Áp Vô Điều Kiện',
      desc: 'Có giá trị sử dụng ngay lập tức bất cứ khi nào em thấy mệt mỏi, áp lực việc học hay đơn giản là muốn làm nũng với anh.'
    },
    {
      badge: 'Đặc Quyền #5',
      title: 'Phiếu Đầy Tớ Ngoan Ngoãn 1 Ngày',
      desc: 'Hôm nay Hana chỉ việc làm công chúa nằm bấm điện thoại và nghỉ ngơi, mọi việc sai vặt hãy để anh người yêu tận tình phục vụ!'
    },
    {
      badge: 'Đặc Quyền #6',
      title: 'Phiếu Làm Trò Hề Xóa Tan Dỗi Hờn',
      desc: 'Khi Hana phụng phịu buồn dỗi, chỉ cần xuất trình phiếu này anh sẽ lập tức pha trò, làm mặt xấu cho đến khi em bật cười mới thôi!'
    }
  ];

  const btnDraw = document.getElementById('btnDrawVoucher');
  const giftBox = document.getElementById('giftBoxIcon');
  const vResult = document.getElementById('voucherResult');
  const vBadge = document.getElementById('vBadge');
  const vTitle = document.getElementById('vTitle');
  const vDesc = document.getElementById('vDesc');
  let lastVoucherIdx = -1;

  function drawVoucher() {
    if (!vResult) return;
    let randIdx;
    do {
      randIdx = Math.floor(Math.random() * vouchers.length);
    } while (randIdx === lastVoucherIdx && vouchers.length > 1);
    lastVoucherIdx = randIdx;

    const v = vouchers[randIdx];
    vBadge.textContent = v.badge;
    vTitle.textContent = v.title;
    vDesc.textContent = v.desc;

    vResult.style.display = 'block';

    const rect = vResult.getBoundingClientRect();
    spawnHearts(rect.left + rect.width / 2, rect.top + 30, 12, true);

    showToast(`Chúc mừng em rút được: ${v.title}!`, '🎁', 3500);

    if (btnDraw) btnDraw.textContent = 'Rút Thêm Thẻ Khác 🎲';
  }

  if (btnDraw) btnDraw.addEventListener('click', drawVoucher);
  if (giftBox) giftBox.addEventListener('click', drawVoucher);

  // ==========================================
  // 20. TRỨNG PHỤC SINH: NHẤP 3 LẦN AVATAR -> MƯA TÌNH YÊU
  // ==========================================
  let avatarClicks = 0;
  let avatarClickTimer = null;
  const avatarEl = document.querySelector('.hero-avatar');

  if (avatarEl) {
    avatarEl.addEventListener('click', (e) => {
      avatarClicks++;
      if (avatarClickTimer) clearTimeout(avatarClickTimer);

      if (avatarClicks >= 3) {
        avatarClicks = 0;
        triggerLoveRain();
      } else {
        avatarClickTimer = setTimeout(() => {
          avatarClicks = 0;
        }, 1200);
      }
    });
  }

  function triggerLoveRain() {
    showToast('✨ Em vừa mở khóa bí mật: Cơn mưa tình yêu dành riêng cho Hana! 💖', '✨', 4500);
    if (!isPlaying) toggleMusic();

    const symbols = ['💖', '💕', '🌸', '✨', '🍬', '🌷', '🎀', '⭐'];
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
        const size = Math.random() * 1 + 1;
        drop.style.cssText = `
          position: fixed;
          left: ${startX}px;
          top: -30px;
          font-size: ${size}rem;
          pointer-events: none;
          z-index: 99999;
          user-select: none;
          opacity: 0.9;
        `;
        document.body.appendChild(drop);

        const endX = startX + (Math.random() - 0.5) * 120;
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
  // 21. WIDGET NHỊP TIM TƯƠNG TÁC
  // ==========================================
  const heartbeatWidget = document.getElementById('heartbeatWidget');
  const heartbeatText = document.getElementById('heartbeatText');
  let isSpike = false;

  if (heartbeatWidget && heartbeatText) {
    heartbeatWidget.addEventListener('click', (e) => {
      if (isSpike) return;
      isSpike = true;
      heartbeatText.textContent = 'Cảnh báo: Tim đập 185 bpm vì Hana quá xinh đẹp! 💓🔥';
      heartbeatWidget.style.borderColor = '#e88aa0';
      spawnHearts(e.clientX, e.clientY, 15, true);

      setTimeout(() => {
        heartbeatText.textContent = 'Nhịp tim của anh khi cạnh Hana: 135 bpm';
        heartbeatWidget.style.borderColor = 'rgba(232, 138, 160, 0.3)';
        isSpike = false;
      }, 4000);
    });
  }

  // ==========================================
  // 22. MÓN QUÀ BẤT NGỜ (BATNGO.JPG)
  // ==========================================
  const secretFlowerBtn = document.getElementById('secretFlowerBtn');
  const surpriseModal = document.getElementById('surpriseModal');
  const surpriseClose = document.getElementById('surpriseClose');
  const surpriseBackdrop = document.getElementById('surpriseBackdrop');

  function openSurpriseModal() {
    if (!surpriseModal) return;
    surpriseModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Bắn chùm tim & pháo hoa hoa hồng rực rỡ
    for (let i = 0; i < 24; i++) {
      setTimeout(() => {
        spawnHearts(
          window.innerWidth / 2 + (Math.random() - 0.5) * (window.innerWidth * 0.7),
          window.innerHeight / 2 + (Math.random() - 0.5) * (window.innerHeight * 0.6),
          5,
          true
        );
      }, i * 60);
    }

    showToast('💐 Bó hoa này là dành riêng cho em! Chúc mừng sinh nhật Hana!', '🎁', 4000);
  }

  function closeSurpriseModal() {
    if (!surpriseModal) return;
    surpriseModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (secretFlowerBtn) secretFlowerBtn.addEventListener('click', openSurpriseModal);
  if (surpriseClose) surpriseClose.addEventListener('click', closeSurpriseModal);
  if (surpriseBackdrop) surpriseBackdrop.addEventListener('click', closeSurpriseModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && surpriseModal && surpriseModal.classList.contains('active')) {
      closeSurpriseModal();
    }
  });

  // ==========================================
  // 23. TỰ ĐỘNG GIẢI MÃ ẢNH HEIC (NẾU CẦN)
  // ==========================================
  if (window.heic2any) {
    document.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src');
      if (src && (src.includes('avt.jpg') || src.includes('hana02.jpg') || src.includes('hana03.jpg'))) {
        fetch(src)
          .then((res) => res.blob())
          .then((blob) => {
            if (blob && blob.size > 0) {
              window.heic2any({
                blob: blob,
                toType: 'image/jpeg',
                quality: 0.92
              }).then((conversionResult) => {
                const url = URL.createObjectURL(conversionResult);
                img.src = url;
              }).catch(() => {});
            }
          })
          .catch(() => {});
      }
    });
  }
});

