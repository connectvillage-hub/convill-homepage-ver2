/* ============================================================
   새 entry 생성 시 ID 필드 자동 채움
   - 컬렉션 목록 화면 진입 시: 각 항목 [NN]에서 max ID 기억 (localStorage)
   - 새 entry 생성 화면 진입 시: max+1을 ID 필드에 자동 입력
   ============================================================ */

(function () {
  // 컬렉션 목록 화면에서 max ID 기억
  function rememberMaxId() {
    const m = location.hash.match(/^#\/collections\/([^/?]+)$/);
    if (!m) return;
    const collection = m[1];

    // DOM이 렌더링되기를 잠시 기다림
    setTimeout(() => {
      // entry summary 텍스트에서 [01] [02] 같은 패턴 추출
      const cardTexts = Array.from(
        document.querySelectorAll('h2, h3, .listCardTitle, [class*="ListCard"], [class*="EntryCard"], [class*="card-title"], a[href*="entries/"]')
      ).map(el => el.textContent || '').join(' ');

      const matches = cardTexts.matchAll(/\[(\d{2})\]/g);
      let max = 0;
      for (const m of matches) {
        const num = parseInt(m[1], 10);
        if (num > max) max = num;
      }

      if (max > 0) {
        localStorage.setItem('admin_maxId_' + collection, String(max));
        console.log('[auto-id] ' + collection + ' max ID: ' + max);
      }
    }, 800);
  }

  // 새 entry 화면에서 ID 자동 입력
  function autoFillNewId() {
    const m = location.hash.match(/^#\/collections\/([^/?]+)\/new$/);
    if (!m) return;
    const collection = m[1];

    const maxStr = localStorage.getItem('admin_maxId_' + collection);
    if (!maxStr) {
      console.log('[auto-id] 저장된 max ID 없음. 컬렉션 목록 페이지를 먼저 방문 필요');
      return;
    }
    const nextId = String(parseInt(maxStr, 10) + 1).padStart(2, '0');

    // 폼이 mount되기를 기다리고, label에 '번호' 포함된 input 찾기
    let attempts = 0;
    const tryFill = () => {
      attempts++;
      if (attempts > 30) {
        console.log('[auto-id] ID 필드 못 찾음 (30회 시도)');
        return;
      }

      // 모든 텍스트 입력 필드 검사
      const inputs = document.querySelectorAll('input[type="text"]');
      let filled = false;

      for (const input of inputs) {
        // 이미 값 있으면 skip
        if (input.value) continue;

        // 부모 또는 형제에서 label 텍스트 확인
        let labelText = '';
        const wrapper = input.closest('div[class*="control"], div[class*="Control"], div[class*="field"], div[class*="Field"], label');
        if (wrapper) {
          labelText = wrapper.textContent || '';
        }

        // label에 "번호" 포함 → ID 필드로 판단
        if (labelText.includes('번호')) {
          // React가 관리하는 input이므로 native setter 사용
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
          ).set;
          nativeInputValueSetter.call(input, nextId);

          // React onChange trigger
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));

          console.log('[auto-id] ' + collection + ' 새 글 ID 자동 입력: ' + nextId);
          filled = true;
          break;
        }
      }

      if (!filled) {
        setTimeout(tryFill, 200);
      }
    };

    setTimeout(tryFill, 500);
  }

  function handleRouteChange() {
    rememberMaxId();
    autoFillNewId();
  }

  // 페이지 첫 로드 + hash 변경 시 동작
  window.addEventListener('load', handleRouteChange);
  window.addEventListener('hashchange', handleRouteChange);

  console.log('[auto-id] 로드됨. 컬렉션 목록 방문 시 max ID 기억 → 새 글 만들 때 자동 입력');
})();
