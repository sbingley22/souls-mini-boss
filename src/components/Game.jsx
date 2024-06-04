import { Canvas } from "@react-three/fiber"
import { Suspense, useRef } from "react"
import Boss from "./Boss"


const Game = () => {
  const gameContainer = useRef()

  return (
    <div ref={gameContainer} className="game-container">
      <Canvas shadows dpr={2}>
        <Suspense>

          <Boss />
          
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Game
