import type { ShowdownExtension } from 'showdown'
import { getCurrentParserContext } from '../parser'

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

    const context = getCurrentParserContext()

    if (!context) throw new Error('ParserContext is not set')

    const [, tag, innerHtml] = match
    const content = encodeURIComponent(removeTags(innerHtml))
    const dup = (context.headingCount[content] = (context.headingCount[content] ??= -1) + 1)
    const id = `${content}-${dup}`

    return `<${tag} id="${id}"><a href="#${id}">§</a>${innerHtml}</${tag}>`
  },
}
