/**
 * Devi Care Hearing Clinic - Dynamic Application Logic
 * Loads and renders everything from /data/clinic.json
 */

document.addEventListener('DOMContentLoaded', async () => {
  let clinicData = null;

  try {
    const res = await fetch('data/clinic.json');
    if (!res.ok) throw new Error('Failed to load clinic.json');
    clinicData = await res.json();
  } catch (err) {
    console.error('Error loading clinic.json, loading fallback dataset:', err);
  }

  if (clinicData) {
    renderClinicData(clinicData);
    initStatusBadge(clinicData.clinic.hours);
    initGallery(clinicData.gallery);
    initFaq(clinicData.faq);
    initToConfirmModal(clinicData.toConfirm);
    initAppointmentModal(clinicData.clinic);
    initHearingScreener(clinicData.clinic);
  }

  initNavMenu();
  initFaqAccordion();
  initEarIntro();
});

/**
 * Render dynamic data into all page elements
 */
function renderClinicData(data) {
  const { clinic, stats, services, products, reviews } = data;

  // 1. Text elements & Links
  document.querySelectorAll('[data-bind="name"]').forEach(el => el.textContent = clinic.name);
  document.querySelectorAll('[data-bind="shortName"]').forEach(el => el.textContent = clinic.shortName);
  document.querySelectorAll('[data-bind="tagline"]').forEach(el => el.textContent = clinic.tagline);
  document.querySelectorAll('[data-bind="subheading"]').forEach(el => el.textContent = clinic.subheading);
  document.querySelectorAll('[data-bind="phone"]').forEach(el => el.textContent = clinic.primaryPhone);
  document.querySelectorAll('[data-bind="phoneClean"]').forEach(el => el.href = `tel:${clinic.phoneClean}`);
  document.querySelectorAll('[data-bind="rating"]').forEach(el => el.textContent = `${clinic.rating}★`);
  document.querySelectorAll('[data-bind="reviewCount"]').forEach(el => el.textContent = `(${clinic.reviewCount}+ Verified Reviews)`);
  document.querySelectorAll('[data-bind="address"]').forEach(el => el.textContent = clinic.address.fullAddress);
  document.querySelectorAll('[data-bind="servingRegion"]').forEach(el => el.textContent = clinic.address.servingRegion);
  document.querySelectorAll('[data-bind="weekdays"]').forEach(el => el.textContent = clinic.hours.weekdays);
  document.querySelectorAll('[data-bind="googleLink"]').forEach(el => el.href = clinic.googleShareUrl);
  
  // WhatsApp links
  const waUrl = `https://wa.me/${clinic.whatsappNumber}?text=${encodeURIComponent(clinic.whatsappMessage)}`;
  document.querySelectorAll('[data-bind="whatsappLink"]').forEach(el => el.href = waUrl);

  // Doctor Info
  if (clinic.specialist) {
    document.querySelectorAll('[data-bind="docName"]').forEach(el => el.textContent = clinic.specialist.name);
    document.querySelectorAll('[data-bind="docRole"]').forEach(el => el.textContent = clinic.specialist.role);
    document.querySelectorAll('[data-bind="docQual"]').forEach(el => el.textContent = `${clinic.specialist.qualification} • ${clinic.specialist.experience}`);
  }

  // 2. Render Stats
  const statsContainer = document.getElementById('statsContainer');
  if (statsContainer && stats) {
    statsContainer.innerHTML = stats.map(s => `
      <div class="stat-item">
        <span class="stat-number">${s.value}</span>
        <span class="stat-label">${s.label}</span>
        <span class="stat-desc">${s.desc}</span>
      </div>
    `).join('');
  }

  // 3. Render Services
  const servicesContainer = document.getElementById('servicesContainer');
  if (servicesContainer && services) {
    servicesContainer.innerHTML = services.map(s => `
      <article class="service-card" id="service-${s.id}">
        <div class="service-img-wrap">
          <img src="${s.image}" alt="${s.title}" class="service-img" loading="lazy" onerror="this.src='assets/images/clinic-setup.webp'">
          <span class="service-badge">${s.badge}</span>
        </div>
        <div class="service-body">
          <h3 class="service-title">${s.title}</h3>
          <p class="service-description">${s.description}</p>
          <ul class="service-benefits-list">
            ${s.benefits.map(b => `
              <li class="service-benefit-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>${b}</span>
              </li>
            `).join('')}
          </ul>
          <button class="service-action-btn" onclick="openAppointmentModal('${s.title}')">
            Schedule Consultation &rarr;
          </button>
        </div>
      </article>
    `).join('');
  }

  // 4. Render Products / Hearing Aids
  const devicesContainer = document.getElementById('devicesContainer');
  if (devicesContainer && products) {
    devicesContainer.innerHTML = products.map(p => `
      <div class="device-card ${p.featured ? 'featured' : ''}">
        <span class="device-tag">${p.tag}</span>
        <div class="device-img-box">
          <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='assets/images/product-cic-hearing-aid.webp'">
        </div>
        <div class="device-category">${p.category}</div>
        <h3 class="device-name">${p.name}</h3>
        <ul class="device-highlights">
          ${p.highlights.map(h => `
            <li class="device-highlight-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${h}</span>
            </li>
          `).join('')}
        </ul>
        <button class="btn btn-secondary" style="width: 100%;" onclick="openAppointmentModal('Trial: ${p.name}')">
          Request Free Trial / Demo
        </button>
      </div>
    `).join('');
  }

  // 5. Render Reviews
  const reviewsContainer = document.getElementById('reviewsContainer');
  if (reviewsContainer && reviews) {
    reviewsContainer.innerHTML = reviews.map(r => `
      <div class="review-card">
        <div class="review-header">
          <div class="reviewer-meta">
            <div class="reviewer-avatar">${r.reviewerName.charAt(0)}</div>
            <div>
              <h4 class="reviewer-name">${r.reviewerName}</h4>
              <span class="reviewer-status">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                ${r.date}
              </span>
            </div>
          </div>
          <div class="rating-stars-badge">
            ${'★'.repeat(Math.floor(r.rating))}${r.rating % 1 !== 0 ? '½' : ''}
          </div>
        </div>
        <p class="review-quote">"${r.text}"</p>
        <div class="review-highlight">${r.highlight}</div>
      </div>
    `).join('');
  }

  // 6. Render Weekly Schedule
  const scheduleContainer = document.getElementById('scheduleContainer');
  if (scheduleContainer && clinic.hours.schedule) {
    const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Mon...
    const dayMap = [6, 0, 1, 2, 3, 4, 5]; // maps to schedule array where Mon is index 0
    const currentScheduleIndex = dayMap[todayIndex];

    scheduleContainer.innerHTML = clinic.hours.schedule.map((item, idx) => `
      <li class="schedule-row ${idx === currentScheduleIndex ? 'today' : ''}">
        <span class="schedule-day">${item.day} ${idx === currentScheduleIndex ? '(Today)' : ''}</span>
        <span class="schedule-time">${item.hours}</span>
      </li>
    `).join('');
  }
}

/**
 * Live Open / Closed indicator based on Indian Standard Time (IST)
 */
function initStatusBadge(hoursData) {
  const badgeEl = document.getElementById('liveStatusBadge');
  if (!badgeEl) return;

  // Calculate current time in IST (UTC + 5:30)
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (3600000 * 5.5));

  const day = ist.getDay(); // 0 is Sunday, 1..6 is Mon..Sat
  const hour = ist.getHours();
  const minutes = ist.getMinutes();
  const decimalTime = hour + (minutes / 60);

  // Clinic is open Mon-Sat 9:00 AM (9.0) to 8:00 PM (20.0)
  const isOpen = (day >= 1 && day <= 6) && (decimalTime >= 9.0 && decimalTime < 20.0);

  if (isOpen) {
    badgeEl.className = 'badge-status badge-open';
    badgeEl.innerHTML = '<span class="status-dot"></span> Clinic Open Now until 8:00 PM';
  } else {
    badgeEl.className = 'badge-status badge-closed';
    badgeEl.innerHTML = '<span class="status-dot"></span> Closed Now • Opens Mon-Sat 9:00 AM';
  }
}

/**
 * Gallery Rendering, Filtering, and Lightbox
 */
function initGallery(galleryItems) {
  const container = document.getElementById('galleryGrid');
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  if (!container || !galleryItems) return;

  function render(filter = 'all') {
    const filtered = filter === 'all' 
      ? galleryItems 
      : galleryItems.filter(item => item.category.toLowerCase().includes(filter.toLowerCase()));

    container.innerHTML = filtered.map((item, index) => `
      <div class="gallery-item" onclick="openLightbox('${item.src}', '${item.caption}')">
        <img src="${item.src}" alt="${item.caption}" class="gallery-thumb" loading="lazy" onerror="this.src='assets/images/clinic-exterior.webp'">
        ${item.isPlaceholder ? '<span class="gallery-placeholder-tag">Placeholder</span>' : ''}
        <div class="gallery-overlay">
          <span class="gallery-category-pill">${item.category}</span>
          <h5 class="gallery-caption">${item.caption}</h5>
        </div>
      </div>
    `).join('');
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.filter);
    });
  });

  render('all');
}

window.openLightbox = function(src, caption) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  if (modal && img) {
    img.src = src;
    cap.textContent = caption || '';
    modal.classList.add('active');
  }
};

window.closeLightbox = function() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('active');
};

/**
 * FAQ Accordion
 */
function initFaq(faqItems) {
  const container = document.getElementById('faqContainer');
  if (!container || !faqItems) return;

  container.innerHTML = faqItems.map((item, idx) => `
    <div class="faq-item ${idx === 0 ? 'active' : ''}">
      <button class="faq-question-btn" onclick="toggleFaq(this)">
        <span>${item.q}</span>
        <svg class="faq-icon-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="faq-answer">
        <p>${item.a}</p>
      </div>
    </div>
  `).join('');
}

window.toggleFaq = function(btn) {
  const item = btn.closest('.faq-item');
  const allItems = document.querySelectorAll('.faq-item');
  allItems.forEach(i => {
    if (i !== item) i.classList.remove('active');
  });
  item.classList.toggle('active');
};

function initFaqAccordion() {
  // Handled dynamically by initFaq
}

/**
 * Mobile Navigation Menu
 */
function initNavMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('navMenu');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });
}

/**
 * Appointment Modal and WhatsApp integration
 */
window.openAppointmentModal = function(serviceName = '') {
  const modal = document.getElementById('appointmentModal');
  if (modal) {
    modal.classList.add('active');
    if (serviceName) {
      const select = document.getElementById('apptServiceSelect');
      if (select) {
        // find matching or set custom
        let found = false;
        for (let opt of select.options) {
          if (opt.text.toLowerCase().includes(serviceName.toLowerCase())) {
            select.value = opt.value;
            found = true;
            break;
          }
        }
        if (!found && select.options.length > 0) {
          select.options[0].text = serviceName;
          select.value = serviceName;
        }
      }
    }
  }
};

window.closeAppointmentModal = function() {
  const modal = document.getElementById('appointmentModal');
  if (modal) modal.classList.remove('active');
};

function initAppointmentModal(clinic) {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('apptName').value.trim();
    const phone = document.getElementById('apptPhone').value.trim();
    const service = document.getElementById('apptServiceSelect').value;
    const date = document.getElementById('apptDate').value;
    const message = document.getElementById('apptNotes').value.trim();

    const text = `Hello Devi Care Hearing Clinic,\n\nI would like to book a consultation:\n• Name: ${name}\n• Phone: ${phone}\n• Service: ${service}\n• Preferred Date: ${date || 'Earliest Available'}\n${message ? '• Note: ' + message : ''}`;

    const waUrl = `https://wa.me/${clinic.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    closeAppointmentModal();
    alert('Thank you! Your appointment request has been directed to Devi Care Hearing on WhatsApp for instant confirmation.');
  });
}

/**
 * Interactive 4-Question Hearing Self-Check
 */
function initHearingScreener(clinic) {
  const yesBtns = document.querySelectorAll('.screener-btn-opt[data-val="yes"]');
  const noBtns = document.querySelectorAll('.screener-btn-opt[data-val="no"]');
  const resultBox = document.getElementById('screenerResult');
  const resultScore = document.getElementById('resultScore');
  const resultMessage = document.getElementById('resultMessage');

  let answers = { q1: null, q2: null, q3: null, q4: null };

  document.querySelectorAll('.screener-q-item').forEach(item => {
    const qKey = item.dataset.q;
    const yBtn = item.querySelector('[data-val="yes"]');
    const nBtn = item.querySelector('[data-val="no"]');

    if (yBtn && nBtn) {
      yBtn.addEventListener('click', () => {
        answers[qKey] = 1;
        yBtn.classList.add('active-yes');
        nBtn.classList.remove('active-no');
        evaluateScreener();
      });
      nBtn.addEventListener('click', () => {
        answers[qKey] = 0;
        nBtn.classList.add('active-no');
        yBtn.classList.remove('active-yes');
        evaluateScreener();
      });
    }
  });

  function evaluateScreener() {
    const totalAnswered = Object.values(answers).filter(v => v !== null).length;
    if (totalAnswered < 4) return;

    const yesCount = Object.values(answers).reduce((a, b) => a + (b || 0), 0);
    resultBox.classList.add('show');

    if (yesCount >= 2) {
      resultBox.style.background = '#FEF2F2';
      resultBox.style.border = '1.5px solid #FECACA';
      resultScore.textContent = `Score: ${yesCount}/4 Questions Answered "Yes"`;
      resultScore.style.color = '#B91C1C';
      resultMessage.innerHTML = `
        <p style="color: #7F1D1D; margin-bottom: 16px;">
          Your responses indicate possible mild-to-moderate hearing strain or sound processing fatigue. Early computerized assessment ensures your hearing clarity is protected.
        </p>
        <button class="btn btn-primary" onclick="openAppointmentModal('Computerized Hearing Assessment')">
          Book Computerized Hearing Test &rarr;
        </button>
      `;
    } else {
      resultBox.style.background = '#ECFDF5';
      resultBox.style.border = '1.5px solid #A7F3D0';
      resultScore.textContent = `Score: ${yesCount}/4 Questions Answered "Yes"`;
      resultScore.style.color = '#047857';
      resultMessage.innerHTML = `
        <p style="color: #065F46; margin-bottom: 16px;">
          Your auditory responses show good everyday speech comprehension! We recommend an annual routine hearing checkup to maintain lifelong auditory wellness.
        </p>
        <button class="btn btn-secondary" onclick="openAppointmentModal('Routine Hearing Wellness Check')">
          Schedule Annual Wellness Check
        </button>
      `;
    }
  }
}

/**
 * "TO CONFIRM" Modal for Business Verification
 */
function initToConfirmModal(items) {
  const container = document.getElementById('toConfirmList');
  if (!container || !items) return;

  container.innerHTML = items.map((it, idx) => `
    <div style="background: var(--surface-soft); border-left: 4px solid var(--warning); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <h4 style="font-size: 1rem; color: var(--text);">${it.item}</h4>
        <span style="background: var(--warning-bg); color: var(--warning); font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: var(--radius-pill);">${it.status}</span>
      </div>
      <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">${it.detail}</p>
    </div>
  `).join('');
}

window.openToConfirmModal = function() {
  const m = document.getElementById('toConfirmModal');
  if (m) m.classList.add('active');
};

window.closeToConfirmModal = function() {
  const m = document.getElementById('toConfirmModal');
  if (m) m.classList.remove('active');
};

/**
 * Creative Ear Intro Animation Sequence
 */
function initEarIntro() {
  const overlay = document.getElementById('earIntroOverlay');
  if (!overlay) return;

  // Auto-dismiss smoothly after 3.2 seconds
  setTimeout(() => {
    closeEarIntro();
  }, 3200);

  // Dismiss on ESC or click backdrop
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('ear-intro-backdrop')) {
      closeEarIntro();
    }
  });
}

window.closeEarIntro = function() {
  const overlay = document.getElementById('earIntroOverlay');
  if (overlay) {
    overlay.classList.add('dismissed');
  }
};

window.playEarIntro = function() {
  const overlay = document.getElementById('earIntroOverlay');
  if (overlay) {
    overlay.classList.remove('dismissed');
    playHarmonicAcousticChime();
    
    // Auto-dismiss again after 4.5s
    setTimeout(() => {
      overlay.classList.add('dismissed');
    }, 4500);
  }
};

/**
 * Gentle medical acoustic sound chime using Web Audio API (432Hz -> 528Hz clarity chime)
 */
function playHarmonicAcousticChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(432, now); // Natural resonance
    osc1.frequency.exponentialRampToValueAtTime(528, now + 1.2); // Clarity tone

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(864, now);
    osc2.frequency.exponentialRampToValueAtTime(1056, now + 1.2);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.06, now + 0.4);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.3);
    osc2.stop(now + 2.3);
  } catch (e) {
    // AudioContext silently handled if browser restricts before user gesture
  }
}
