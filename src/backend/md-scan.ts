import path from 'path'
import { readdir, readFile } from 'fs/promises'
import MarkdownIt from 'markdown-it'
import matter from 'gray-matter'
import hljs from 'highlight.js'
import { addCustomRenderer } from './renderer'

// 하이라이트 js 연동
const md: MarkdownIt = MarkdownIt({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(str, { language: lang }).value
        }</code></pre>`
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  },
})
addCustomRenderer(md)

const postsRoot = path.join(process.cwd(), 'posts')

export async function getAllPostsPaths(): Promise<string[]> {
  const result: string[] = []

  // 재귀적으로 돌면서 모든 파일들의 경로를 수집한다.
  async function traverse(dirPath: string): Promise<void> {
    const absPath = path.join(postsRoot, dirPath)
    const files = await readdir(absPath, { withFileTypes: true })

    const promises = files.map((file) => {
      const filePath = path.join(dirPath, file.name)

      if (file.isDirectory()) {
        return traverse(filePath)
      } else {
        result.push(filePath)
        return
      }
    })

    await Promise.all(promises)
  }

  await traverse('')
  return result
}

// date format is 'YYYY-MM-DD hh:mm'
export async function getPost(filePath: string) {
  const absPath = path.join(postsRoot, filePath)
  const markdown = await readFile(absPath, 'utf8')
  const {
    content,
    data: { date = new Date().toString(), tags = [] },
  } = matter(markdown)
  return { content: md.render(content), date, tags }
}
