/* ============================================================
   ① ② ③ 라벨로 시작하는 필드를 감지 → 위에 그룹 헤더 캡슐 표시
   (admin-custom.css의 .admin-group-start 스타일이 실제 렌더)
   ============================================================ */

(function () {
  const GROUP_NAMES = {
    '①': '페이지 상단 작은 글씨 (eyebrow)',
    '②': '헤더 — 제목 + 부제',
    '③': '대표 이미지',
    '④': '본문 첫 단락 (lead)',
    '⑤': '본문 (템플릿 + 블록)',
    '⑥': '태그 (페이지 하단)',
    '⑦': '🔍 SEO (화면에 안 보임)',
  };
  const NUMS = Object.keys(GROUP_NAMES);

  function styleGroups() {
    document.querySelectorAll('label').forEach((label) => {
      const text = (label.textContent || '').trim();
      const first = text.charAt(0);
      if (!NUMS.includes(first)) return;

      // 가장 가까운 field wrapper 찾기 (label 자체는 제외 — label의 부모부터 검색)
      let wrapper = label.parentElement
        ? label.parentElement.closest('[class*="Widget"], [class*="control"], [class*="Field"]')
        : null;
      // 그래도 못 찾으면 label의 직계 부모를 wrapper로
      if (!wrapper) wrapper = label.parentElement;
      if (!wrapper || wrapper === label) return;
      if (wrapper.dataset.groupMarker === first) return; // 이미 처리됨

      wrapper.dataset.groupMarker = first;
      wrapper.dataset.groupName = GROUP_NAMES[first];

      // 이전 형제 중 마지막 그룹 마커가 같으면 새 그룹 X (같은 그룹 내 두번째 필드)
      let prevMarker = null;
      let sibling = wrapper.previousElementSibling;
      while (sibling) {
        if (sibling.dataset && sibling.dataset.groupMarker) {
          prevMarker = sibling.dataset.groupMarker;
          break;
        }
        sibling = sibling.previousElementSibling;
      }

      if (prevMarker !== first) {
        wrapper.classList.add('admin-group-start');
      } else {
        wrapper.classList.remove('admin-group-start');
      }
    });
  }

  // Decap CMS는 SPA + 동적 폼 mount. 주기적으로 + mutation observer 결합
  setInterval(styleGroups, 600);
  window.addEventListener('load', styleGroups);
  window.addEventListener('hashchange', () => setTimeout(styleGroups, 300));

  console.log('[group-headers] 로드됨. ① ② ③ 자동 그룹 헤더 표시');
})();
