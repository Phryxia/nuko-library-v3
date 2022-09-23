import { COPY_CODEBLOCK_CLASSNAME } from '@src/consts'
import type { ShowdownExtension } from 'showdown'

const Counter = {} as Record<string, number>

function removeTags(input: string): string {
  return input.replace(/<[^>]+>/g, ' ')
}

const headingRegExp = /<(h\d)(?:[^>]*)>(.*)<\/h\d[^>]*>/

export const HeadingAnchorExt: ShowdownExtension = {
  type: 'output',
  regex: /<h\d[^>]*>.*<\/h\d[^>]*>/g,
  replace(s: string) {
    const match = headingRegExp.exec(s)

    if (!match) return s

    const tag = match[1]
    const innerHtml = match[2]
    const content = encodeURIComponent(removeTags(innerHtml))
    const dup = (Counter[content] ??= (Counter[content] ?? -1) + 1)
    const id = `${content}-${dup}`

    return `<${tag} id="${id}"><a href="#${id}">§</a>${innerHtml}</${tag}>`
  },
}

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
