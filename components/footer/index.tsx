import Linker, { LinkerProps } from './linker'
import { LinkerContextProvider } from './linkerContext'
import styles from '/styles/Linker.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface FooterProps {
  tree: LinkerProps
}

export default function Footer({ tree }: FooterProps) {
  return (
    <div className={cx('linker_container')}>
      <LinkerContextProvider>
        <Linker {...tree} />
      </LinkerContextProvider>
    </div>
  )
}
