import { useState } from 'react'
import { useRouter } from 'next/router'
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
  const router = useRouter()
  const decodedPath = decodeURIComponent(router.asPath.split('#')[0].split('?')[0])
  const [isOpen, setIsOpen] = useState<boolean>(decodedPath.indexOf(path) === 0)
  const isSelected = decodedPath === path

  function handleClick() {
    setIsOpen(!isOpen)
  }

  const isFolder = childs.length > 0
  return (
    <div className={cx('linker', { isFolder })}>
      {isFolder ? (
        <>
          <div onClick={handleClick}>
            <span className={cx('arrow', { isOpen })} />
            <a>{title}</a>
          </div>

          {/* 자식 */}
          {isOpen && childs.map((child, index) => <Linker key={index} {...child} />)}
        </>
      ) : (
        <Link href={path}>
          <div>
            <a className={cx({ isSelected })}>{title}</a>
          </div>
        </Link>
      )}
    </div>
  )
}
