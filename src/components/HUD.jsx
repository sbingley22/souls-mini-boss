/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react"

const HUD = ({ playerHealth, enemyHealth, attackIndicator, setAttackIndicator, battleOver, setMode }) => {
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
  const leftStyle = {
    position: 'absolute',
    bottom: "0",
    left: "0",
    userSelect: "none",
    pointerEvents: "none",
    width: "15vw",
    height: "100vh",
    overflow: "none",
    background: `linear-gradient(to right, rgba(255, 155, 0, 0.5) 0%, rgba(0, 255, 255, 0) 100%)`,
  }
  const rightStyle = {
    position: 'absolute',
    bottom: "0",
    right: "0",
    userSelect: "none",
    pointerEvents: "none",
    width: "15vw",
    height: "100vh",
    overflow: "none",
    background: `linear-gradient(to left, rgba(255, 155, 0, 0.5) 0%, rgba(0, 255, 255, 0) 100%)`,
  }
  const battleOverStyle = {
    position: 'absolute',
    top: "2vh",
    left: "30vw",
    width: "40vw",
  }

  const [showPlayerHealth, setShowPlayerHealth] = useState(false)
  const [showEnemyHealth, setShowEnemyHealth] = useState(false)

  const [showLeftDodge, setShowLeftDodge] = useState(false)
  const [showRightDodge, setShowRightDodge] = useState(false)

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

  // Attack Incoming
  useEffect(()=>{
    if (attackIndicator == 1) {
      setShowLeftDodge(true)
      setTimeout(()=>{
        setShowLeftDodge(false)
      }, 1000)
      setAttackIndicator(null)
    }
    else if (attackIndicator == 2) {
      setShowRightDodge(true)
      setTimeout(()=>{
        setShowRightDodge(false)
      }, 1000)
      setAttackIndicator(null)
    }

  }, [attackIndicator, setAttackIndicator])

  return (
    <div>
      {showEnemyHealth && <p style={enemyStyle}>{enemyHealth}</p>}
      {showPlayerHealth && <p style={playerStyle}>{playerHealth}</p>}

      {showLeftDodge && <div style={leftStyle} />}
      {showRightDodge && <div style={rightStyle} />}

      {battleOver && <button onClick={()=>setMode(0)} style={battleOverStyle}>{battleOver}</button>}
    </div>
  )
}

export default HUD
