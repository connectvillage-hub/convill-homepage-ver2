document.addEventListener('DOMContentLoaded', function() {
  
  /* 1. 남은 data-nav 처리 (PC 무료상담 버튼용)
  document.addEventListener('click', function(e) {
    const el = e.target.closest('[data-nav]');
    if (!el) return;
    e.preventDefault();
    const val = el.getAttribute('data-nav');
    if (!val) return;
    const parts = val.split(',');
    // 클릭 시 본진(index.html)의 해당 구역(#)으로 바로 쏴줍니다!
    window.location.href = 'index.html#' + (parts[1] || '');
  }); */

  /* 2. Mobile menu */
  window.openMobileMenu = function() { document.getElementById('mobileMenu').classList.add('open'); };
  window.closeMobileMenu = function() { document.getElementById('mobileMenu').classList.remove('open'); };

  /* 3. Reveal on scroll (화면 등장 애니메이션) */
  let io;
  function triggerReveal() {
    if (io) io.disconnect();
    io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    
    document.querySelectorAll('.reveal').forEach(el => {
      if (!el.classList.contains('in')) io.observe(el);
    });
  }

  /* 4. Portfolio search (포트폴리오 검색 기능) */
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
    // 1. 선택자를 'h3'에서 '.pf-sub'로 변경합니다.
    const subElement = item.querySelector('.pf-sub');
    // 2. 요소가 존재할 경우 텍스트를 가져오고, 없으면 빈 문자열을 할당합니다.
    const targetText = subElement ? subElement.textContent.toLowerCase() : '';

    if (targetText.includes(query)) { 
      item.classList.remove('hidden'); 
      visibleCount++; 
    } else { 
      item.classList.add('hidden'); 
    }
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

  /* 5. Generic Pagination (SNS 페이지네이션) */
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

      const prevBtn = makePgBtn('', true, currentPage === 1);
      prevBtn.classList.add('pg-arrow');
      prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
      prevBtn.onclick = () => { if (currentPage > 1) renderPage(currentPage - 1); };
      pgEl.appendChild(prevBtn);

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

    renderPage(1);
  }

  createPaginator('[data-yt-item]', 'ytGrid', 'ytPagination', 6);
  createPaginator('[data-mag-item]', 'magGrid', 'magPagination', 6);

  /* Init */
  triggerReveal();
});