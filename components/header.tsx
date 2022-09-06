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
      <h1>{title}</h1>
      <h2>Last updated on {date}</h2>
    </div>
  )
}
