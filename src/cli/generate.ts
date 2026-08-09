import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import type { FilelistItem } from '../core/filelist-nav'

export interface GenerateNavOptions {
  /** File output, default '<folderPath>/nav.json' */
  out?: string
  /** Glob pattern lọc file, chưa dùng — để dành */
  pattern?: string
}

interface ParsedFile {
  absPath: string
  relPath: string
  title: string
  order?: number
}

function parseFrontmatterAndTitle(content: string, filename: string): { title: string; order?: number } {
  let title: string | undefined
  let order: number | undefined

  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (frontmatterMatch) {
    const lines = frontmatterMatch[1].split('\n')
    for (const line of lines) {
      const titleMatch = line.match(/^title:\s*["']?(.*?)["']?\s*$/)
      if (titleMatch) title = titleMatch[1].trim()

      const orderMatch = line.match(/^order:\s*(\d+)\s*$/)
      if (orderMatch) order = parseInt(orderMatch[1], 10)
    }
  }

  if (!title) {
    const h1Match = content.match(/^#\s+(.+)$/m)
    if (h1Match) {
      title = h1Match[1].trim()
    }
  }

  if (!title) {
    title = path.basename(filename, '.md')
  }

  return { title, order }
}

/**
 * generateNav
 *
 * 1. Quét đệ quy `folderPath` để lấy danh sách file .md
 * 2. Đọc frontmatter (title, order) hoặc H1 `# title`
 * 3. Sắp xếp file theo order / tên file (natural sort)
 * 4. Build FilelistItem[] ({ text, link })
 * 5. Ghi kết quả ra file `out` (mặc định `<folderPath>/nav.json`)
 *
 * @param folderPath - đường dẫn folder chứa docs, ví dụ "docs/"
 */
export async function generateNav(
  folderPath: string,
  options: GenerateNavOptions = {}
): Promise<FilelistItem[]> {
  const { out = path.join(folderPath, 'nav.json') } = options

  const cwd = process.cwd()
  const absFolder = path.resolve(cwd, folderPath)

  const entries = await readdir(absFolder, { recursive: true, withFileTypes: true })

  const parsedFiles: ParsedFile[] = []

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md') || entry.name.startsWith('.')) {
      continue
    }

    const parentDir = entry.parentPath || (entry as any).path || absFolder
    const absPath = path.join(parentDir, entry.name)
    const relPath = path.relative(cwd, absPath).replace(/\\/g, '/')

    try {
      const content = await readFile(absPath, 'utf-8')
      const { title, order } = parseFrontmatterAndTitle(content, entry.name)
      parsedFiles.push({ absPath, relPath, title, order })
    } catch {
      parsedFiles.push({
        absPath,
        relPath,
        title: path.basename(entry.name, '.md'),
      })
    }
  }

  parsedFiles.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return a.relPath.localeCompare(b.relPath, undefined, { numeric: true, sensitivity: 'base' })
  })

  const navItems: FilelistItem[] = parsedFiles.map((f) => ({
    text: f.title,
    link: `/${f.relPath}`,
  }))

  const absOut = path.resolve(cwd, out)
  await mkdir(path.dirname(absOut), { recursive: true })
  await writeFile(absOut, JSON.stringify(navItems, null, 2), 'utf-8')

  return navItems
}

