import { useState } from 'react'
import Link from 'next/link'
import styles from '/styles/Linker.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export interface LinkerProps {
  title: string
  path: string
  childs: LinkerProps[]
}

export default function Linker({ title, path, childs = [] }: LinkerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  function handleClick() {
    setIsOpen(!isOpen)
  }

  const isFolder = childs.length > 0
  return (
    <div className={cx('linker')}>
      {isFolder ? (
        <>
          <span className={cx('arrow', { open: isOpen })}></span>
          <a onClick={handleClick}>{title}</a>
          {isOpen && childs.map((child, index) => <Linker key={index} {...child} />)}
        </>
      ) : (
        <Link href={path}>
          <a>{title}</a>
        </Link>
      )}
    </div>
  )
}
