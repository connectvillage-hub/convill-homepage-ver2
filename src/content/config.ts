import { defineCollection, z } from 'astro:content';

// 매거진 본문 블록 — Decap CMS에서 한 블록씩 추가하는 단위
const magazineSection = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('heading'),
    level: z.enum(['h2', 'h3']).default('h2'),
    text: z.string(),
  }),
  z.object({
    type: z.literal('paragraph'),
    text: z.string(), // <br> 사용 가능
  }),
  z.object({
    type: z.literal('list'),
    style: z.enum(['ul', 'ol']).default('ul'),
    items: z.array(z.string()),
  }),
  z.object({
    type: z.literal('figure'),
    src: z.string(),
    alt: z.string(),           // SEO 필수
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal('ba'),
    beforeSrc: z.string(),
    beforeAlt: z.string(),     // SEO 필수
    afterSrc: z.string(),
    afterAlt: z.string(),      // SEO 필수
  }),
  z.object({
    type: z.literal('quote'),
    text: z.string(),
  }),
  z.object({
    type: z.literal('link'),
    text: z.string(),
    href: z.string(),
    title: z.string().optional(),
  }),
  // 템플릿 2 전용: 설명+이미지 한 묶음
  z.object({
    type: z.literal('text-image'),
    text: z.string(),
    src: z.string(),
    alt: z.string(),           // SEO 필수
    caption: z.string().optional(),
  }),
]);

const magazine = defineCollection({
  type: 'content',
  schema: z.object({
    // 시스템
    id: z.string().regex(/^\d{2}$/), // "01", "02", ... — 내부 정렬용 (URL은 파일명이 slug로 자동 사용됨)

    // 페이지 상단 메타 (eyebrow)
    category: z.string(), // 예: "CHURCH SPACE"
    publishDate: z.date(),
    readingTime: z.string(), // 예: "6분 읽기"

    // 헤더
    title: z.string(),
    dek: z.string(), // 부제목(서브헤드라인) — 제목 아래 큰 글씨

    // 대표 이미지
    heroImage: z.string(),
    heroImageAlt: z.string(),

    // 본문
    lead: z.string(), // 첫 단락 — 본문에서 분리되어 강조 처리
    sections: z.array(magazineSection).default([]),

    // 페이지 하단
    tags: z.array(z.string()),

    // 화면에 안 보이는 SEO/공유용
    seo: z.object({
      description: z.string(), // 검색 결과 회색 설명 텍스트
      keywords: z.string().optional(),
      coverImage: z.string().optional(), // 매거진 목록 페이지 카드 썸네일 (미지정 시 heroImage)
      ogImage: z.string().optional(),    // 카카오톡/페이스북 공유 미리보기 (미지정 시 heroImage)
    }),
  }),
});

const portfolio = defineCollection({
  type: 'content',
  schema: z.object({
    // 1) 기본 정보
    id: z.string().regex(/^\d{2}$/),
    displayOrder: z.number(),
    isFeatured: z.boolean().default(false),

    // 2) 교회 정보 (한 곳에서 입력, 여러 곳에 자동 표시)
    church: z.object({
      name: z.string(),
      location: z.string(),
      projectType: z.string(),
      scale: z.string(),
      period: z.string(),
    }),

    // 3) 헤더 (페이지 상단)
    heading: z.object({
      title: z.string(),       // h1 (HTML <br> 포함 가능)
      breadcrumb: z.string(),  // breadcrumb 마지막 텍스트
    }),

    // 4) 본문 콘텐츠
    content: z.object({
      intro: z.string(),
      beforeAfters: z.array(z.object({
        before: z.string(),
        after: z.string(),
        beforeAlt: z.string(),
        afterAlt: z.string(),
      })).default([]),
      gallery: z.array(z.object({
        images: z.array(z.object({
          src: z.string(),
          alt: z.string().optional(),
          caption: z.string().optional(),
          isFull: z.boolean().default(false),
        })),
      })).default([]),
    }),

    // 5) 목회자 후기 (선택)
    testimony: z.object({
      quote: z.string(),
      author: z.string(),
      youtube: z.object({
        url: z.string(),
        title: z.string(),
        thumbnail: z.string(),
        duration: z.string(),
      }).optional(),
    }).optional(),

    // 6) 관련 프로젝트 (다른 case id 배열)
    relatedIds: z.array(z.string()).default([]),

    // 7) SEO (description 필수, 나머지는 자동/선택)
    seo: z.object({
      description: z.string(),
      keywords: z.string().optional(),
      ogTitle: z.string().optional(),        // 미지정 시 heading.title에서 br 제거 자동
      ogDescription: z.string().optional(),  // 미지정 시 description 자동
      ogImage: z.string().optional(),        // 미지정 시 listCard.image 자동
    }),

    // 8) 리스트 카드 (포트폴리오 목록 페이지에 표시)
    listCard: z.object({
      image: z.string(),       // 썸네일 URL
      subtitle: z.string(),    // "광주월성교회 · 50평" 등
      title: z.string().optional(),  // 미지정 시 heading.title에서 br 제거 자동
    }),
  }),
});

const youtube = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string().regex(/^\d{2}$/),       // "01"~"NN"
    displayOrder: z.number(),               // 노출 순서 (작을수록 위)
    url: z.string().url(),                  // YouTube URL
    title: z.string(),                      // 영상 제목
    thumbnail: z.string(),                  // 썸네일 이미지 (예: /images/youtube01.jpg)
    duration: z.string(),                   // 재생 시간 (예: "2:08")
  }),
});

export const collections = { magazine, portfolio, youtube };
