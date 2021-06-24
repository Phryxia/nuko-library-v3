import '/styles/reset.css'
import '/styles/globals.css'
import 'highlight.js/styles/monokai-sublime.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import hljs from 'highlight.js'

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => hljs.highlightAll(), [])
  return <Component {...pageProps} />
}
