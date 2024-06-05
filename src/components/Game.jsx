/* eslint-disable react/prop-types */
import { Canvas } from "@react-three/fiber"
import { Suspense, useRef, useState } from "react"
import Boss from "./Boss"
import HUD from "./HUD"

const Game = ({ setMode, isMobile }) => {
  const gameContainer = useRef()

  const [playerHealth, setPlayerHealth] = useState(100)
  const [enemyHealth, setEnemyHealth] = useState(100)
  const [attackIndicator, setAttackIndicator] = useState(null)
  const [battleOver, setBattleOver] = useState(null)

  return (
    <div ref={gameContainer} className="game-container">
      <Canvas shadows dpr={isMobile ? 0.5 : 2}>
        <Suspense>

          <Boss 
            playerHealth={playerHealth}
            setPlayerHealth={setPlayerHealth}
            enemyHealth={enemyHealth}
            setEnemyHealth={setEnemyHealth}
            setAttackIndicator={setAttackIndicator}
            battleOver={battleOver}
            setBattleOver={setBattleOver}
          />
          
        </Suspense>
      </Canvas>

      <HUD 
        playerHealth={playerHealth}
        enemyHealth={enemyHealth}
        attackIndicator={attackIndicator}
        setAttackIndicator={setAttackIndicator}
        battleOver={battleOver}
        setMode={setMode}
      />
    </div>
  )
}

export default Game
