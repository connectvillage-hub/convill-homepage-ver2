import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

const SITE_TITLE = '컨빌디자인 매거진';
const SITE_DESCRIPTION = '교회 인테리어 비용, 예배당 디자인 트렌드, 시공 노하우 등 교회 공간에 대한 인사이트 — 서울·부산·광주 컨빌디자인';

const stripBr = (s) => String(s || '').replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();

export async function GET(context) {
  const magazine = await getCollection('magazine');

  const items = magazine
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
    .map((entry) => ({
      title: stripBr(entry.data.title),
      pubDate: entry.data.publishDate,
      description: entry.data.seo.description,
      link: `/${entry.slug}.html`,
      categories: entry.data.tags || [],
      customData: entry.data.heroImage
        ? `<enclosure url="${context.site}${entry.data.heroImage.replace(/^\//, '')}" type="image/jpeg" />`
        : '',
    }));

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items,
    customData: `<language>ko</language><copyright>© 컨빌디자인</copyright>`,
    stylesheet: false,
  });
}
