/* ============================================
   MVULI HOTELS - LUXURY HOTEL WEBSITE
   script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  'use strict';

  /* ------------------------------------------
     1. STICKY NAVBAR
     ------------------------------------------ */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleNavbarScroll() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* ------------------------------------------
     2. MOBILE HAMBURGER MENU
     ------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    const isExpanded = navMenu.classList.contains('active');
    navToggle.setAttribute('aria-expanded', isExpanded);
    document.body.style.overflow = isExpanded ? 'hidden' : '';
  }

  function closeMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  /* ------------------------------------------
     3. HERO SLIDER
     ------------------------------------------ */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    heroSlides.forEach(slide => slide.classList.remove('active'));
    heroDots.forEach(dot => dot.classList.remove('active'));

    heroSlides[index].classList.add('active');
    heroDots[index].classList.add('active');

    heroDots.forEach((dot, i) => {
      dot.setAttribute('aria-selected', i === index);
    });

    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % heroSlides.length;
    goToSlide(next);
  }

  function startSlideInterval() {
    stopSlideInterval();
    slideInterval = setInterval(nextSlide, 6000);
  }

  function stopSlideInterval() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  heroDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-slide'));
      goToSlide(index);
      startSlideInterval();
    });
  });

  const heroSection = document.querySelector('.hero');
  heroSection.addEventListener('mouseenter', stopSlideInterval);
  heroSection.addEventListener('mouseleave', startSlideInterval);

  startSlideInterval();

  /* ------------------------------------------
     4. SMOOTH SCROLL
     ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  /* ------------------------------------------
     5. SCROLL REVEAL (INTERSECTION OBSERVER)
     ------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------
     6. ANIMATED COUNTERS
     ------------------------------------------ */
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeOut * target);

          counter.textContent = current.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString();
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ------------------------------------------
     7. TESTIMONIALS SLIDER
     ------------------------------------------ */
  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  let currentTestimonial = 0;
  let testimonialInterval;

  function goToTestimonial(index) {
    if (index < 0) index = testimonialSlides.length - 1;
    if (index >= testimonialSlides.length) index = 0;

    testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    testimonialDots[index].classList.add('active');

    testimonialDots.forEach((dot, i) => {
      dot.setAttribute('aria-selected', i === index);
    });

    currentTestimonial = index;
  }

  function nextTestimonial() {
    goToTestimonial(currentTestimonial + 1);
  }

  function prevTestimonial() {
    goToTestimonial(currentTestimonial - 1);
  }

  function startTestimonialInterval() {
    stopTestimonialInterval();
    testimonialInterval = setInterval(nextTestimonial, 5000);
  }

  function stopTestimonialInterval() {
    if (testimonialInterval) {
      clearInterval(testimonialInterval);
      testimonialInterval = null;
    }
  }

  prevBtn.addEventListener('click', () => {
    prevTestimonial();
    startTestimonialInterval();
  });

  nextBtn.addEventListener('click', () => {
    nextTestimonial();
    startTestimonialInterval();
  });

  testimonialDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-slide'));
      goToTestimonial(index);
      startTestimonialInterval();
    });
  });

  const testimonialSlider = document.querySelector('.testimonial-slider');
  testimonialSlider.addEventListener('mouseenter', stopTestimonialInterval);
  testimonialSlider.addEventListener('mouseleave', startTestimonialInterval);

  startTestimonialInterval();

  /* ------------------------------------------
     8. GALLERY LIGHTBOX
     ------------------------------------------ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentGalleryIndex = 0;
  const galleryImages = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      galleryImages.push({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || 'Gallery image'
      });
    }

    item.addEventListener('click', () => {
      currentGalleryIndex = index;
      openLightbox(index);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        currentGalleryIndex = index;
        openLightbox(index);
      }
    });

    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
  });

  function openLightbox(index) {
    if (galleryImages.length === 0) return;
    updateLightboxImage(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxImage(index) {
    const image = galleryImages[index];
    lightboxImage.setAttribute('src', image.src);
    lightboxImage.setAttribute('alt', image.alt);
    lightboxCaption.textContent = image.alt;
  }

  function navigateLightbox(direction) {
    currentGalleryIndex = (currentGalleryIndex + direction + galleryImages.length) % galleryImages.length;
    updateLightboxImage(currentGalleryIndex);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext.addEventListener('click', () => navigateLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  /* ------------------------------------------
     9. SCROLL TO TOP BUTTON
     ------------------------------------------ */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* ------------------------------------------
     10. CONTACT FORM VALIDATION
     ------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    const formInputs = contactForm.querySelectorAll('.form-input[required]');

    function validateField(input) {
      const errorSpan = input.parentElement.querySelector('.form-error');
      let isValid = true;
      let errorMessage = '';

      if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
      } else if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
      }

      if (!isValid) {
        input.classList.add('error');
        if (errorSpan) errorSpan.textContent = errorMessage;
      } else {
        input.classList.remove('error');
        if (errorSpan) errorSpan.textContent = '';
      }

      return isValid;
    }

    formInputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          validateField(input);
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;

      formInputs.forEach(input => {
        if (!validateField(input)) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        formSuccess.classList.add('show');
        contactForm.reset();

        setTimeout(() => {
          formSuccess.classList.remove('show');
        }, 5000);
      } else {
        const firstError = contactForm.querySelector('.form-input.error');
        if (firstError) firstError.focus();
      }
    });
  }

  /* -----------------------------------------------
     11. ACTIVE NAV LINK ON SCROLL
     ----------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollPos = window.pageYOffset + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  /* -----------------------------------------------
     12. PERFORMANCE: DEBOUNCED RESIZE HANDLER
     ----------------------------------------------- */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
    }, 250);
  }, { passive: true });

});
