import { defineCollection, z } from 'astro:content';

const magazine = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().regex(/^\d{2}$/), // "01", "02", ... — URL의 magazine_detail{id}.html 패턴
    title: z.string(),
    description: z.string(),
    keywords: z.string().optional(),
    dek: z.string(), // 부제목(서브헤드라인) — 제목 아래 큰 글씨
    lead: z.string(), // 첫 단락 (lead paragraph) — 본문에서 분리되어 강조 처리
    category: z.string(), // 예: "CHURCH SPACE"
    publishDate: z.date(),
    readingTime: z.string(), // 예: "6분 읽기"
    heroImage: z.string(), // 메인 이미지 URL (외부 URL 또는 /images/...)
    heroImageAlt: z.string(),
    ogImage: z.string().optional(), // SNS 공유용 이미지 — 미지정 시 heroImage 사용
    tags: z.array(z.string()),
  }),
});

const portfolio = defineCollection({
  type: 'content',
  schema: z.object({
    // Identification
    id: z.string().regex(/^\d{2}$/), // "01"~"08" — URL: portfolio_detail{id}.html
    displayOrder: z.number(), // 리스트 정렬 순서 (작을수록 위)
    isFeatured: z.boolean().default(false), // 리스트 페이지 상단 featured 섹션 표시 여부

    // Hero & Title
    title: z.string(), // h1 헤드라인 (HTML <br> 포함 가능)
    breadcrumb: z.string(), // breadcrumb 마지막 텍스트

    // Hero meta line (church · scaleInfo · period)
    church: z.string(),
    scaleInfo: z.string(), // 예: "약 50평 예배당 공간 포함"
    period: z.string(),    // 예: "2024"

    // Info bar (5 cells)
    location: z.string(),
    projectType: z.string(),
    scale: z.string(),

    // Intro paragraph
    intro: z.string(),

    // Before & After sliders (1~N pairs)
    beforeAfters: z.array(z.object({
      before: z.string(),
      after: z.string(),
      beforeAlt: z.string(),
      afterAlt: z.string(),
    })).default([]),

    // Gallery — g-pair 단위, 각 pair는 1~2개 figure
    gallery: z.array(z.object({
      images: z.array(z.object({
        src: z.string(),
        alt: z.string().optional(),
        caption: z.string().optional(),
        isFull: z.boolean().default(false),
      })),
    })).default([]),

    // Pastor's testimonial (선택)
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

    // Related projects — 다른 case의 id 배열 (텍스트/이미지는 해당 case의 list* 데이터에서 가져옴)
    relatedIds: z.array(z.string()).default([]),

    // SEO
    description: z.string(),
    keywords: z.string().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogImage: z.string().optional(),

    // List page data (portfolio_list 페이지에서 카드 표시용)
    listImage: z.string(),       // 카드 썸네일 URL
    listTitle: z.string(),       // 카드 제목 (\n으로 줄바꿈)
    listSubtitle: z.string(),    // 카드 sub (church · scale 등)
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
