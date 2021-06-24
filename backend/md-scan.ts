import path from 'path'
import { readdir, readFile } from 'fs/promises'
import MarkdownIt from 'markdown-it'
import matter from 'gray-matter'

const md = MarkdownIt()
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

// date format is 'YYYY-MM-DD'
export async function getPost(filePath: string) {
  const absPath = path.join(postsRoot, filePath)
  const markdown = await readFile(absPath, 'utf8')
  const {
    content,
    data: { date },
  } = matter(markdown)
  return { content: md.render(content), date }
}
