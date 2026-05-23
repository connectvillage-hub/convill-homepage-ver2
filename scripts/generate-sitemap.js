import { readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'https://convill-homepage-ver2.vercel.app';
const DIST = join(__dirname, '..', 'dist');

const PRIORITY_RULES = [
  { match: f => f === 'index.html',                priority: '1.0', changefreq: 'weekly'  },
  { match: f => f === 'portfolio_list.html',       priority: '0.9', changefreq: 'weekly'  },
  { match: f => f.startsWith('portfolio_detail'),  priority: '0.8', changefreq: 'monthly' },
  { match: f => f === 'youtube.html',              priority: '0.6', changefreq: 'weekly'  },
  { match: f => f === 'magazine.html',             priority: '0.6', changefreq: 'monthly' },
  { match: f => f.startsWith('magazine_detail'),   priority: '0.7', changefreq: 'monthly' },
  { match: ()  => true,                            priority: '0.5', changefreq: 'monthly' },
];

// sitemap.xml 자체와 에러 페이지는 sitemap에 포함하지 않음
const EXCLUDE = new Set(['404.html', 'sitemap.xml']);

const today = new Date().toISOString().split('T')[0];

const htmlFiles = readdirSync(DIST)
  .filter(f => f.endsWith('.html'))
  .filter(f => !EXCLUDE.has(f))
  .sort();

const urls = htmlFiles.map(file => {
  const rule = PRIORITY_RULES.find(r => r.match(file));
  const loc = file === 'index.html'
    ? `${SITE_URL}/`
    : `${SITE_URL}/${file}`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${rule.changefreq}</changefreq>
    <priority>${rule.priority}</priority>
  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8');
console.log(`sitemap.xml generated in dist/ with ${htmlFiles.length} URLs`);
