import Head from 'next/head'
import type { AppProps } from 'next/app'
import '@src/styles/reset.css'
import '@src/styles/variables.css'
import '@src/styles/globals.css'
import 'highlight.js/styles/monokai-sublime.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
