import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://convill-homepage-ver2.vercel.app',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file', // outputs /portfolio_list.html instead of /portfolio_list/index.html
  },
});
