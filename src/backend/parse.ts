import showdown from 'showdown'
import showdownHljs from 'showdown-highlight'
import showdownKatex from 'showdown-katex'
import katex from 'katex'
import matter from 'gray-matter'
import { CodeBlockExt, HeadingAnchorExt } from './renderer'

interface ParseResult {
  content: string
  date: string
  tags: string[]
}

export function parseFile(s: string): ParseResult {
  let { content: rawContent, ...rest } = parseMeta(s)
  const content = extractMathBlock(rawContent)
    .map(({ content, isMath }) => {
      if (isMath) {
        return katex.renderToString(content, {
          displayMode: true,
          errorColor: '#f55666',
          throwOnError: false,
        })
      }
      return converter.makeHtml(content)
    })
    .join('')

  return { content, ...rest }
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
    showdownKatex({
      errorColor: '#f55666',
      delimiters: [{ left: '$', right: '$', display: false }],
    }),
    HeadingAnchorExt,
    CodeBlockExt,
  ],
})

interface Hunk {
  content: string
  isMath: boolean
}

// split math block to markdown, since showdown parser has some problem with $$.
function extractMathBlock(s: string): Hunk[] {
  const lines = s.split(/\r?\n/)
  const hunks = [] as Hunk[]

  let content = ''
  let block = 'none'
  for (const line of lines) {
    // codefence start
    if (block !== 'math' && line.startsWith('```')) {
      if (block === 'none') {
        block = 'code'
      } else {
        block = 'none'
      }
      content += line + '\n'
      continue
    }

    if (block !== 'math' && (block === 'code' || line.startsWith('    '))) {
      content += line + '\n'
      continue
    }

    if (line === '$$') {
      if (block === 'none') {
        if (content) {
          hunks.push({
            content,
            isMath: false,
          })
          content = ''
        }
        block = 'math'
      } else {
        if (content) {
          hunks.push({
            content,
            isMath: true,
          })
          content = ''
        }
        block = 'none'
      }
      continue
    }
    content += line + '\n'
  }
  if (content) {
    hunks.push({
      content,
      isMath: false,
    })
  }

  return hunks
}
