import katex from 'katex'
import type { ShowdownExtension } from 'showdown'

const mathInlineRegExp = /¨D((?:[^\n](?!¨D))*(?:[^\n](?=¨D)))¨D/g
const mathBlockRegExp = /¨D¨D\n([^¨D]*)¨D¨D(\n|$)/gs

function createMathExt(regExp: RegExp, isBlock: boolean): ShowdownExtension {
  return {
    type: 'lang',
    filter(text) {
      return text.replaceAll(regExp, (match, p1) => {
        return katex.renderToString(p1, {
          displayMode: isBlock,
          errorColor: '#f55666',
          throwOnError: false,
        })
      })
    },
  }
}

export function KatexExt() {
  return [createMathExt(mathInlineRegExp, false), createMathExt(mathBlockRegExp, true)]
}
