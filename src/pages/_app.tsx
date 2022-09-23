import ClipboardJS from 'clipboard'
import '@src/styles/reset.css'
import '@src/styles/variables.css'
import '@src/styles/globals.css'
import 'highlight.js/styles/monokai-sublime.css'

import Head from 'next/head'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { COPY_CODEBLOCK_CLASSNAME } from '@src/consts'

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const clipboard = new ClipboardJS(`.${COPY_CODEBLOCK_CLASSNAME}`)
    clipboard.on('success', (e) => {
      e.clearSelection()
    })
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href="/iconoir.css" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
