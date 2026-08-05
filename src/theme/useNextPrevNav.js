import { useData } from 'vitepress';
import { computed } from 'vue';

/**
 * useNextPrevNav
 *
 * Đọc thông tin prev/next của trang hiện tại để hiển thị.
 *
 * Giá trị `frontmatter.prev` / `frontmatter.next` ở đây được sinh ra tự động
 * bởi `FilelistNav` (xem src/core/filelist-nav.ts) lúc build site — bạn
 * không cần tự khai báo tay trong từng file .md.
 *
 * Format kỳ vọng:
 *   prev: { text: 'Bài trước', link: '/path/to/prev' }
 *   next: { text: 'Bài sau',   link: '/path/to/next' }
 */
export function useNextPrevNav() {
  const { frontmatter } = useData();

  const prev = computed(() => frontmatter.value.prev ?? null);
  const next = computed(() => frontmatter.value.next ?? null);

  return { prev, next };
}
