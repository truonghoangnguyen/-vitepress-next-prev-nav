import test from 'node:test'
import assert from 'node:assert/strict'
import { FilelistNav } from '../dist/index.js'

test('FilelistNav correctly sets absolute links for frontmatter prev and next', () => {
  const myList = [
    { text: 'Mục Lục', link: '/jill-brain/vi/meta/mucluc.md' },
    { text: 'LỜI TỰA', link: '/jill-brain/vi/01-preface.md' },
    { text: 'CÂU CHUYỆN CỦA TÔI VÀ BỘ NÃO CỦA CHÚNG TA', link: '/jill-brain/vi/02-mystory-and-our-brain.md' }
  ]

  const plugin = FilelistNav(myList)

  // Test page 1: /jill-brain/vi/meta/mucluc.md
  const page1 = plugin.transformPageData({
    relativePath: 'jill-brain/vi/meta/mucluc.md',
    frontmatter: {}
  })

  assert.equal(page1.frontmatter.title, 'Mục Lục')
  assert.equal(page1.frontmatter.prev, undefined)
  assert.deepEqual(page1.frontmatter.next, {
    text: 'LỜI TỰA',
    link: '/jill-brain/vi/01-preface'
  })

  // Test page 2: /jill-brain/vi/01-preface.md
  const page2 = plugin.transformPageData({
    relativePath: 'jill-brain/vi/01-preface.md',
    frontmatter: {}
  })

  assert.equal(page2.frontmatter.title, 'LỜI TỰA')
  assert.deepEqual(page2.frontmatter.prev, {
    text: 'Mục Lục',
    link: '/jill-brain/vi/meta/mucluc'
  })
  assert.deepEqual(page2.frontmatter.next, {
    text: 'CÂU CHUYỆN CỦA TÔI VÀ BỘ NÃO CỦA CHÚNG TA',
    link: '/jill-brain/vi/02-mystory-and-our-brain'
  })
})
