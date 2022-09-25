import showdown from 'showdown'
import showdownHljs from 'showdown-highlight'
import { createCodeBlockExt, createHeadingAnchorExt, KatexExt } from '../extensions'
import { AugmentedTableOfContentsNode } from '../postprocess'

showdown.setFlavor('github')

export interface ParserContext {
  converter: showdown.Converter
  headingCount: Record<string, number>
  codeBlockCount: number
  headings: AugmentedTableOfContentsNode[]
}

export function createParserContext(): ParserContext {
  const context: ParserContext = {
    converter: null as any,
    headingCount: {},
    codeBlockCount: 0,
    headings: [],
  }

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
