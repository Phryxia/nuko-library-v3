import styles from '@src/styles/Linker.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

import { ForwardedRef, forwardRef, Ref, useImperativeHandle, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

/*
  path: 이 Linker가 보내는 페이지의 상대 경로, 2번 인코딩 됐음
*/
export interface NavigatorProps {
  title: string
  path: string
  childs: NavigatorProps[]
}

function _NavigatorNode({ title, path, childs = [] }: NavigatorProps, ref: ForwardedRef<any>) {
  const router = useRouter()
  const currentPath = router.asPath.split('#')[0].split('?')[0]
  const dom = useRef<HTMLDivElement>(null)

  // 현재 열린 포스트를 표시할 수 있도록 모든 폴더의 열림 기본값을 설정한다.
  // 예컨데 라우터 경로가 /babo/a/c이고 현재 링커의 고유경로가 /babo/a이면 이 링커는 열려야함
  const [isOpen, setIsOpen] = useState<boolean>(currentPath.indexOf(path) === 0)
  const isSelected = currentPath === path

  useImperativeHandle(ref, () => ({
    scrollToSelected() {
      if (isSelected && dom.current) {
        dom.current.parentElement?.scrollTo({
          top: dom.current.offsetTop,
        })
      }
    },
  }))

  function handleClick() {
    setIsOpen(!isOpen)
  }

  const isFolder = childs.length > 0
  return (
    <div className={cx('linker')} ref={dom}>
      {isFolder ? (
        <>
          <button className={cx('linker_row')} onClick={handleClick}>
            <span className={cx('arrow', { isOpen })} />
            <span className={cx('linker_label', 'isFolder')}>{title}</span>
          </button>

          {/* 자식 */}
          {isOpen && (
            <div className={cx('children')}>
              {childs.map((child) => (
                <NavigatorNode key={child.path} {...child} ref={ref} />
              ))}
            </div>
          )}
        </>
      ) : (
        <Link href={path} passHref>
          <a className={cx('linker_row')}>
            <span className={cx('linker_label', { isSelected })}>{title}</span>
          </a>
        </Link>
      )}
    </div>
  )
}

const NavigatorNode = forwardRef(_NavigatorNode)

export default forwardRef(function Navigator(props: NavigatorProps, ref: Ref<HTMLElement>) {
  return (
    <nav>
      <NavigatorNode {...props} ref={ref} />
    </nav>
  )
})
