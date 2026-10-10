/**
 * SUNDAY ABIDEMI IPADEOLA | IPADEOLA D DRUMMER
 * Interactive Experience Engine
 * Features:
 *  - Web Audio API Yoruba Talking Drum Synthesizer & Polyrhythm Groove Looper
 *  - Theme Toggle (Light/Dark mode) with LocalStorage persistence
 *  - Mobile Navigation Drawer
 *  - Interactive Gallery Lightbox Modal
 *  - Booking Inquiry Form Validation & Mailto / WhatsApp generator
 *  - One-click Clipboard Copy for email
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initWebAudioDrums();
  initGalleryLightbox();
  initBookingForm();
  initCopyEmail();
  initHeaderScrollState();
});

/* --------------------------------------------------------------------------
   1. THEME TOGGLE (LIGHT / DARK)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to light
  const savedTheme = localStorage.getItem('ipadeola-theme') || 'light';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('ipadeola-theme', newTheme);
    });
  }
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (!mobileToggle || !mobileNav) return;

  function toggleMenu(isOpen) {
    const currentState = mobileToggle.getAttribute('aria-expanded') === 'true';
    const nextState = isOpen !== undefined ? isOpen : !currentState;

    mobileToggle.setAttribute('aria-expanded', String(nextState));
    mobileNav.setAttribute('aria-hidden', String(!nextState));
    if (nextState) {
      mobileNav.classList.add('is-open');
    } else {
      mobileNav.classList.remove('is-open');
    }
  }

  mobileToggle.addEventListener('click', () => toggleMenu());

  // Close when clicking any nav link
  const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. WEB AUDIO API TALKING DRUM SYNTHESIZER & RHYTHM LOOPER
   -------------------------------------------------------------------------- */
function initWebAudioDrums() {
  let audioCtx = null;
  let masterGain = null;
  let currentVolume = 0.75;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(currentVolume, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Volume slider control
  const volumeSlider = document.getElementById('drum-volume');
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      currentVolume = parseFloat(e.target.value);
      if (masterGain && audioCtx) {
        masterGain.gain.setValueAtTime(currentVolume, audioCtx.currentTime);
      }
    });
  }

  /**
   * Synthesize authentic Yoruba drum tones
   * @param {string} toneType - 'low', 'mid', 'high', 'bend', 'slap'
   */
  function playDrumTone(toneType) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(masterGain);

    if (toneType === 'low') {
      // Ìyá Ìlù deep resonance (DÒ)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(115, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.35);

      gain.gain.setValueAtTime(1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.start(now);
      osc.stop(now + 0.46);

    } else if (toneType === 'mid') {
      // Gángan Neutral Pitch (RE)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(175, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.25);

      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.31);

    } else if (toneType === 'high') {
      // High tension squeeze (MÍ)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(290, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);

      gain.gain.setValueAtTime(0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.start(now);
      osc.stop(now + 0.23);

    } else if (toneType === 'bend') {
      // Talking modulation pitch bend
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.14);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.38);

      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc.start(now);
      osc.stop(now + 0.43);

    } else if (toneType === 'slap') {
      // Sharp Ọmẹlẹ Batá accent slap
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

      gain.gain.setValueAtTime(0.95, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.16);
    }
  }

  // Bind drum pads
  const pads = document.querySelectorAll('.drum-pad');
  pads.forEach(pad => {
    const tone = pad.getAttribute('data-tone');

    function triggerPad() {
      playDrumTone(tone);
      pad.classList.add('pad-active');
      setTimeout(() => pad.classList.remove('pad-active'), 160);
    }

    pad.addEventListener('click', triggerPad);
    pad.addEventListener('touchstart', (e) => {
      e.preventDefault();
      triggerPad();
    }, { passive: false });
  });

  // Keyboard shortcut triggers (Keys 1-5)
  const keyToTone = {
    '1': 'low',
    '2': 'mid',
    '3': 'high',
    '4': 'bend',
    '5': 'slap'
  };

  document.addEventListener('keydown', (e) => {
    // Only if not actively typing inside input or textarea
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (keyToTone[e.key]) {
      const tone = keyToTone[e.key];
      const pad = document.querySelector(`.drum-pad[data-tone="${tone}"]`);
      if (pad) {
        pad.click();
      }
    }
  });

  /* ------------------------------------------------------------------------
     Authentic Yoruba Polyrhythmic Looper
     Pattern inspired by traditional Gángan praise beats
     ------------------------------------------------------------------------ */
  let isRhythmPlaying = false;
  let rhythmIntervalId = null;
  let currentStep = 0;

  // Traditional 16-step Yoruba Praise groove
  const yorubaPraiseGroove = [
    'low', null, 'high', 'mid',
    'bend', null, 'low', 'high',
    'mid', 'high', 'bend', null,
    'slap', 'mid', 'high', 'low'
  ];

  const playRhythmBtn = document.getElementById('play-rhythm-btn');
  const rhythmBtnText = document.getElementById('rhythm-btn-text');
  const rhythmStatusText = document.getElementById('rhythm-status-text');
  const tempoDot = document.querySelector('.tempo-dot');

  if (playRhythmBtn) {
    playRhythmBtn.addEventListener('click', () => {
      if (isRhythmPlaying) {
        stopRhythm();
      } else {
        startRhythm();
      }
    });
  }

  function startRhythm() {
    getAudioContext();
    isRhythmPlaying = true;
    currentStep = 0;

    if (rhythmBtnText) rhythmBtnText.textContent = 'Pause Groove';
    if (rhythmStatusText) rhythmStatusText.textContent = 'Playing Yoruba Praise Beat (128 BPM)';
    if (playRhythmBtn) playRhythmBtn.classList.add('btn-red-active');

    // 128 BPM 16th notes -> ~117ms per step
    rhythmIntervalId = setInterval(() => {
      const toneToPlay = yorubaPraiseGroove[currentStep];

      // Pulse tempo dot
      if (tempoDot) {
        tempoDot.classList.add('dot-active');
        setTimeout(() => tempoDot.classList.remove('dot-active'), 80);
      }

      if (toneToPlay) {
        playDrumTone(toneToPlay);
        const pad = document.querySelector(`.drum-pad[data-tone="${toneToPlay}"]`);
        if (pad) {
          pad.classList.add('pad-active');
          setTimeout(() => pad.classList.remove('pad-active'), 90);
        }
      }

      currentStep = (currentStep + 1) % yorubaPraiseGroove.length;
    }, 117);
  }

  function stopRhythm() {
    isRhythmPlaying = false;
    clearInterval(rhythmIntervalId);
    rhythmIntervalId = null;

    if (rhythmBtnText) rhythmBtnText.textContent = 'Play Yoruba Praise Groove';
    if (rhythmStatusText) rhythmStatusText.textContent = 'Beat Paused. Tap pads to play solo.';
    if (playRhythmBtn) playRhythmBtn.classList.remove('btn-red-active');
  }
}

/* --------------------------------------------------------------------------
   4. PHOTO GALLERY LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxSub = document.getElementById('lightbox-sub');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const backdrop = document.querySelector('.lightbox-backdrop');

  if (!modal || !lightboxImg) return;

  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    function openModal() {
      const img = item.querySelector('.gallery-img');
      const title = item.querySelector('.overlay-title');
      const sub = item.querySelector('.overlay-sub');

      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
      }
      if (title && lightboxTitle) {
        lightboxTitle.textContent = title.textContent;
      }
      if (sub && lightboxSub) {
        lightboxSub.textContent = sub.textContent;
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    item.addEventListener('click', openModal);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });
  });

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   5. BOOKING INQUIRY FORM VALIDATION & HANDLING
   -------------------------------------------------------------------------- */
function initBookingForm() {
  const form = document.getElementById('inquiry-form');
  const successAlert = document.getElementById('form-success-alert');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Name field
    const nameInput = document.getElementById('client-name');
    const nameGroup = nameInput.closest('.form-group');
    if (!nameInput.value.trim()) {
      nameGroup.classList.add('has-error');
      isValid = false;
    } else {
      nameGroup.classList.remove('has-error');
    }

    // Email field
    const emailInput = document.getElementById('client-email');
    const emailGroup = emailInput.closest('.form-group');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      emailGroup.classList.add('has-error');
      isValid = false;
    } else {
      emailGroup.classList.remove('has-error');
    }

    // Event type
    const eventTypeSelect = document.getElementById('event-type');
    const typeGroup = eventTypeSelect.closest('.form-group');
    if (!eventTypeSelect.value) {
      typeGroup.classList.add('has-error');
      isValid = false;
    } else {
      typeGroup.classList.remove('has-error');
    }

    // Message field
    const msgInput = document.getElementById('event-message');
    const msgGroup = msgInput.closest('.form-group');
    if (!msgInput.value.trim()) {
      msgGroup.classList.add('has-error');
      isValid = false;
    } else {
      msgGroup.classList.remove('has-error');
    }

    if (!isValid) return;

    // Collect values
    const clientName = nameInput.value.trim();
    const clientEmail = emailInput.value.trim();
    const clientPhone = document.getElementById('client-phone').value.trim() || 'N/A';
    const eventType = eventTypeSelect.value;
    const eventDate = document.getElementById('event-date').value || 'To be determined';
    const eventLocation = document.getElementById('event-location').value.trim() || 'To be specified';
    const clientMessage = msgInput.value.trim();

    // Disable button temporarily & show success
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Processing Inquiry...</span>';
    }

    // Compose formatted mailto URL to send directly to ipadeolasundayabidemi@yahoo.com
    const subject = encodeURIComponent(`Performance Booking Inquiry: ${eventType} - ${clientName}`);
    const bodyContent = encodeURIComponent(
`Hello Sunday Abidemi Ipadeola (Ipadeola D Drummer),

I would like to inquire about booking your talking drum performance services.

BOOKING DETAILS:
- Name: ${clientName}
- Email: ${clientEmail}
- Phone/WhatsApp: ${clientPhone}
- Event Type: ${eventType}
- Event Date: ${eventDate}
- Venue / Location: ${eventLocation}

DETAILS & SPECIAL REQUESTS:
${clientMessage}

Looking forward to your prompt response.

Warm regards,
${clientName}`
    );

    const mailtoUrl = `mailto:ipadeolasundayabidemi@yahoo.com?subject=${subject}&body=${bodyContent}`;

    setTimeout(() => {
      if (successAlert) {
        successAlert.style.display = 'flex';
      }

      // Launch email client
      window.location.href = mailtoUrl;

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Inquiry Prepared &check;</span>';
      }
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   6. COPY EMAIL QUICK ACTION
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const emailToCopy = 'ipadeolasundayabidemi@yahoo.com';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailToCopy).then(() => {
      if (copyBtnText) copyBtnText.textContent = 'Copied!';
      copyBtn.style.backgroundColor = 'var(--red-primary)';
      copyBtn.style.color = 'var(--white)';

      setTimeout(() => {
        if (copyBtnText) copyBtnText.textContent = 'Copy Email';
        copyBtn.style.backgroundColor = '';
        copyBtn.style.color = '';
      }, 2500);
    }).catch(() => {
      // Fallback
      window.prompt('Copy email address:', emailToCopy);
    });
  });
}

/* --------------------------------------------------------------------------
   7. STICKY HEADER SCROLL STATE
   -------------------------------------------------------------------------- */
function initHeaderScrollState() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });
}
