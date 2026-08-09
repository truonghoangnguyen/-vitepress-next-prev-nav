/**
 * vitepress-next-prev-nav — entry point chính
 *
 * Đây là feature 1 (khai báo nav): FilelistNav + defineConfig wrapper.
 * Feature 2 (CLI `gennav`) nằm ở bin/gennav.ts + src/cli/generate.ts.
 * Phần UI hiển thị (NextPrevNav.vue) nằm ở subpath riêng:
 *   import { registerNextPrevNav } from 'vitepress-next-prev-nav/theme'
 */

export { FilelistNav, defineConfig } from './core/filelist-nav'
export type { FilelistItem, FilelistInput } from './core/filelist-nav'
