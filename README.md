# vitepress-next-prev-nav

Plugin cho VitePress: tự gắn nav **Next / Prev** từ filelist bạn khai báo
(`FilelistNav`), hiển thị bằng component có sẵn, cộng với CLI `gennav` để
tự generate filelist từ folder.

## Cấu trúc

```
vitepress-next-prev-nav/
├── package.json
├── tsconfig.json
├── tsup.config.ts          # build TS -> dist/ (ESM + .d.ts)
├── bin/
│   └── gennav.ts           # CLI: gennav <folder> -> build ra dist/bin/gennav.js
└── src/
    ├── index.ts            # entry point chính: export FilelistNav, defineConfig
    ├── core/
    │   └── filelist-nav.ts # feature 1: khai báo nav (FilelistNav)
    ├── cli/
    │   └── generate.ts     # feature 2: logic gennav (quét markdown files & generate nav.json)
    └── theme/              # KHÔNG build, ship raw để Vite của site consumer tự xử lý
        ├── index.js        # registerNextPrevNav(app)
        ├── NextPrevNav.vue
        └── useNextPrevNav.js
```

`src/core` và `src/cli`/`bin` là TypeScript, được build qua `tsup` thành
`dist/` (kèm `.d.ts`) trước khi publish. `src/theme` giữ nguyên JS + `.vue`
thô — không cần build vì site dùng package này (VitePress/Vite) sẽ tự
compile `.vue` lúc họ build site.

## 1. Khai báo nav — `FilelistNav` (đã xong)

Trong `.vitepress/config.ts` của site dùng package này:

```ts
import { defineConfig, FilelistNav } from 'vitepress-next-prev-nav'

const myList = [
  { text: 'Mục lục', link: '/kinhtruongbo/thichminhchau/mucluc' },
  { text: 'Bài 1', link: '/kinhtruongbo/thichminhchau/bai-1' },
  { text: 'Bài 2', link: '/kinhtruongbo/thichminhchau/bai-2' },
]

export default defineConfig({
  // ...config khác
  plugins: [
    FilelistNav(myList),
  ],
})
```

> Dùng `defineConfig` wrapper của package (Cách 2) — **không** dùng cách hook
> qua `vite.plugins` + `configResolved` (Cách 1 trong code), vì cách đó dựa
> vào field `config.vitepress` không phải API chính thức của VitePress, dễ
> không hoạt động tuỳ version. Xem chi tiết trong comment đầu file
> `src/core/filelist-nav.ts`.

`FilelistNav` tự gắn `frontmatter.title` / `frontmatter.prev` / `frontmatter.next`
cho mỗi trang có trong list, dựa theo vị trí của trang đó trong list.

## 2. Hiển thị nav (UI có sẵn, đọc từ frontmatter do FilelistNav sinh ra)

Trong `.vitepress/theme/index.js`:

```js
import DefaultTheme from 'vitepress/theme'
import { registerNextPrevNav } from 'vitepress-next-prev-nav/theme'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    registerNextPrevNav(app)
  }
}
```

Rồi dùng trong layout (hoặc override `doc-after` slot):

```vue
<NextPrevNav />
```

Component đọc đúng `frontmatter.prev` / `frontmatter.next` mà `FilelistNav`
vừa sinh ra ở bước 1 — không cần khai báo gì thêm trong từng file `.md`.

> Lưu ý nhỏ: `FilelistNav` đang lưu `link` qua `toKey()` (bỏ leading `/`).
> Nếu dùng trực tiếp giá trị này làm `href` trong component, đường dẫn sẽ
> thành relative link thay vì root-absolute — kiểm tra lại nếu thấy next/prev
> click sai trang khi ở các cấp thư mục khác nhau.

## 3. CLI `gennav`

```bash
gennav docs/
gennav docs/ -o nav.json
```

Tự động quét đệ quy các file `.md` trong folder, đọc frontmatter `title` / `order` (hoặc `# Heading 1`), sắp xếp danh sách và xuất ra file `nav.json` (mặc định) để import vào `FilelistNav`.

## Build & test local trước khi publish

```bash
npm install
npm run build       # tsup -> dist/
npm link
# trong project VitePress muốn test:
npm link vitepress-next-prev-nav
gennav docs/
```

Hoặc đóng gói thử:

```bash
npm pack
```
