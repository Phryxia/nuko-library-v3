import type { ShowdownExtension } from 'showdown'
import { COPY_CODEBLOCK_CLASSNAME } from '@src/consts'
import { getCurrentParserContext } from '../parser'

const codeBlockRegExp =
  /(<pre>\s*<code[^>]*)(>(?:.(?!<\/code))*(?:.(?=<\/code))?<\/code>)\s*(<\/pre>)/gs

export const CodeBlockExt: ShowdownExtension = {
  type: 'output',
  filter(text) {
    const context = getCurrentParserContext()

    if (!context) throw new Error('ParserContext is not set')

    return text.replaceAll(codeBlockRegExp, (match, p1, p2, p3) => {
      const codeId = `codeblock-${context.codeBlockCount++}`
      return `${p1} id="${codeId}"${p2}<button class="${COPY_CODEBLOCK_CLASSNAME}" data-clipboard-target="#${codeId}">\
<i class="iconoir-copy"></i></button>${p3}`
    })
  },
}
