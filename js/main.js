/* ==========================================================================
   KOGI STATE BURSARY INFORMATION PORTAL - JAVASCRIPT ENGINE
   Author / Representative: Nurudeen Shamsiyat Oyiza (2025/HND/SWD/057)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme Switcher (Dark / Light)
  initThemeToggle();

  // 2. Initialize Navigation & Mobile Drawer
  initNavigation();

  // 3. Initialize Scroll Animations (IntersectionObserver)
  initScrollAnimations();

  // 4. Initialize Animated Counters
  initNumberCounters();

  // 5. Initialize Quick Eligibility Checker (if present)
  initEligibilityChecker();

  // 6. Initialize Document Readiness Checklist (if present)
  initReadinessChecklist();

  // 7. Initialize FAQ Accordion & Search (if present)
  initFaqAccordion();

  // 8. Initialize LGA Filter & Search (if present)
  initLgaSearch();

  // 9. Initialize Contact Form Submission & Toast
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle Logic
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('kg-bursary-theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('kg-bursary-theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode!`, 'info');
  });

  function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    if (!icon) return;
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
      themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
    } else {
      icon.className = 'fas fa-moon';
      themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
    }
  }
}

/* --------------------------------------------------------------------------
   2. Navigation, Sticky Header & Mobile Drawer
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  // Sticky header class on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    // Close when clicking outside or clicking a nav link
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. Scroll Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. Animated Number Counters
   -------------------------------------------------------------------------- */
function initNumberCounters() {
  const counterElements = document.querySelectorAll('.stat-number');
  if (!counterElements.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counterElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1800;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out expo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = Math.floor(easeProgress * target);

            el.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* --------------------------------------------------------------------------
   5. Interactive Quick Eligibility Pre-Checker
   -------------------------------------------------------------------------- */
function initEligibilityChecker() {
  const checkBtn = document.getElementById('checkEligibilityBtn');
  const resultBox = document.getElementById('eligibilityResult');
  if (!checkBtn || !resultBox) return;

  checkBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const origin = document.getElementById('checkOrigin')?.value;
    const lga = document.getElementById('checkLga')?.value;
    const instType = document.getElementById('checkInstType')?.value;
    const level = document.getElementById('checkLevel')?.value;

    if (!origin || !lga || !instType || !level) {
      showToast('Please fill in all eligibility checker fields.', 'warning');
      return;
    }

    resultBox.style.display = 'block';

    if (origin !== 'kogi') {
      resultBox.className = 'checker-result-box ineligible';
      resultBox.innerHTML = `
        <div style="display:flex; align-items:flex-start; gap:0.75rem;">
          <i class="fas fa-exclamation-triangle" style="font-size:1.5rem; margin-top:2px;"></i>
          <div>
            <h4 style="font-size:1.1rem; margin-bottom:0.25rem;">Not Eligible for State Indigene Bursary</h4>
            <p style="font-size:0.92rem;">The Kogi State Bursary Scheme is strictly reserved for bonafide indigenes of Kogi State representing any of the 21 recognized Local Government Areas.</p>
          </div>
        </div>
      `;
      return;
    }

    if (instType === 'private') {
      resultBox.className = 'checker-result-box ineligible';
      resultBox.innerHTML = `
        <div style="display:flex; align-items:flex-start; gap:0.75rem;">
          <i class="fas fa-info-circle" style="font-size:1.5rem; margin-top:2px;"></i>
          <div>
            <h4 style="font-size:1.1rem; margin-bottom:0.25rem;">Public Institution Requirement</h4>
            <p style="font-size:0.92rem;">Currently, the government bursary scheme applies to full-time students in accredited <strong>Public Universities, Polytechnics, and Colleges of Education</strong>. Keep an eye out for special private-sector endowment grants.</p>
          </div>
        </div>
      `;
      return;
    }

    // Eligible paths
    let grantAmount = '₦30,000';
    let schemeName = 'Undergraduate / Polytechnic Bursary';
    if (level === 'law') {
      grantAmount = '₦300,000';
      schemeName = 'Nigerian Law School Executive Bursary';
    } else if (level === 'medical') {
      grantAmount = '₦75,000';
      schemeName = 'Medical & Clinical Health Grant';
    }

    resultBox.className = 'checker-result-box eligible';
    resultBox.innerHTML = `
      <div style="display:flex; align-items:flex-start; gap:0.75rem;">
        <i class="fas fa-check-circle" style="font-size:1.6rem; color:var(--primary); margin-top:2px;"></i>
        <div>
          <h4 style="font-size:1.15rem; margin-bottom:0.25rem; color:var(--primary-dark);">Congratulations! You Are Pre-Qualified</h4>
          <p style="font-size:0.92rem; margin-bottom:0.6rem;">
            As an indigene of <strong>${lga.toUpperCase()} LGA</strong> enrolled in a public institution, you are qualified to apply for the <strong>${schemeName}</strong> with an approved grant of <strong>${grantAmount}</strong>.
          </p>
          <a href="application-guide.html" class="btn btn-primary" style="padding:0.45rem 1.1rem; font-size:0.85rem; display:inline-flex;">
            View Required Documents &amp; Next Steps <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;

    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/* --------------------------------------------------------------------------
   6. Document Readiness Checklist (Interactive Tool)
   -------------------------------------------------------------------------- */
function initReadinessChecklist() {
  const checkItems = document.querySelectorAll('.check-item');
  const progressBar = document.getElementById('readinessProgressBar');
  const progressText = document.getElementById('readinessProgressText');
  const statusMessage = document.getElementById('readinessStatusMessage');

  if (!checkItems.length || !progressBar) return;

  checkItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      updateReadinessProgress();
    });
  });

  function updateReadinessProgress() {
    const total = checkItems.length;
    const checked = document.querySelectorAll('.check-item.checked').length;
    const percentage = Math.round((checked / total) * 100);

    progressBar.style.width = `${percentage}%`;
    if (progressText) {
      progressText.textContent = `${percentage}% Ready (${checked}/${total} Documents)`;
    }

    if (statusMessage) {
      if (percentage === 100) {
        statusMessage.className = 'badge badge-green';
        statusMessage.innerHTML = '<i class="fas fa-star"></i> 100% Prepared to Apply on Portal!';
      } else if (percentage >= 60) {
        statusMessage.className = 'badge badge-gold';
        statusMessage.innerHTML = '<i class="fas fa-hourglass-half"></i> Almost there! Gather remaining documents.';
      } else {
        statusMessage.className = 'badge';
        statusMessage.style.background = '#F3F4F6';
        statusMessage.style.color = '#4B5563';
        statusMessage.innerHTML = '<i class="fas fa-clock"></i> Incomplete - Prepare requirements prior to registration.';
      }
    }
  }
}

/* --------------------------------------------------------------------------
   7. FAQ Accordion & Search Filter
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const faqSearch = document.getElementById('faqSearchInput');

  if (faqItems.length) {
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      questionBtn?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherAns = other.querySelector('.faq-answer');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        if (!isActive) {
          item.classList.add('active');
          if (answer) answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
        } else {
          item.classList.remove('active');
          if (answer) answer.style.maxHeight = null;
        }
      });
    });
  }

  // FAQ live filter
  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-question')?.textContent.toLowerCase() || '';
        const answerText = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';
        if (questionText.includes(term) || answerText.includes(term)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   8. LGA Search & Filter Logic
   -------------------------------------------------------------------------- */
function initLgaSearch() {
  const lgaSearch = document.getElementById('lgaSearchInput');
  const lgaCards = document.querySelectorAll('.lga-badge-card');

  if (lgaSearch && lgaCards.length) {
    lgaSearch.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      lgaCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(val)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   9. Contact Form & Toast System
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('bursaryContactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const phone = document.getElementById('contactPhone')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all mandatory fields.', 'warning');
      return;
    }

    // Submit animation simulation
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      contactForm.reset();

      showToast('Thank you! Your inquiry has been forwarded to the student desk (Nurudeen Shamsiyat Oyiza) & KSSBB Support.', 'success');
    }, 1200);
  });
}

/* Helper: Global Toast Notification */
function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  let iconHtml = '<i class="fas fa-info-circle toast-icon"></i>';
  if (type === 'success') {
    iconHtml = '<i class="fas fa-check-circle toast-icon" style="color:var(--primary);"></i>';
  } else if (type === 'warning') {
    iconHtml = '<i class="fas fa-exclamation-triangle toast-icon" style="color:#D4A017;"></i>';
  }

  toast.innerHTML = `
    ${iconHtml}
    <div style="font-size:0.92rem; font-weight:600;">${message}</div>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4200);
}
