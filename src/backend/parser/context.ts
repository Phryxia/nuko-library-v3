import showdown from 'showdown'
import showdownHljs from 'showdown-highlight'
import { CodeBlockExt, HeadingAnchorExt, KatexExt } from '../extensions'

showdown.setFlavor('github')

export interface ParserContext {
  converter: showdown.Converter
  headingCount: Record<string, number>
  codeBlockCount: number
}

let currentContext: ParserContext | undefined

export function getCurrentParserContext(): ParserContext | undefined {
  return currentContext
}

export function createParserContext(): ParserContext {
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

  return (currentContext = {
    converter,
    headingCount: {},
    codeBlockCount: 0,
  })
}
