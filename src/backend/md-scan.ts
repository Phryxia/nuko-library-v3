import path from 'path'
import { readdir, readFile } from 'fs/promises'
import matter from 'gray-matter'
import showdown from 'showdown'
import showdownHljs from 'showdown-highlight'
import { HeadingAnchorExt } from './renderer'

showdown.setFlavor('github')

const converter = new showdown.Converter({
  extensions: [
    showdownHljs({
      pre: false,
    }),
    HeadingAnchorExt,
  ],
})

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

  const html = converter.makeHtml(content)
  return { content: html, date, tags }
}
