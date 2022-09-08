import styles from '@src/styles/Post.module.css'
import classNames from 'classnames/bind'
import { useState } from 'react'
import Linker, { LinkerProps } from './linker'

const cx = classNames.bind(styles)

interface HeaderProps {
  title: string
  date: string
  tree: LinkerProps
}

export default function Header({ title, date, tree }: HeaderProps) {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)

  function handleNavOpenClick() {
    setIsNavOpen(!isNavOpen)
  }

  return (
    <div className={cx('card', 'header')}>
      <a href="#" className={cx('title')}>
        {title}
      </a>
      <h2>Last updated on {date}</h2>
      <button className={cx('nav-button')} onClick={handleNavOpenClick}>
        Nav
      </button>
      {isNavOpen && <Linker {...tree} />}
    </div>
  )
}
