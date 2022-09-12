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
