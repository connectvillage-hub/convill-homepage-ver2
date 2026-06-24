import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.xn--9d0bk8u9ljvwbpxvmuh.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file', // outputs /portfolio_list.html instead of /portfolio_list/index.html
  },
});
