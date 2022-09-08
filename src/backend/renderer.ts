import type { ShowdownExtension } from 'showdown'

export const HeadingAnchorExt: ShowdownExtension = {
  type: 'output',
  regex: /(<h\d[^>]*>)/g,
  replace: '$1<a>§</a>',
}
