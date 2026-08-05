import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'cli/generate': 'src/cli/generate.ts',
    'bin/gennav': 'bin/gennav.ts',
  },
  format: ['esm'],
  dts: {
    entry: 'src/index.ts',
  },
  clean: true,
  // tsup tự giữ nguyên shebang "#!/usr/bin/env node" nếu file gốc có sẵn
})
