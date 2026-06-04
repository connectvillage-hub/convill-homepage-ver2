/* ============================================================
   Decap CMS Preview Templates
   - Admin 우측에 실제 사이트와 비슷한 미리보기 표시
   - React hyperscript (h) 사용
   ============================================================ */

const h = window.h;
const React = window.React;

/* === 헬퍼 === */
const stripBr = (s) => (s || '').replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();

/* ============================================================
   Portfolio Preview
   ============================================================ */
const PortfolioPreview = ({ entry, widgetFor }) => {
  const dataJS = entry.getIn(['data']).toJS();
  const data = dataJS || {};
  const church = data.church || {};
  const heading = data.heading || {};
  const content = data.content || {};
  const testimony = data.testimony;
  const listCard = data.listCard || {};

  const heroBg = listCard.image
    ? `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.55)), url('${listCard.image}')`
    : 'linear-gradient(135deg, #1a3a5f, #2a5d8f)';

  return h('div', { id: 'page-pf-detail', className: `case${data.id || '00'}`, style: { fontFamily: 'Pretendard, sans-serif', background: '#fff' } },

    /* Hint Banner */
    h('div', {
      style: {
        background: '#FFF7E6',
        border: '1px solid #FFD980',
        padding: '10px 16px',
        margin: '12px 16px',
        fontSize: '12px',
        color: '#8B6800',
        borderRadius: '6px',
      },
    }, '👀 이 미리보기는 실제 사이트와 거의 같습니다. 왼쪽에서 입력하면 즉시 반영됩니다.'),

    /* Breadcrumb */
    h('div', { style: { padding: '12px 24px', borderBottom: '1px solid #eee', fontSize: '13px', color: '#777' } },
      h('span', null, 'Home'), h('span', { style: { margin: '0 6px' } }, '/'),
      h('span', null, 'Portfolio'), h('span', { style: { margin: '0 6px' } }, '/'),
      h('span', { style: { color: '#1a1a1a' } }, heading.breadcrumb || '— breadcrumb —'),
    ),

    /* Hero */
    h('section', {
      style: {
        background: heroBg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        padding: '80px 24px',
        textAlign: 'center',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      },
    },
      h('h1', {
        style: {
          fontFamily: 'Noto Serif KR, serif',
          fontSize: '32px',
          fontWeight: 700,
          lineHeight: 1.3,
          letterSpacing: '-0.02em',
          margin: '0 0 16px',
        },
        dangerouslySetInnerHTML: { __html: heading.title || '— 제목 —' },
      }),
      h('div', { style: { fontSize: '13px', opacity: 0.9 } },
        h('span', null, church.name || '— 교회명 —'),
        h('span', { style: { margin: '0 8px' } }, '·'),
        h('span', null, church.scale || '— 규모 —'),
        h('span', { style: { margin: '0 8px' } }, '·'),
        h('span', null, church.period || '— 연도 —'),
      ),
    ),

    /* Info Bar */
    h('section', { style: { borderBottom: '1px solid #eee', padding: '24px' } },
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', maxWidth: '900px', margin: '0 auto' } },
        infoCell('CHURCH', church.name),
        infoCell('LOCATION', church.location),
        infoCell('TYPE', church.projectType),
        infoCell('SCALE', church.scale, true),
        infoCell('PERIOD', church.period),
      ),
    ),

    /* Intro */
    h('section', { style: { padding: '50px 24px', maxWidth: '720px', margin: '0 auto', textAlign: 'center' } },
      h('div', { style: { fontSize: '11px', color: '#999', letterSpacing: '0.2em', marginBottom: '16px' } }, '— PROJECT NOTE'),
      h('p', { style: { fontFamily: 'Noto Serif KR, serif', fontSize: '17px', lineHeight: 1.8, color: '#333' } }, content.intro || '— 소개 텍스트 —'),
    ),

    /* Before/After */
    (content.beforeAfters && content.beforeAfters.length > 0)
      ? h('section', { style: { padding: '40px 24px', background: '#f9f8f6' } },
          h('div', { style: { fontSize: '11px', color: '#999', letterSpacing: '0.2em', marginBottom: '12px', textAlign: 'center' } }, '— BEFORE & AFTER'),
          h('h2', { style: { fontFamily: 'Noto Serif KR, serif', fontSize: '22px', textAlign: 'center', marginBottom: '24px' } }, '시공 전후 비교'),
          content.beforeAfters.map((ba, i) =>
            h('div', { key: i, style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxWidth: '720px', margin: '0 auto 24px' } },
              imgBox(ba.before, 'BEFORE', '#e74c3c'),
              imgBox(ba.after, 'AFTER', '#27ae60'),
            )
          ),
        )
      : null,

    /* Gallery */
    (content.gallery && content.gallery.length > 0)
      ? h('section', { style: { padding: '40px 24px' } },
          h('div', { style: { maxWidth: '1100px', margin: '0 auto' } },
            content.gallery.map((pair, pi) =>
              h('div', { key: pi, style: { display: 'grid', gridTemplateColumns: pair.images && pair.images[0] && pair.images[0].isFull ? '1fr' : 'repeat(' + (pair.images || []).length + ', 1fr)', gap: '16px', marginBottom: '24px' } },
                (pair.images || []).map((img, ii) =>
                  h('figure', { key: ii, style: { margin: 0 } },
                    h('div', {
                      style: {
                        backgroundImage: img.src ? `url('${img.src}')` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: '#eee',
                        aspectRatio: '4/3',
                        borderRadius: '4px',
                      },
                    }),
                    img.caption ? h('figcaption', { style: { fontSize: '12px', color: '#777', marginTop: '8px', fontStyle: 'italic' } }, img.caption) : null,
                  )
                ),
              )
            ),
          ),
        )
      : null,

    /* Testimony */
    (testimony && testimony.quote)
      ? h('section', { style: { padding: '60px 24px', background: '#1a3a5f', color: '#fff', textAlign: 'center' } },
          h('div', { style: { maxWidth: '720px', margin: '0 auto' } },
            h('div', { style: { fontSize: '11px', opacity: 0.7, letterSpacing: '0.2em', marginBottom: '16px' } }, "— PASTOR'S WORDS"),
            h('blockquote', { style: { fontFamily: 'Noto Serif KR, serif', fontSize: '18px', fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 16px' } }, `"${testimony.quote}"`),
            h('div', { style: { fontSize: '13px', opacity: 0.8 } }, '— ' + (testimony.author || '— 출처 —')),
          ),
        )
      : null,

    /* CTA placeholder */
    h('section', { style: { padding: '40px 24px', textAlign: 'center', background: '#f4f4f4' } },
      h('div', { style: { fontSize: '12px', color: '#999', marginBottom: '8px' } }, "— LET'S WORK TOGETHER"),
      h('h2', { style: { fontFamily: 'Noto Serif KR, serif', fontSize: '20px', marginBottom: '12px' } }, '우리 교회도, 새로워질 수 있습니다'),
      h('p', { style: { fontSize: '12px', color: '#666', marginBottom: '12px' } }, '— CTA 영역 (실제 사이트에서 무료 상담 버튼 표시) —'),
    ),
  );
};

/* === Helper components === */
function infoCell(label, value, allowHtml) {
  return h('div', { style: { textAlign: 'center', padding: '8px' } },
    h('div', { style: { fontSize: '10px', color: '#999', letterSpacing: '0.15em', marginBottom: '4px' } }, label),
    allowHtml
      ? h('div', { style: { fontSize: '12px', color: '#1a1a1a', fontWeight: 600 }, dangerouslySetInnerHTML: { __html: value || '—' } })
      : h('div', { style: { fontSize: '12px', color: '#1a1a1a', fontWeight: 600 } }, value || '—'),
  );
}

function imgBox(src, label, color) {
  return h('div', {
    style: {
      position: 'relative',
      backgroundImage: src ? `url('${src}')` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#ddd',
      aspectRatio: '4/3',
      borderRadius: '4px',
    },
  }, h('span', {
    style: {
      position: 'absolute',
      top: 8,
      left: 8,
      background: color,
      color: '#fff',
      padding: '4px 10px',
      fontSize: '10px',
      fontWeight: 700,
      borderRadius: '3px',
      letterSpacing: '0.1em',
    },
  }, label));
}

/* ============================================================
   Magazine Section Renderer (sections 배열의 한 블록 → React)
   ============================================================ */
// 엔터(\n)를 <br>로 변환 — admin에서 엔터만 쳐도 줄바꿈되게
const nl2br = (s) => String(s || '').replace(/\r\n|\r|\n/g, '<br>');

// 인라인 마크다운 → HTML (굵게/기울임/링크 + <span> 인라인 HTML 허용)
const renderInline = (s) => {
  const withBr = nl2br(s);
  if (typeof window !== 'undefined' && window.marked && window.marked.parseInline) {
    return window.marked.parseInline(withBr, { breaks: false });
  }
  return withBr;
};

const renderMagazineSection = (section, i) => {
  const t = section.type;
  if (t === 'heading') {
    const Tag = section.level === 'h3' ? 'h3' : 'h2';
    return h(Tag, {
      key: i,
      style: { fontFamily: 'Noto Serif KR, serif', marginTop: '32px', marginBottom: '12px' },
      dangerouslySetInnerHTML: { __html: nl2br(section.text) },
    });
  }
  if (t === 'paragraph') {
    return h('p', { key: i, style: { margin: '0 0 16px' }, dangerouslySetInnerHTML: { __html: renderInline(section.text) } });
  }
  if (t === 'list') {
    const Tag = section.style === 'ol' ? 'ol' : 'ul';
    return h(Tag, { key: i, style: { margin: '0 0 16px', paddingLeft: '24px' } },
      (section.items || []).map((item, j) =>
        h('li', { key: j, style: { marginBottom: '6px' }, dangerouslySetInnerHTML: { __html: renderInline(item) } })
      )
    );
  }
  if (t === 'figure') {
    return h('figure', { key: i, style: { margin: '24px 0', textAlign: 'center' } },
      section.src ? h('img', { src: section.src, alt: section.alt || '', style: { width: '100%', display: 'block' } }) : h('div', { style: { padding: '40px', background: '#f5f5f5', color: '#999' } }, '🖼️ 이미지 미선택'),
      section.caption ? h('figcaption', { style: { fontSize: '13px', color: '#888', marginTop: '8px' }, dangerouslySetInnerHTML: { __html: nl2br(section.caption) } }) : null,
    );
  }
  if (t === 'ba') {
    return h('div', { key: i, style: { margin: '24px 0', display: 'flex', gap: '8px' } },
      h('div', { style: { flex: 1 } },
        h('div', { style: { fontSize: '11px', color: '#999', marginBottom: '4px', letterSpacing: '0.1em' } }, 'BEFORE'),
        section.beforeSrc ? h('img', { src: section.beforeSrc, alt: section.beforeAlt || '', style: { width: '100%', display: 'block' } }) : h('div', { style: { padding: '40px', background: '#f5f5f5', color: '#999', textAlign: 'center' } }, '미선택'),
      ),
      h('div', { style: { flex: 1 } },
        h('div', { style: { fontSize: '11px', color: '#999', marginBottom: '4px', letterSpacing: '0.1em' } }, 'AFTER'),
        section.afterSrc ? h('img', { src: section.afterSrc, alt: section.afterAlt || '', style: { width: '100%', display: 'block' } }) : h('div', { style: { padding: '40px', background: '#f5f5f5', color: '#999', textAlign: 'center' } }, '미선택'),
      ),
    );
  }
  if (t === 'quote') {
    return h('blockquote', {
      key: i,
      style: { borderLeft: '4px solid #ddd', paddingLeft: '16px', margin: '24px 0', color: '#555', fontStyle: 'italic' },
      dangerouslySetInnerHTML: { __html: renderInline(section.text) },
    });
  }
  if (t === 'divider') {
    if (section.style === 'space') {
      return h('div', { key: i, style: { height: '32px' } });
    }
    const borderStyle = section.style === 'dashed' ? 'dashed' : (section.style === 'dotted' ? 'dotted' : 'solid');
    return h('hr', { key: i, style: { border: 'none', borderTop: '1px ' + borderStyle + ' #ddd', margin: '24px 0' } });
  }
  if (t === 'link') {
    return h('p', { key: i, style: { margin: '0 0 16px' } },
      h('a', { href: section.href || '#', title: section.title || '', style: { color: '#1814F3' } }, section.text || '— 링크 —')
    );
  }
  if (t === 'text-image') {
    return h('div', { key: i, style: { margin: '24px 0' } },
      h('p', { style: { margin: '0 0 12px' }, dangerouslySetInnerHTML: { __html: renderInline(section.text) } }),
      h('figure', { style: { margin: 0, textAlign: 'center' } },
        section.src ? h('img', { src: section.src, alt: section.alt || '', style: { width: '100%', display: 'block' } }) : h('div', { style: { padding: '40px', background: '#f5f5f5', color: '#999' } }, '🖼️ 이미지 미선택'),
        section.caption ? h('figcaption', { style: { fontSize: '13px', color: '#888', marginTop: '8px' }, dangerouslySetInnerHTML: { __html: nl2br(section.caption) } }) : null,
      ),
    );
  }
  return null;
};

/* ============================================================
   Magazine Preview (sections 블록 배열 렌더링)
   ============================================================ */
const MagazinePreview = ({ entry }) => {
  const dataJS = entry.getIn(['data']).toJS();
  const data = dataJS || {};
  return h('article', { style: { fontFamily: 'Pretendard, sans-serif', maxWidth: '760px', margin: '0 auto', padding: '40px 24px', background: '#fff' } },
    h('div', { style: { background: '#FFF7E6', padding: '10px', fontSize: '12px', color: '#8B6800', borderRadius: '6px', marginBottom: '24px' } },
      '👀 매거진 글 미리보기 (실시간 반영)'),

    // Header
    h('header', { style: { textAlign: 'center', marginBottom: '32px' } },
      h('div', { style: { fontSize: '12px', color: '#999', letterSpacing: '0.18em', marginBottom: '16px' } },
        (data.category || 'CATEGORY') + ' · ' + (data.readingTime || '— 분 읽기')),
      h('h1', {
        style: { fontFamily: 'Noto Serif KR, serif', fontSize: '32px', lineHeight: 1.3, margin: '0 0 16px' },
        dangerouslySetInnerHTML: { __html: data.title ? nl2br(data.title) : '— 제목 —' },
      }),
      h('p', {
        style: { fontFamily: 'Noto Sans KR, sans-serif', fontSize: '16px', color: '#666', lineHeight: 1.7 },
        dangerouslySetInnerHTML: { __html: data.dek ? nl2br(data.dek) : '— 부제 —' },
      }),
    ),

    // Hero image
    data.heroImage
      ? h('img', { src: data.heroImage, alt: data.heroImageAlt || '', style: { width: '100%', borderRadius: '4px', marginBottom: '32px', display: 'block' } })
      : null,

    // Body: lead + 마크다운 본문 (widgetFor로 렌더링)
    h('div', {
      className: 'mag-body',
      style: { fontFamily: 'Noto Serif KR, serif', fontSize: '17px', lineHeight: 1.9, color: '#333' },
    },
      // Lead 단락 (강조 표시)
      h('p', {
        className: 'lead',
        style: { fontSize: '20px', borderBottom: '1px solid #ddd', paddingBottom: '24px', marginBottom: '32px', fontWeight: 500 },
        dangerouslySetInnerHTML: { __html: data.lead ? nl2br(data.lead) : '— 첫 단락 —' },
      }),

      // sections 블록 배열 렌더링 (template은 스타일 분기용으로만 표시)
      (data.sections && data.sections.length > 0)
        ? data.sections.map(renderMagazineSection)
        : h('div', { style: { padding: '40px', textAlign: 'center', color: '#999', background: '#fafafa', borderRadius: '6px' } },
            '"+ ADD" 버튼으로 본문 블록을 추가하세요 (제목 / 단락 / 사진 / BA슬라이더 / 인용 등)'),
    ),

    // Tags
    (data.tags && data.tags.length > 0)
      ? h('div', { style: { marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #e5e5e5', display: 'flex', flexWrap: 'wrap', gap: '10px' } },
          data.tags.map((tag, i) =>
            h('span', { key: i, style: { background: '#f5f5f5', padding: '7px 14px', borderRadius: '999px', fontSize: '13px', color: '#555' } }, tag)
          ),
        )
      : null,
  );
};

/* ============================================================
   YouTube Preview
   ============================================================ */
const YouTubePreview = ({ entry }) => {
  const dataJS = entry.getIn(['data']).toJS();
  const data = dataJS || {};
  return h('article', {
    style: {
      fontFamily: 'Pretendard, sans-serif',
      maxWidth: '380px',
      margin: '24px auto',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,.08)',
      background: '#fff',
    },
  },
    h('div', { style: { background: '#FFF7E6', padding: '8px', fontSize: '12px', color: '#8B6800', textAlign: 'center' } },
      '👀 유튜브 카드 미리보기'),
    h('div', {
      style: {
        position: 'relative',
        aspectRatio: '16/9',
        background: data.thumbnail ? `url('${data.thumbnail}') center/cover` : '#1a1a1a',
      },
    },
      data.duration
        ? h('span', {
            style: {
              position: 'absolute',
              bottom: 8,
              right: 8,
              background: 'rgba(0,0,0,.8)',
              color: '#fff',
              padding: '3px 8px',
              fontSize: '11px',
              borderRadius: '3px',
            },
          }, data.duration)
        : null,
    ),
    h('div', { style: { padding: '16px' } },
      h('h3', { style: { fontSize: '15px', fontWeight: 600, lineHeight: 1.4, margin: 0 } }, data.title || '— 영상 제목 —'),
    ),
  );
};

/* ============================================================
   Register
   ============================================================ */
CMS.registerPreviewTemplate('portfolio', PortfolioPreview);
CMS.registerPreviewTemplate('magazine', MagazinePreview);
CMS.registerPreviewTemplate('youtube', YouTubePreview);

/* 사이트 CSS 일부 적용 (선택 — common.css 통째로는 admin UI 깨질 수 있음) */
CMS.registerPreviewStyle('/admin/preview-styles.css');
