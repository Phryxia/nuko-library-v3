import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import { getAllPostsPaths, getPost } from '@src/backend/md-scan'
import Header from '@src/components/header'
import Footer from '@src/components/footer'
import { LinkerProps } from '@src/components/linker'
import styles from '@src/styles/Post.module.css'
import classNames from 'classnames/bind'
import { integers, map, reduce } from '@src/utils'

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

  // 포스트 영역의 HTML이 바뀔 때마다 hydrate 해줘야 함
  useEffect(() => {
    // 타입가드. 논리적으로는 발생안함
    if (!contentDom.current) return

    // 헤더에 id 붙이기
    const headings = reduce(
      map(integers(6), (level) =>
        contentDom.current!.querySelectorAll(`h${level + 1}`)
      ) as Generator<NodeListOf<HTMLHeadingElement>>,
      (result, nodeList) => [...result, ...nodeList],
      [] as HTMLHeadingElement[]
    )

    // 헤더를 누르면 URI fragment를 생성
    headings.forEach((heading) => {
      // innerText가 같은 것 끼리 모음
      const duplicatedDoms = headings.filter(({ innerText }) => innerText === heading.innerText)
      const duplicatedOrder = duplicatedDoms.indexOf(heading)

      // 2번째 중복부터는 추가 id를 붙임
      heading.id = `${encodeURIComponent(heading.innerText)}${
        duplicatedOrder > 0 ? `-${duplicatedOrder}` : ''
      }`

      const marker = heading.querySelector('a:nth-child(1)') as HTMLAnchorElement
      marker.href = `#${heading.id}`
    })
  }, [content])

  // 페이지에 랜딩했을 때 fragment가 있으면 거기로 이동
  // 내용물 빌드 타임 주입이 MarkdownIt 구조로는 불가능하기 때문에, 부득이하게 CSR 주입을 하고
  // 그것 때문에 최초에는 해당 ID가 없음. 위의 훅이 실행된 뒤에야 가능.
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
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

  const { content, date, tags } = await getPost(path.join('/') + '.md')

  // 푸터를 위한 작업
  const postsPaths = await getAllPostsPaths()

  const tree: LinkerProps = {
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
    },
  }
}
