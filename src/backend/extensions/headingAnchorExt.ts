import type { ShowdownExtension } from 'showdown'
import type { ParserContext } from '../parser'

function removeTags(input: string): string {
  return input.replace(/<[^>]+>/g, ' ')
}

const headingRegExp = /<(h\d)(?:[^>]*)>(.*)<\/h\d[^>]*>/

export function createHeadingAnchorExt(context: ParserContext): ShowdownExtension {
  return {
    type: 'output',
    regex: /<h\d[^>]*>.*<\/h\d[^>]*>/g,
    replace(s: string) {
      const match = headingRegExp.exec(s)

      if (!match) return s

      const [, tag, innerHtml] = match
      const content = encodeURIComponent(removeTags(innerHtml))
      const dup = (context.headingCount[content] = (context.headingCount[content] ??= -1) + 1)
      const id = `${content}-${dup}`

      return `<${tag} id="${id}"><a href="#${id}">§</a>${innerHtml}</${tag}>`
    },
  }
}
