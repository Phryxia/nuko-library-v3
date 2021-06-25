import { useContext, useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'

interface LinkerContextInterface {
  isUpdated: boolean
  update: () => void
}

const linkerContext = createContext<LinkerContextInterface>({ isUpdated: false, update() {} })

export function LinkerContextProvider({ children }: { children: React.ReactNode }) {
  const [isUpdated, setIsUpdated] = useState<boolean>(false)

  function update() {
    setIsUpdated(true)
  }

  useEffect(() => {
    if (isUpdated) setIsUpdated(false)
  }, [isUpdated])

  return (
    <linkerContext.Provider value={{ isUpdated, update }}>{children}</linkerContext.Provider>
  )
}

export function useLinker() {
  return useContext(linkerContext)
}
