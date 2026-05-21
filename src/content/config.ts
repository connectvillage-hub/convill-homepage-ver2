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

export const collections = { magazine };
