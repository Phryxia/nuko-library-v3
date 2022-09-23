import matter from 'gray-matter'
import { createParserContext } from './parser'

interface ParseResult {
  content: string
  date: string
  tags: string[]
}

export function parseFile(s: string): ParseResult {
  const { content, ...rest } = parseMeta(s)
  const { converter } = createParserContext()
  return { content: converter.makeHtml(content), ...rest }
}

function parseMeta(s: string): ParseResult {
  const {
    content,
    data: { date = new Date().toString(), tags = [] },
  } = matter(s)

  return {
    content,
    date,
    tags,
  }
}
