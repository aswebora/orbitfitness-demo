// assets/main.js
// Initializes animations, icons, and handles the mobile menu toggle across all pages

(function () {
  function initAOS() {
    if (window.AOS && typeof window.AOS.init === 'function') {
      window.AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
      });
    }

  // Floating WhatsApp chat bubble
  function initWhatsappBubble() {
    var existing = document.getElementById('wa-bubble');
    if (existing) return;
    var link = document.createElement('a');
    link.id = 'wa-bubble';
    link.href = 'https://wa.me/919876543210';
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', 'Chat on WhatsApp');
    link.style.cssText = 'position:fixed;right:16px;bottom:16px;width:56px;height:56px;border-radius:50%;background:#22c55e;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,0.3);z-index:9998;transition:transform .2s ease;';
    link.onmouseenter = function(){ link.style.transform = 'scale(1.05)'; };
    link.onmouseleave = function(){ link.style.transform = 'scale(1)'; };
    var icon = document.createElement('span');
    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 12a9.5 9.5 0 0 1-13.66 8.45L2.5 21.5l1.05-5.34A9.5 9.5 0 1 1 21.5 12z"></path><path d="M8 12a5 5 0 0 0 8 4"></path><path d="M15 9l-3 3"></path></svg>';
    link.appendChild(icon);
    document.body.appendChild(link);
  }

  // Simple Lightbox for gallery links
  function initLightbox() {
    var links = document.querySelectorAll('a.gallery-item');
    if (!links.length) return;

    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);display:none;align-items:center;justify-content:center;z-index:9999;padding:16px;';
    var img = document.createElement('img');
    img.style.cssText = 'max-width:90vw;max-height:85vh;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.5)';
    overlay.appendChild(img);
    overlay.addEventListener('click', function(){ overlay.style.display = 'none'; document.body.style.overflow = ''; });
    document.body.appendChild(overlay);

    links.forEach(function(a){
      a.addEventListener('click', function(e){
        // Prefer href as large image
        var href = a.getAttribute('href');
        if (href && href.match(/^https?:\/\//)) {
          e.preventDefault();
          img.src = href;
          overlay.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }
  }

  // Chat: Crisp loader (set window.CRISP_WEBSITE_ID = 'YOUR-ID' to enable)
  function initChat() {
    try {
      var CRISP_ID = window.CRISP_WEBSITE_ID || 'YOUR-CRISP-WEBSITE-ID';
      if (!CRISP_ID || /YOUR-CRISP-WEBSITE-ID/.test(CRISP_ID)) {
        if (window.console && console.info) {
          console.info('Crisp chat not initialized: set window.CRISP_WEBSITE_ID to your Crisp Website ID.');
        }
        return; // Skip until a real ID is provided
      }
      window.$crisp = window.$crisp || [];
      window.CRISP_WEBSITE_ID = CRISP_ID;
      var s = document.createElement('script');
      s.src = 'https://client.crisp.chat/l.js';
      s.async = true;
      s.crossOrigin = 'anonymous';
      document.head.appendChild(s);
      // Provide simple page context for targeting
      try { window.$crisp.push(["set", "session:segments", [["page:" + location.pathname]]]); } catch(_) {}
    } catch (e) { /* ignore */ }
  }

  function initFeather() {
    if (window.feather && typeof window.feather.replace === 'function') {
      window.feather.replace();
    }
  }

  function initMobileMenu() {
    var toggleBtn = document.getElementById('menu-toggle');
    var mobileMenu = document.getElementById('mobile-menu');

    if (toggleBtn && mobileMenu) {
      var LS_KEY = 'mobileMenuOpen';

      function isMobileViewport() {
        return window.matchMedia('(max-width: 767.98px)').matches;
      }

      function setMenuOpen(open) {
        mobileMenu.classList.toggle('hidden', !open);
        try { localStorage.setItem(LS_KEY, open ? '1' : '0'); } catch (_) {}
      }

      function getStoredOpen() {
        try { return localStorage.getItem(LS_KEY) === '1'; } catch (_) { return false; }
      }

      // Restore last state on load (only for mobile viewport)
      if (isMobileViewport() && getStoredOpen()) {
        setMenuOpen(true);
      }

      // Toggle on button click
      toggleBtn.addEventListener('click', function () {
        var willOpen = mobileMenu.classList.contains('hidden');
        setMenuOpen(willOpen);
      });

      // Close on link click (for better UX)
      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          setMenuOpen(false);
        });
      });

      // Close on outside click
      document.addEventListener('click', function (e) {
        var target = e.target;
        var clickedInsideMenu = mobileMenu.contains(target);
        var clickedToggle = toggleBtn.contains(target);
        if (!clickedInsideMenu && !clickedToggle && !mobileMenu.classList.contains('hidden') && isMobileViewport()) {
          setMenuOpen(false);
        }
      }, { capture: true });

      // Close on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden') && isMobileViewport()) {
          setMenuOpen(false);
        }
      });

      // Handle viewport changes: hide menu and clear stored state on desktop
      window.addEventListener('resize', function () {
        if (!isMobileViewport()) {
          // Ensure menu is hidden on desktop collapsed menu and clear stored state
          mobileMenu.classList.add('hidden');
          try { localStorage.removeItem(LS_KEY); } catch (_) {}
        } else {
          // On returning to mobile, restore if it was open
          if (getStoredOpen()) {
            mobileMenu.classList.remove('hidden');
          }
        }
      });
    }
  }

  function initSmoothScroll() {
    // Smooth-scroll for same-page anchors
    var reduceMotion = false;
    try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) {}

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId && targetId.length > 1) {
          var target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
          }
        }
      }, { passive: true });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initAOS();
    initFeather();
    initMobileMenu();
    initSmoothScroll();
    initChat();
    initLightbox();
    initWhatsappBubble();

    // Register Service Worker for PWA (if supported and not on file: protocol)
    try {
      if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
        navigator.serviceWorker.register('/sw.js');
      }
    } catch (e) { /* no-op */ }
  });
})();
