import { Canvas } from "@react-three/fiber"
import { Suspense, useRef, useState } from "react"
import Boss from "./Boss"
import HUD from "./HUD"

const Game = () => {
  const gameContainer = useRef()

  const [playerHealth, setPlayerHealth] = useState(100)
  const [enemyHealth, setEnemyHealth] = useState(100)

  return (
    <div ref={gameContainer} className="game-container">
      <Canvas shadows dpr={2}>
        <Suspense>

          <Boss 
            playerHealth={playerHealth}
            setPlayerHealth={setPlayerHealth}
            enemyHealth={enemyHealth}
            setEnemyHealth={setEnemyHealth}
          />
          
        </Suspense>
      </Canvas>

      <HUD 
        playerHealth={playerHealth}
        enemyHealth={enemyHealth}
      />
    </div>
  )
}

export default Game
