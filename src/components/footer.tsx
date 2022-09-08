import styles from '@src/styles/Footer.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

import Linker, { LinkerProps } from './linker'

interface FooterProps {
  tree: LinkerProps
}

export default function Footer({ tree }: FooterProps) {
  return (
    <div className={cx('root')}>
      <Linker {...tree} />
    </div>
  )
}
