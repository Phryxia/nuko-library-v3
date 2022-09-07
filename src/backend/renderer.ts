import MarkdownIt from 'markdown-it'

export function addCustomRenderer(md: MarkdownIt): void {
  const originalTransformer = md.renderer.rules.heading_open

  md.renderer.rules.heading_open = (tokens, index, options, env, self) => {
    const innerHtml =
      originalTransformer?.(tokens, index, options, env, self) ?? `<${tokens[index].tag}>`

    return innerHtml + '<a>§</a>'
  }
}
