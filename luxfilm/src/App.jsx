import React from 'react'
import { Toaster } from 'react-hot-toast'
import Home from './Pages/Home'

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Home />
    </>
  )
}

export default App