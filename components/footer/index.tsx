import Linker, { LinkerProps } from './linker'
import styles from '/styles/Post.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface FooterProps {
  tree: LinkerProps
}

export default function Footer({ tree }: FooterProps) {
  return (
    <div className={cx('card')}>
      <Linker {...tree} />
    </div>
  )
}
