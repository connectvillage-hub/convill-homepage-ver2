import { defineCollection, z } from 'astro:content';

const magazine = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().regex(/^\d{2}$/), // "01", "02", ... — 내부 정렬용 (URL은 파일명이 slug로 자동 사용됨)
    title: z.string(),
    description: z.string(),
    keywords: z.string().optional(),
    dek: z.string(), // 부제목(서브헤드라인) — 제목 아래 큰 글씨
    lead: z.string(), // 첫 단락 (lead paragraph) — 본문에서 분리되어 강조 처리
    category: z.string(), // 예: "CHURCH SPACE"
    publishDate: z.date(),
    readingTime: z.string(), // 예: "6분 읽기"
    heroImage: z.string(), // 글 상세 페이지 상단 메인 이미지
    heroImageAlt: z.string(),
    coverImage: z.string().optional(), // 매거진 리스트 카드용 썸네일 (미지정 시 heroImage 사용)
    ogImage: z.string().optional(), // SNS 공유용 이미지 — 미지정 시 heroImage 사용
    tags: z.array(z.string()),
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
