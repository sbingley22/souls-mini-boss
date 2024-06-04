import { useState } from 'react'
import './App.css'
import Game from './components/Game'

function App() {
  const [mode, setMode] = useState(1)

  return (
    <>
      {mode == 1 && <Game />}
    </>
  )
}

export default App
