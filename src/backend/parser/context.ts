import showdown from 'showdown'
import showdownHljs from 'showdown-highlight'
import { createCodeBlockExt, createHeadingAnchorExt, KatexExt } from '../extensions'

showdown.setFlavor('github')

export interface ParserContext {
  converter: showdown.Converter
  headingCount: Record<string, number>
  codeBlockCount: number
}

export function createParserContext(): ParserContext {
  const context = {
    converter: null as any,
    headingCount: {},
    codeBlockCount: 0,
  } as ParserContext

  context.converter = new showdown.Converter({
    extensions: [
      showdownHljs({
        pre: false,
        auto_detection: false,
      }),
      KatexExt,
      createHeadingAnchorExt(context),
      createCodeBlockExt(context),
    ],
  })

  return context
}
