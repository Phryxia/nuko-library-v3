import styles from '@src/styles/Header.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

import { useState } from 'react'
import Navigator, { NavigatorProps } from './navigator'

interface HeaderProps {
  title: string
  date: string
  tree: NavigatorProps
}

export default function Header({ title, date, tree }: HeaderProps) {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)

  function handleNavOpenClick() {
    setIsNavOpen(!isNavOpen)
  }

  return (
    <div className={classNames(cx('card'), cx('header'))}>
      <a href="#" className={cx('title')}>
        {title}
      </a>
      <h2>Last updated on {date}</h2>
      <button className={cx('nav-button')} onClick={handleNavOpenClick}>
        Nav
      </button>
      {isNavOpen && <Navigator {...tree} />}
    </div>
  )
}
