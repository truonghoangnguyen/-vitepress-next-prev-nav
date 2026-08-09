#!/usr/bin/env node

/**
 * CLI entry cho lệnh `gennav`.
 * Usage:
 *   gennav <folder>
 *   gennav docs/ -o nav.json
 */

import path from 'node:path'
import { generateNav } from '../src/cli/generate'

function printHelp() {
  console.log(`
gennav - tự động generate next/prev nav cho VitePress

Usage:
  gennav <folder> [options]

Options:
  -o, --out <file>     File output (default: <folder>/nav.json)
  -h, --help           Hiện help này
`)
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printHelp()
    process.exit(0)
  }

  const targetFolder = args[0]

  const outIndex = args.findIndex((a) => a === '-o' || a === '--out')
  const out = outIndex !== -1 ? args[outIndex + 1] : undefined

  try {
    const navItems = await generateNav(targetFolder, { out })
    const outputFile = path.resolve(process.cwd(), out || path.join(targetFolder, 'nav.json'))
    console.log(`✔ gennav: đã xử lý "${targetFolder}" (${navItems.length} items) -> đã ghi vào "${outputFile}"`)
  } catch (err) {
    console.error('✘ gennav: lỗi khi generate nav')
    console.error(err)
    process.exit(1)
  }
}

main()
