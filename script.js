// =============================================
//  TOP 10 QUY NHƠN – MAIN SCRIPT
// =============================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- Hamburger Menu Toggle ----
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      navMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (navMenu.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7.5px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7.5px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // ---- Mobile dropdown toggles ----
  const hasDropdowns = document.querySelectorAll('.has-dropdown');
  if (window.innerWidth <= 768) {
    hasDropdowns.forEach(item => {
      const link = item.querySelector('a');
      const dropdown = item.querySelector('.dropdown');
      if (link && dropdown) {
        dropdown.style.display = 'none';
        link.addEventListener('click', function (e) {
          e.preventDefault();
          const isOpen = dropdown.style.display === 'block';
          // Close all
          document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
          dropdown.style.display = isOpen ? 'none' : 'block';
        });
      }
    });
  }

  // ---- Scroll to Top ----
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Sticky header shadow on scroll ----
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        siteHeader.style.boxShadow = '0 4px 20px rgba(0,0,0,0.14)';
      } else {
        siteHeader.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
      }
    });
  }

  // ---- Active nav highlighting ----
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
      link.addEventListener('click', function () {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    }
  });

  // ---- Search input ----
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function () {
      const q = searchInput.value.trim();
      if (q) {
        alert('Tìm kiếm: "' + q + '"');
      }
    });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        searchBtn.click();
      }
    });
  }

  // ---- Lazy load animation on scroll ----
  const animateOnScroll = function () {
    const elements = document.querySelectorAll('.cat-card, .article-row, .popular-card');
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  };

  // Initial state for animated elements
  document.querySelectorAll('.cat-card, .article-row, .popular-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Run on load

  // ---- Topbar marquee effect ----
  const topbarText = document.querySelector('.topbar-text');
  if (topbarText) {
    topbarText.style.overflow = 'hidden';
  }

  // ---- Card click ripple ----
  // Removed e.preventDefault() to allow real page navigation on card banners

  console.log('Top 10 Quy Nhơn website loaded successfully ✅');
});
