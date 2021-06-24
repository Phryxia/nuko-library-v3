import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
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
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div className={cx('top_container')}>
        <Header title={title} date={date} />
        <div className={cx('card')}>
          {/* 마크다운 내용 */}
          <div className={cx('content')} dangerouslySetInnerHTML={{ __html: content }}></div>

          {/* 태그 */}
          {tags.length > 0 && (
            <>
              <hr />
              <div className={cx('tags_container')}>
                Keywords:{' '}
                {tags.map((tag) => (
                  <span>#{tag}</span>
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
      path: path.replace('.md', '').split('/'),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const path = (context.params?.path as string[]) ?? []

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
          path: `${current.path}/${token}`,
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
