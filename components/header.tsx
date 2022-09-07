import styles from '/styles/Post.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface HeaderProps {
  title: string
  date: string
}

export default function Header({ title, date }: HeaderProps) {
  return (
    <div className={cx('card', 'header')}>
      <a href="#" className={cx('title')}>
        {title}
      </a>
      <h2>Last updated on {date}</h2>
    </div>
  )
}
