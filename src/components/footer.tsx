import Linker, { LinkerProps } from './linker'
import styles from '@src/styles/Linker.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface FooterProps {
  tree: LinkerProps
}

export default function Footer({ tree }: FooterProps) {
  return (
    <div className={cx('linker_container')}>
      <Linker {...tree} />
    </div>
  )
}
