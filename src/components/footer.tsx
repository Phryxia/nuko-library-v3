import styles from '@src/styles/Footer.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

import Navigator, { NavigatorProps } from './navigator'

interface FooterProps {
  tree: NavigatorProps
}

export default function Footer({ tree }: FooterProps) {
  return (
    <div className={cx('root')}>
      <Navigator {...tree} />
    </div>
  )
}
