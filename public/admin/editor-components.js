/* ============================================================
   Decap CMS Editor Components
   매거진 본문 안에 GUI 폼으로 입력하는 컴포넌트들
   - BA Slider: 시공 전/후 슬라이더
   - Figure: 사진 + 캡션
   ============================================================ */

/* ============================================================
   1) BA Slider Component (시공 전/후 슬라이더)
   ============================================================ */
CMS.registerEditorComponent({
  id: 'ba-slider',
  label: '🔄 Before / After 슬라이더',
  fields: [
    { name: 'before', label: '시공 전 이미지', widget: 'image' },
    { name: 'after', label: '시공 후 이미지', widget: 'image' },
    { name: 'beforeAlt', label: '시공 전 이미지 설명 (alt, SEO)', widget: 'string' },
    { name: 'afterAlt', label: '시공 후 이미지 설명 (alt, SEO)', widget: 'string' },
  ],

  // 매거진 본문 안에서 기존 BA slider HTML 자동 인식 (정규식)
  pattern: /<div class="ba-slider">[\s\S]*?<span class="ba-tag ba-tag-after">AFTER<\/span>\s*<\/div>/,

  // HTML에서 데이터 추출 (admin 진입 시 폼 자동 채움)
  fromBlock: function (match) {
    var html = match[0];
    var afterMatch = html.match(/class="ba-after"\s+src="([^"]+)"[^>]*alt="([^"]*)"/);
    var beforeMatch = html.match(/class="ba-before"\s+src="([^"]+)"[^>]*alt="([^"]*)"/);
    return {
      after: afterMatch ? afterMatch[1] : '',
      afterAlt: afterMatch ? afterMatch[2] : '',
      before: beforeMatch ? beforeMatch[1] : '',
      beforeAlt: beforeMatch ? beforeMatch[2] : '',
    };
  },

  // 폼 데이터를 HTML로 변환 (저장 시 본문에 들어가는 코드)
  toBlock: function (data) {
    return [
      '<div class="ba-slider">',
      '  <img class="ba-after" src="' + (data.after || '') + '" alt="' + (data.afterAlt || '') + '" />',
      '  <img class="ba-before" src="' + (data.before || '') + '" alt="' + (data.beforeAlt || '') + '" />',
      '  <div class="ba-divider">',
      '    <div class="ba-handle">',
      '      <svg viewBox="0 0 10 16"><polygon points="10,0 0,8 10,16"></polygon></svg>',
      '      <svg viewBox="0 0 10 16"><polygon points="0,0 10,8 0,16"></polygon></svg>',
      '    </div>',
      '  </div>',
      '  <span class="ba-tag ba-tag-before">BEFORE</span>',
      '  <span class="ba-tag ba-tag-after">AFTER</span>',
      '</div>'
    ].join('\n');
  },

  // 본문 에디터 안 미리보기 (코드 대신 카드 형태로 표시)
  toPreview: function (data) {
    return [
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;border:2px dashed #1814F3;padding:12px;margin:12px 0;border-radius:8px;background:#F5F7FA;">',
      '  <div>',
      '    <img src="' + (data.before || '') + '" alt="' + (data.beforeAlt || '') + '" style="width:100%;display:block;border-radius:4px;background:#ddd;" />',
      '    <div style="text-align:center;font-size:11px;background:#e74c3c;color:#fff;padding:4px;margin-top:4px;border-radius:3px;font-weight:600;">BEFORE</div>',
      '  </div>',
      '  <div>',
      '    <img src="' + (data.after || '') + '" alt="' + (data.afterAlt || '') + '" style="width:100%;display:block;border-radius:4px;background:#ddd;" />',
      '    <div style="text-align:center;font-size:11px;background:#27ae60;color:#fff;padding:4px;margin-top:4px;border-radius:3px;font-weight:600;">AFTER</div>',
      '  </div>',
      '</div>'
    ].join('');
  },
});

/* ============================================================
   2) Figure Component (사진 + 캡션)
   ============================================================ */
CMS.registerEditorComponent({
  id: 'figure',
  label: '🖼️ 사진 + 캡션',
  fields: [
    { name: 'src', label: '이미지', widget: 'image' },
    { name: 'alt', label: '이미지 설명 (alt, SEO 필수)', widget: 'string' },
    { name: 'caption', label: '캡션 (사진 아래 설명, 선택)', widget: 'text', required: false },
    { name: 'width', label: '가로 크기 (기본 800)', widget: 'string', required: false, default: '800' },
    { name: 'height', label: '세로 크기 (기본 533)', widget: 'string', required: false, default: '533' },
  ],

  pattern: /<figure>\s*<img[^>]+>\s*(?:<figcaption>[\s\S]*?<\/figcaption>)?\s*<\/figure>/,

  fromBlock: function (match) {
    var html = match[0];
    var imgMatch = html.match(/<img\s+src="([^"]+)"(?:[^>]*?alt="([^"]*)")?(?:[^>]*?width="([^"]*)")?(?:[^>]*?height="([^"]*)")?/);
    var captionMatch = html.match(/<figcaption>([\s\S]*?)<\/figcaption>/);
    return {
      src: imgMatch ? imgMatch[1] : '',
      alt: imgMatch && imgMatch[2] ? imgMatch[2] : '',
      width: imgMatch && imgMatch[3] ? imgMatch[3] : '800',
      height: imgMatch && imgMatch[4] ? imgMatch[4] : '533',
      caption: captionMatch ? captionMatch[1].trim() : '',
    };
  },

  toBlock: function (data) {
    var lines = [
      '<figure>',
      '  <img src="' + (data.src || '') + '" alt="' + (data.alt || '') + '" width="' + (data.width || '800') + '" height="' + (data.height || '533') + '" loading="lazy" />',
    ];
    if (data.caption) {
      lines.push('  <figcaption>' + data.caption + '</figcaption>');
    }
    lines.push('</figure>');
    return lines.join('\n');
  },

  toPreview: function (data) {
    var html = '<figure style="margin:12px 0;padding:12px;border:2px dashed #1814F3;border-radius:8px;background:#F5F7FA;">';
    html += '<img src="' + (data.src || '') + '" alt="' + (data.alt || '') + '" style="width:100%;display:block;border-radius:4px;background:#ddd;" />';
    if (data.caption) {
      html += '<figcaption style="text-align:center;font-size:13px;color:#666;font-style:italic;margin-top:10px;">' + data.caption + '</figcaption>';
    }
    html += '</figure>';
    return html;
  },
});
