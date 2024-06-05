import { useState } from 'react'
import './App.css'
import Game from './components/Game'

function App() {
  const [mode, setMode] = useState(0)

  return (
    <>
      {mode == 0 &&
        <div className='main-menu'>
          <h2>Ogre Boss</h2>
          <button onClick={()=>setMode(1)}>Play</button>
          <button onClick={()=>setMode(9)}>How to Play</button>
        </div>
      }
      {mode == 1 && <Game setMode={setMode} />}
      {mode == 9 &&
        <div className='how-to-play'>
          <button onClick={()=>setMode(0)}>Return</button>
          <p>Tap in the left or right zones to dodge left or right. Dodge the ogres big attacks this way as they are unblockable. An orange flash will appear when the ogre is about to do one of these strikes. Dodge in the opposite direction</p>
          <p>Hold in the bottom zone to block. You can block the ogres straight attacks with this.</p>
          <p>Tap the top zone to attack. Time your taps as the sword flashes to combo for extra damage.</p>
          <p>Good Luck!</p>
        </div>
      }
    </>
  )
}

export default App
