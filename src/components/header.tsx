import styles from '@src/styles/Header.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

import { useRef, useState } from 'react'
import Navigator, { NavigatorProps } from './navigator'

interface HeaderProps {
  title: string
  date: string
  tree: NavigatorProps
}

export default function Header({ title, date, tree }: HeaderProps) {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
  const ref = useRef<HTMLElement>(null)

  function handleNavOpenClick() {
    setIsNavOpen(!isNavOpen)
  }

  function handleTransitionEnd() {
    if (!isNavOpen || !ref.current) return

    // @ts-ignore
    ref.current.scrollToSelected()
  }

  return (
    <div className={classNames(cx('card'), cx('header'))}>
      <a href="#" className={cx('title')}>
        {title}
      </a>
      <h2>Last updated on {date}</h2>
      <div
        className={cx('nav-container', { open: isNavOpen })}
        onTransitionEnd={handleTransitionEnd}
      >
        <Navigator {...tree} ref={ref} />
      </div>
      <button className={cx('nav-button')} onClick={handleNavOpenClick}>
        <div className={cx('arrow', { open: isNavOpen })}></div>
      </button>
    </div>
  )
}
