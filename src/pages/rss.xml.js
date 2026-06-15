import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

const SITE_TITLE = '컨빌디자인 매거진';
const SITE_DESCRIPTION = '교회 인테리어 비용, 예배당 디자인 트렌드, 시공 노하우 등 교회 공간에 대한 인사이트 — 서울·부산·광주 컨빌디자인';

const stripBr = (s) => String(s || '').replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();

const getImageMime = (src) => {
  const ext = String(src || '').toLowerCase().split('.').pop();
  if (ext === 'png') return 'image/png';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'webp') return 'image/webp';
  return 'image/jpeg';
};

const escapeXml = (s) =>
  String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export async function GET(context) {
  const magazine = await getCollection('magazine');
  const feedUrl = new URL('rss.xml', context.site).toString();

  const items = magazine
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
    .map((entry) => ({
      title: stripBr(entry.data.title),
      pubDate: entry.data.publishDate,
      description: entry.data.seo.description,
      link: `/${entry.slug}.html`,
      categories: entry.data.tags || [],
      customData: entry.data.heroImage
        ? `<enclosure url="${escapeXml(new URL(entry.data.heroImage.replace(/^\//, ''), context.site).toString())}" type="${getImageMime(entry.data.heroImage)}" length="0" />`
        : '',
    }));

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
    items,
    customData: [
      `<language>ko</language>`,
      `<copyright>© 컨빌디자인</copyright>`,
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
      `<ttl>60</ttl>`,
      `<generator>Astro</generator>`,
      `<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    ].join(''),
    stylesheet: false,
  });
}
