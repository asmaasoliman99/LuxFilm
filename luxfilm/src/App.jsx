import React from 'react'
import { Toaster } from 'react-hot-toast'
import Home from './Pages/Home'
import { useLanguage } from './Context/Language'

const App = () => {
  const { lang } = useLanguage()
  return (
    <>
      <Toaster position={lang === 'ar' ? 'top-left' : 'top-right'} reverseOrder={false} />
      <Home />
    </>
  )
}

export default App
