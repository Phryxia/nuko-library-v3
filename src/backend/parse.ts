import matter from 'gray-matter'
import { createParserContext } from './parser'
import { createTableOfContents, TableOfContents } from './postprocess'

interface ParseResult {
  content: string
  date: string
  tags: string[]
  tableOfContents: TableOfContents
}

export function parseFile(s: string): ParseResult {
  const { content, ...rest } = parseMeta(s)
  const context = createParserContext()
  const html = context.converter.makeHtml(content)
  const tableOfContents = createTableOfContents(context)

  return { content: html, tableOfContents, ...rest }
}

function parseMeta(s: string): Omit<ParseResult, 'tableOfContents'> {
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
