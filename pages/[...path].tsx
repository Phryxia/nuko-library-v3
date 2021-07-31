import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import { getAllPostsPaths, getPost } from '/backend/md-scan'
import Header from '/components/header'
import Footer from '/components/footer'
import { LinkerProps } from '/components/footer/linker'
import styles from '/styles/Post.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface PostProps {
  title: string
  content: string
  date: string
  tree: LinkerProps
  tags: string[]
}

export default function Post({ title, content, date, tags, tree }: PostProps) {
  const router = useRouter()
  const contentDom = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 새로고침하거나 재방문했을 때 스크롤 위치를 저장하지 않음
    // 이걸 안해주면 fragment 위치로 안가짐
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  // 포스트 영역의 HTML이 바뀔 때마다 hydrate 해줘야 함
  useEffect(() => {
    // 타입가드. 논리적으로는 발생안함
    if (!contentDom.current) return

    // 헤더에 id 붙이기
    const headers = [
      ...contentDom.current.getElementsByTagName('h1'),
      ...contentDom.current.getElementsByTagName('h2'),
      ...contentDom.current.getElementsByTagName('h3'),
      ...contentDom.current.getElementsByTagName('h4'),
      ...contentDom.current.getElementsByTagName('h5'),
      ...contentDom.current.getElementsByTagName('h6'),
    ]

    // 헤더를 누르면 URI fragment를 생성
    headers.forEach((header) => {
      // innerText가 같은 것 끼리 모음
      const duplicatedDoms = headers.filter(({ innerText }) => innerText === header.innerText)
      const duplicatedOrder = duplicatedDoms.indexOf(header)

      // 2번째 중복부터는 추가 id를 붙임
      header.id = `${encodeURIComponent(header.innerText)}${
        duplicatedOrder > 0 ? `-${duplicatedOrder}` : ''
      }`

      // 이벤트 핸들러
      header.onclick = () => {
        router.push(`#${header.id}`)
      }
    })
  }, [content])

  // 페이지에 랜딩했을 때 fragment가 있으면 거기로 이동
  useEffect(() => {
    const fragment = router.asPath.split('#')[1] ?? ''
    document.getElementById(fragment)?.scrollIntoView(true)
  }, [router.asPath])

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
      </Head>

      <div className={cx('top_container')}>
        <Header title={title} date={date} />
        <div className={cx('card')}>
          {/* 마크다운 내용 */}
          <div
            className={cx('content')}
            dangerouslySetInnerHTML={{ __html: content }}
            ref={contentDom}
          ></div>

          {/* 태그 */}
          {tags.length > 0 && (
            <>
              <hr />
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

  const { content, date, tags } = await getPost(path.join('/') + '.md')

  // 푸터를 위한 작업
  const postsPaths = await getAllPostsPaths()

  const tree: LinkerProps = {
    title: 'root',
    path: '',
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
      date: dayjs(date).format('YYYY-MM-DD hh:mm'),
      tree,
      tags,
    },
  }
}
