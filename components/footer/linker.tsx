import { useState } from 'react'
import Link from 'next/link'

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
  return isFolder ? (
    <>
      <a onClick={handleClick}>{title}</a>
      {isOpen && childs.map((child, index) => <Linker key={index} {...child} />)}
    </>
  ) : (
    <Link href={path}>
      <a>{title}</a>
    </Link>
  )
}
