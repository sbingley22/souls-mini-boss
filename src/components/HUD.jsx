/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react"

const HUD = ({ playerHealth, enemyHealth }) => {
  const enemyStyle = {
    position: "absolute",
    top: "25vh",
    left: "45vh",
    userSelect: "none",
    pointerEvents: "none",
    fontSize: "x-large",
    color: enemyHealth < 30 ? "red" : enemyHealth < 66 ? "yellow" : "white" 
  }
  const playerStyle = {
    position: "absolute",
    bottom: "10px",
    left: "45vh",
    userSelect: "none",
    pointerEvents: "none",
    fontSize: "x-large",
    color: playerHealth < 30 ? "red" : playerHealth < 66 ? "yellow" : "white" 
  }

  const [showPlayerHealth, setShowPlayerHealth] = useState(false)
  const [showEnemyHealth, setShowEnemyHealth] = useState(false)

  const playerHealthTimer = useRef(Date.now())
  const enemyHealthTimer = useRef(Date.now())

  // Player Health Change
  useEffect(()=>{
    setShowPlayerHealth(true)
    playerHealthTimer.current = Date.now()

    setTimeout(()=>{
      const timeDif = Date.now() - playerHealthTimer.current
      if (timeDif > 900) setShowPlayerHealth(false)
    }, 1000)
  }, [playerHealth])

  // Enemy Health Change
  useEffect(()=>{
    setShowEnemyHealth(true)
    enemyHealthTimer.current = Date.now()

    setTimeout(()=>{
      const timeDif = Date.now() - enemyHealthTimer.current
      if (timeDif > 900) setShowEnemyHealth(false)
    }, 1000)
  }, [enemyHealth])

  return (
    <div>
      {showEnemyHealth && <p style={enemyStyle}>{enemyHealth}</p>}
      {showPlayerHealth && <p style={playerStyle}>{playerHealth}</p>}
    </div>
  )
}

export default HUD
