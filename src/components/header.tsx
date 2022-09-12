import styles from '@src/styles/Header.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

import { Ref, useRef, useState } from 'react'
import Navigator, { NavigatorProps } from './navigator'

interface HeaderProps {
  title: string
  date: string
  tree: NavigatorProps
}

const NAV_CONTAINER_PADDING = 15

export default function Header({ title, date, tree }: HeaderProps) {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
  const [height, setHeight] = useState<number>(0)
  const navDomRef = useRef<HTMLElement>()

  function handleNavOpenClick() {
    setIsNavOpen(!isNavOpen)

    if (!navDomRef.current) return

    if (isNavOpen) {
      setHeight(0)
    } else {
      setHeight(navDomRef.current.clientHeight + NAV_CONTAINER_PADDING)
    }
  }

  return (
    <div className={classNames(cx('card'), cx('header'))}>
      <a href="#" className={cx('title')}>
        {title}
      </a>
      <h2>Last updated on {date}</h2>
      <div
        className={cx('nav-container')}
        style={{
          height: `${height}px`,
          paddingBottom: isNavOpen ? `${NAV_CONTAINER_PADDING}px` : '0',
        }}
      >
        <Navigator {...tree} ref={navDomRef as Ref<HTMLElement>} />
      </div>
      <button className={cx('nav-button')} onClick={handleNavOpenClick}>
        <div className={cx('arrow', { open: isNavOpen })}></div>
      </button>
    </div>
  )
}
