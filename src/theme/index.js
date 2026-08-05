import NextPrevNav from './NextPrevNav.vue';
import { useNextPrevNav } from './useNextPrevNav.js';

/**
 * registerNextPrevNav
 *
 * Cách dùng trong .vitepress/theme/index.js của user:
 *
 *   import DefaultTheme from 'vitepress/theme';
 *   import { registerNextPrevNav } from 'vitepress-next-prev-nav/theme';
 *
 *   export default {
 *     extends: DefaultTheme,
 *     enhanceApp({ app }) {
 *       registerNextPrevNav(app);
 *     }
 *   };
 *
 * Sau đó dùng trong layout / component khác:
 *   <NextPrevNav />
 */
export function registerNextPrevNav(app) {
  app.component('NextPrevNav', NextPrevNav);
}

export { NextPrevNav, useNextPrevNav };
