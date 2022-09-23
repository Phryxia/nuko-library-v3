import { COPY_CODEBLOCK_CLASSNAME } from '@src/consts'
import type { ShowdownExtension } from 'showdown'

// will be refactored soon
let codeCounter = 0
const codeBlockRegExp =
  /(<pre>\s*<code[^>]*)(>(?:.(?!<\/code))*(?:.(?=<\/code))?<\/code>)\s*(<\/pre>)/gs

export const CodeBlockExt: ShowdownExtension = {
  type: 'output',
  filter(text) {
    return text.replaceAll(codeBlockRegExp, (match, p1, p2, p3) => {
      const codeId = `codeblock-${codeCounter++}`
      return `${p1} id="${codeId}"${p2}<button class="${COPY_CODEBLOCK_CLASSNAME}" data-clipboard-target="#${codeId}">\
<i class="iconoir-copy"></i></button>${p3}`
    })
  },
}
