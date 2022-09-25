import styles from '@src/styles/Post.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useRef } from 'react'
import dayjs from 'dayjs'
import { getAllPostsPaths, getPost } from '@src/backend/md-scan'
import Header from '@src/components/header'
import Footer from '@src/components/footer'
import { NavigatorProps } from '@src/components/navigator'
import { TableOfContents } from '@src/backend/postprocess'

interface PostProps {
  title: string
  content: string
  date: string
  tree: NavigatorProps
  tags: string[]
  tableOfContents: TableOfContents
}

export default function Post({ title, content, date, tags, tree, tableOfContents }: PostProps) {
  const router = useRouter()
  const contentDom = useRef<HTMLDivElement>(null)

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="keywords" content={tags.join(', ')} />
        <meta name="author" content="gfnuko" />
        <meta lang="ko" />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.gravatar.com/avatar/a26b8e267667d62e3e62d7e1fc09009a"
        />
        <meta
          property="og:url"
          content={`https://nuko-library-v3.vercel.app/${router.asPath}`}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
        />
        {/* Latex */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.css"
          integrity="sha384-bYdxxUwYipFNohQlHt0bjN/LCpueqWz13HufFEV1SUatKs1cm4L6fFgCi1jT643X"
          crossOrigin="anonymous"
        />
      </Head>

      <div className={cx('root')}>
        <div className={cx('top_container')}>
          <Header {...{ title, date, tree }} />
          <div className={cx('card', 'content-container')}>
            {/* 마크다운 내용 */}
            <div
              className={cx('content')}
              dangerouslySetInnerHTML={{ __html: content }}
              ref={contentDom}
            ></div>

            {/* 태그 */}
            {tags.length > 0 && (
              <>
                <hr className={cx('tag-start')} />
                <div className={cx('tags_container')}>
                  <span>Keywords:</span>
                  {tags.map((tag, index) => (
                    <span className={cx('tags')} key={index}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          <Footer tree={tree} />
        </div>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postsPaths = await getAllPostsPaths()

  const paths = postsPaths.map((path) => ({
    params: {
      path: path
        .replace('.md', '')
        .split('/')
        .map((token) => encodeURIComponent(token)),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const path = ((context.params?.path as string[]) ?? []).map((token) =>
    decodeURIComponent(token)
  )

  const { content, date, tags, tableOfContents } = await getPost(path.join('/') + '.md')

  // 푸터를 위한 작업
  const postsPaths = await getAllPostsPaths()

  const tree: NavigatorProps = {
    title: 'root',
    path: '/posts',
    childs: [],
  }

  // 직렬화된 경로를 재귀적인 트리로 바꾼다
  function parsePath(path: string) {
    const tokens = path.replace('.md', '').split('/')

    let current = tree
    for (const token of tokens) {
      let child = current.childs.find((child) => child.title === token)
      if (!child) {
        child = {
          title: token,
          path: `${current.path}/${encodeURIComponent(encodeURIComponent(token))}`,
          childs: [],
        }
        current.childs.push(child)
      }
      current = child
    }
  }

  postsPaths.forEach((path) => parsePath(path))

  return {
    props: {
      title: path[path.length - 1],
      content,
      date: dayjs(date).format('YYYY-MM-DD'),
      tree,
      tags,
      tableOfContents,
    },
  }
}
