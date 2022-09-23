import showdown from 'showdown'
import showdownHljs from 'showdown-highlight'
import matter from 'gray-matter'
import { CodeBlockExt, HeadingAnchorExt, KatexExt } from './extensions'

interface ParseResult {
  content: string
  date: string
  tags: string[]
}

export function parseFile(s: string): ParseResult {
  let { content, ...rest } = parseMeta(s)

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

showdown.setFlavor('github')

const converter = new showdown.Converter({
  extensions: [
    showdownHljs({
      pre: false,
      auto_detection: false,
    }),
    KatexExt,
    HeadingAnchorExt,
    CodeBlockExt,
  ],
})
