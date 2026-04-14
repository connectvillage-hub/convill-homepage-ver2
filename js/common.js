document.addEventListener('DOMContentLoaded', function() {
  /* ===== Page routing ===== */
  function showPage(pageId, anchorId) {
    // 1. 외부 페이지 즉시 이동 처리 (모바일 족보 꼬임 해결!)
    if (pageId === 'page-portfolio' || pageId === 'page-pf-detail' || (pageId === 'page-main' && anchorId === 'portfolio')) {
      window.location.href = 'portfolio_list.html';
      return;
    }
    if (pageId === 'page-sns-youtube') {
      window.location.href = 'youtube.html';
      return;
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show target page
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
      // Re-trigger reveal animations for newly visible page
      triggerReveal();
    }

    // Scroll to anchor or top
    if (anchorId) {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        else { window.scrollTo({ top: 0, behavior: 'smooth' }); }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update nav active state
    updateNavActive(pageId, anchorId);
  }

  // HTML 인라인 이벤트(onclick 등)에서 호출할 수 있도록 전역에 노출
  window.showPage = showPage;

  function updateNavActive(pageId, anchorId) {
    document.querySelectorAll('.nav ul .nav-link').forEach(el => {
      el.classList.remove('nav-active');
    });

    let idx = -1;

    // pageId와 anchorId 조합으로 정확한 족보(인덱스) 찾기
    if (pageId === 'page-main') {
      if (!anchorId || anchorId === 'about') idx = 0;       // 소개
      else if (anchorId === 'portfolio') idx = 1;           // 포트폴리오
      else if (anchorId === 'paths') idx = 2;               // 서비스
      else if (anchorId === 'process') idx = 3;             // 프로세스
      else if (anchorId === 'faq') idx = 5;                 // FAQ
    } else if (pageId === 'page-portfolio') {
      idx = 1;                                              // 포트폴리오
    } else if (pageId === 'page-sns-youtube' || pageId === 'page-sns-magazine') {
      idx = 4;                                              // SNS
    }

    const navLinks = document.querySelectorAll('.nav ul .nav-link');
    if (idx !== -1 && navLinks[idx]) {
      navLinks[idx].classList.add('nav-active');
    }
  }

  /* Attach click handlers to all [data-nav] elements */
  document.addEventListener('click', function(e) {
    const el = e.target.closest('[data-nav]');
    if (!el) return;
    e.preventDefault();
    const val = el.getAttribute('data-nav');
    if (!val) return;
    const parts = val.split(',');
    showPage(parts[0], parts[1]);
  });

  /* ===== Mobile menu ===== */
  window.openMobileMenu = function() { document.getElementById('mobileMenu').classList.add('open'); };
  window.closeMobileMenu = function() { document.getElementById('mobileMenu').classList.remove('open'); };

  /* ===== Reveal on scroll ===== */
  let io;
  function triggerReveal() {
    if (io) io.disconnect();
    io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.page.active .reveal').forEach(el => {
      if (!el.classList.contains('in')) io.observe(el);
    });
  }

  /* ===== Portfolio search ===== */
  const searchInput = document.getElementById('pfSearch');
  const searchClear = document.getElementById('pfSearchClear');
  const searchWrap = document.querySelector('.search-wrap');

  function applySearch(q) {
    const items = document.querySelectorAll('#pfGrid .pf-item');
    const empty = document.getElementById('emptyState');
    const query = q.trim().toLowerCase();
    if (query.length < 2) {
      items.forEach(item => item.classList.remove('hidden'));
      if (empty) empty.style.display = 'none';
      return;
    }
    let visibleCount = 0;
    items.forEach(item => {
      const title = item.querySelector('h3') ? item.querySelector('h3').textContent.toLowerCase() : '';
      if (title.includes(query)) { item.classList.remove('hidden'); visibleCount++; }
      else { item.classList.add('hidden'); }
    });
    if (empty) empty.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (searchWrap) searchWrap.classList.toggle('has-value', val.length > 0);
      applySearch(val);
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) { searchInput.value = ''; searchInput.focus(); }
      if (searchWrap) searchWrap.classList.remove('has-value');
      applySearch('');
    });
  }

  /* ===== Generic Pagination ===== */
  function createPaginator(itemSelector, gridId, paginationId, perPage) {
    const grid = document.getElementById(gridId);
    const pgEl = document.getElementById(paginationId);
    if (!grid || !pgEl) return;

    const allItems = Array.from(grid.querySelectorAll(itemSelector));
    if (allItems.length === 0) return;

    const totalPages = Math.ceil(allItems.length / perPage);
    let currentPage = 1;

    function renderPage(page) {
      currentPage = page;
      allItems.forEach((item, i) => {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        item.style.display = (i >= start && i < end) ? '' : 'none';
        // fade-in animation
        if (i >= start && i < end) {
          item.style.opacity = '0';
          item.style.transform = 'translateY(16px)';
          item.style.transition = 'opacity .45s ease, transform .45s ease';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'none';
            });
          });
        }
      });
      renderPagination();
    }

    function renderPagination() {
      pgEl.innerHTML = '';

      // Prev arrow
      const prevBtn = makePgBtn('', true, currentPage === 1);
      prevBtn.classList.add('pg-arrow');
      prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
      prevBtn.onclick = () => { if (currentPage > 1) renderPage(currentPage - 1); };
      pgEl.appendChild(prevBtn);

      // Page numbers (smart: show up to 5, with dots)
      const pages = smartPages(currentPage, totalPages);
      let prevWasDots = false;
      pages.forEach(p => {
        if (p === '…') {
          if (!prevWasDots) {
            const dots = document.createElement('div');
            dots.className = 'pg-dots';
            dots.textContent = '…';
            pgEl.appendChild(dots);
            prevWasDots = true;
          }
        } else {
          prevWasDots = false;
          const btn = makePgBtn(p, false, false);
          if (p === currentPage) btn.classList.add('pg-active');
          btn.onclick = () => renderPage(p);
          pgEl.appendChild(btn);
        }
      });

      // Next arrow
      const nextBtn = makePgBtn('', true, currentPage === totalPages);
      nextBtn.classList.add('pg-arrow');
      nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
      nextBtn.onclick = () => { if (currentPage < totalPages) renderPage(currentPage + 1); };
      pgEl.appendChild(nextBtn);
    }

    function makePgBtn(label, isArrow, disabled) {
      const btn = document.createElement('button');
      btn.className = 'pg-btn' + (disabled ? ' pg-disabled' : '');
      if (!isArrow) btn.textContent = label;
      return btn;
    }

    function smartPages(cur, total) {
      if (total <= 7) return Array.from({length: total}, (_, i) => i + 1);
      const pages = [];
      pages.push(1);
      if (cur > 3) pages.push('…');
      for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) pages.push(p);
      if (cur < total - 2) pages.push('…');
      pages.push(total);
      return pages;
    }

    // Init
    renderPage(1);
  }

  // Init paginators after page is shown
  function initSNSPaginators() {
    createPaginator('[data-yt-item]', 'ytGrid', 'ytPagination', 6);
    createPaginator('[data-mag-item]', 'magGrid', 'magPagination', 6);
  }

  // Patch showPage to init paginators when SNS pages are shown
  const _origShowPage = window.showPage;
  window.showPage = function(pageId, anchorId) {
    _origShowPage(pageId, anchorId);
    if (pageId === 'page-sns-youtube' || pageId === 'page-sns-magazine') {
      setTimeout(initSNSPaginators, 50);
    }
  };
  
/* ===== Init & Route Detection ===== */
  // 현재 브라우저 주소를 확인하여 적절한 메뉴 활성화 (레이더 가동!)
  const currentUrl = window.location.href;
  const currentHash = window.location.hash.replace('#', ''); // 주소창의 # 뒤에 있는 글자(예: paths, faq)만 가져오기

  if (currentUrl.includes('portfolio')) {
    updateNavActive('page-portfolio');
  } else if (currentUrl.includes('youtube')) {
    updateNavActive('page-sns-youtube');
  } else {
    // 포트폴리오나 SNS가 아닌 메인 페이지일 때
    if (currentHash) {
      // 1. 외부에서 특정 메뉴(#)를 달고 들어왔다면, 해당 메뉴 켜고 스크롤 이동
      showPage('page-main', currentHash);
    } else {
      // 2. 그냥 쌩으로(index.html) 들어왔다면 기본 '소개' 활성화
      updateNavActive('page-main', 'about');
      triggerReveal();
    }
  }
});