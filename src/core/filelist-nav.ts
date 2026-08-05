/**
 * filelist-nav — core của vitepress-next-prev-nav
 *
 * Đây là phần "feature 1: khai báo nav" — bạn khai báo các filelist
 * (FilelistItem[]) theo đúng thứ tự đọc, plugin này sẽ tự gắn
 * frontmatter.title / frontmatter.prev / frontmatter.next cho từng trang
 * dựa theo vị trí trong list.
 *
 * Hỗ trợ 2 cách dùng linh hoạt:
 *
 * Cách 1: Dùng như một Vite plugin thông thường (không cần đổi defineConfig gốc)
 *   import { defineConfig } from 'vitepress'
 *   import { FilelistNav } from 'vitepress-next-prev-nav'
 *
 *   export default defineConfig({
 *     vite: {
 *       plugins: [
 *         FilelistNav(myList, myList2),
 *       ]
 *     }
 *   })
 *
 * Cách 2: Dùng qua wrapper defineConfig của plugin (khuyên dùng — xem lưu ý dưới)
 *   import { defineConfig, FilelistNav } from 'vitepress-next-prev-nav'
 *
 *   export default defineConfig({
 *     plugins: [
 *       FilelistNav(myList),
 *     ]
 *   })
 *
 * LƯU Ý quan trọng về Cách 1:
 * Hook configResolved(config) ở dưới giả định Vite config đã resolve có sẵn
 * field `config.vitepress` chứa { transformPageData }. Đây KHÔNG phải API
 * chính thức/được document của VitePress — theo source & doc hiện tại,
 * transformPageData là 1 field khai báo trực tiếp trong defineConfig
 * (.vitepress/config.ts), không phải thứ Vite plugin có thể đọc/ghi qua
 * configResolved. Nếu chạy thử mà nav không lên, nhiều khả năng là do field
 * này, nên dùng Cách 2 (hoặc gọi transformPage() trực tiếp trong
 * transformPageData của config.ts) để chắc ăn.
 */

import { defineConfig as vpDefineConfig } from 'vitepress'
import type { UserConfig } from 'vitepress'

export interface FilelistItem {
  text: string
  link: string
}

interface FilelistNavPlugin {
  name: string
  transformPageData(pageData: any): any
  configResolved?(config: any): void
}

/**
 * Normalize link sang key: bỏ leading slash và .md
 * "/kinhtruongbo/thichminhchau/mucluc.md" → "kinhtruongbo/thichminhchau/mucluc"
 */
function toKey(link: string): string {
  return link.replace(/^\//, '').replace(/\.md$/, '')
}

/**
 * Build lookup: fullPath → { index, list }
 */
function buildLookup(lists: FilelistItem[][]) {
  const lookup = new Map<string, { index: number; list: FilelistItem[] }>()
  for (const list of lists) {
    for (let i = 0; i < list.length; i++) {
      const key = toKey(list[i].link)
      if (key) lookup.set(key, { index: i, list })
    }
  }
  return lookup
}

/**
 * Core transform logic cho từng page
 */
function transformPage(pageData: any, lookup: Map<string, { index: number; list: FilelistItem[] }>) {
  const { relativePath } = pageData
  if (!relativePath) return pageData

  const key = relativePath.replace(/\.md$/, '')
  const match = lookup.get(key)
  if (!match) return pageData

  const { index, list } = match
  pageData.frontmatter = pageData.frontmatter || {}
  pageData.frontmatter.title = list[index].text

  const prev = list[index - 1]
  pageData.frontmatter.prev = prev
    ? { text: prev.text, link: toKey(prev.link) }
    : undefined

  const next = list[index + 1]
  pageData.frontmatter.next = next
    ? { text: next.text, link: toKey(next.link) }
    : undefined

  return pageData
}

/**
 * Tạo plugin nav từ một hoặc nhiều filelist.
 */
export function FilelistNav(...lists: FilelistItem[][]): FilelistNavPlugin {
  const lookup = buildLookup(lists)

  return {
    name: 'vitepress-plugin-filelist-nav',

    // Cách 1: Hook vào quá trình build của VitePress thông qua Vite Plugin configResolved
    configResolved(config: any) {
      const vitepress = config.vitepress
      if (!vitepress) return

      const existingTransform = vitepress.transformPageData
      vitepress.transformPageData = async (pageData: any, ctx: any) => {
        pageData = transformPage(pageData, lookup)
        if (existingTransform) {
          return (await existingTransform(pageData, ctx)) ?? pageData
        }
        return pageData
      }
    },

    // Cách 2: Hỗ trợ nếu dùng qua wrapper defineConfig
    transformPageData(pageData: any) {
      return transformPage(pageData, lookup)
    }
  }
}

/**
 * Wrapper defineConfig cho Cách 2 (nếu người dùng thích dùng top-level plugins)
 */
export function defineConfig(
  config: UserConfig & { plugins?: FilelistNavPlugin[] }
): UserConfig {
  const { plugins = [], ...rest } = config
  const existingTransform = rest.transformPageData

  return vpDefineConfig({
    ...rest,
    transformPageData(pageData, ctx) {
      for (const plugin of plugins) {
        if (plugin.transformPageData) {
          pageData = plugin.transformPageData(pageData) ?? pageData
        }
      }
      if (existingTransform) {
        return existingTransform(pageData, ctx)
      }
      return pageData
    },
  })
}
