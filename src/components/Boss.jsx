/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Environment, useAnimations, useGLTF } from '@react-three/drei'
import glbFile from '../assets/souls.glb?url'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

const camVec = new Vector3()
const targetVec = new Vector3()
const posVec = new Vector3()
const dirVec = new Vector3()

const combo = {
  slash1: [0.4,0.6],
  slash2: [0.5,0.7],
  slash3: [0.8,1.8]
}

const Boss = ({ playerHealth, setPlayerHealth, enemyHealth, setEnemyHealth, setAttackIndicator, battleOver, setBattleOver }) => {
  const { scene, nodes, animations } = useGLTF(glbFile)
  const { actions, names, mixer } = useAnimations(animations, scene)

  const userInput = useRef(null)
  const animLady = useRef("Idle")
  const animLadyLast = useRef("Idle")
  const animOgre = useRef("ogreIdle")
  const animOgreLast = useRef("ogreIdle")
  const ladySword = useRef(null)
  const hitFrame = useRef(null)
  const ogreHitFrame = useRef(null)

  // Initial setup
  useEffect(()=>{
    console.log(names, nodes)

    actions["Idle"].play()
    actions["ogreIdle"].play()

    ladySword.current = nodes["Sword"]

    nodes["Ana"].castShadow = true
    nodes["PlateBoots"].castShadow = true
    nodes["ogre"].castShadow = true
    nodes["ground"].receiveShadow = true

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Event Listeners
  useEffect(() => {
    const mouseClick = (e) => {
      const clickX = e.clientX / window.innerWidth
      const clickY = e.clientY / window.innerHeight
      //console.log("Clicked at X:", clickX, "Y:", clickY)

      if (clickX < 0.25) {
        userInput.current = "rollLeft"
      } else if (clickX > 0.75) {
        userInput.current = "rollRight"
      } else if (clickY < 0.7) {
        userInput.current = "attack"
      } else {
        userInput.current = "block"
      }
      console.log(userInput.current)
    }

    const mouseUp = () => {
      userInput.current = "release"
    }

    window.addEventListener("mousedown", mouseClick)
    window.addEventListener("mouseup", mouseUp)

    return () => {
      window.removeEventListener("mousedown", mouseClick)
      window.removeEventListener("mouseup", mouseUp)
    }
  }, [])

  // Mixer setup
  useEffect(()=>{
    const oneshots = ["Take Damage", "Blocked", "Slash 1", "Slash 2", "Slash 3", "Dodge Left", "Dodge Right", "Win", "Die", "ogreJab", "ogreStrongLeft", "ogreStrongRight", "ogreStun", "ogreHurt", "ogreHurt2", "ogreWin", "ogreDie"]

    oneshots.forEach( oneshot => {
      actions[oneshot].repetitions = 1
      actions[oneshot].clampWhenFinished = true
    })

    const actionFinished = (e) => {
      const name = e.action.getClip().name
      if (name.includes("ogre")) {
        if (name == "ogreDie") animOgre.current = name
        else if (name == "ogreWin") animOgre.current = name
        else animOgre.current = "ogreIdle"
      } else {
        if (name == "Die") animLady.current = name
        else if (name == "Win") animLady.current = name
        else if (name == "Blocked") animLady.current = "Block"
        else animLady.current = "Idle"
      }
    }

    mixer.addEventListener("finished", actionFinished)

    return () => {
      mixer.removeEventListener("finished", actionFinished)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((state, delta) => {
    if (!scene) return
    if (!nodes["rig"]) return
    if (battleOver) return

    const updateSword = () => {
      if (!ladySword) return

      let flashSword = false
      const animTime = actions[animLady.current].time

      if (animLady.current == "Slash 1" && animTime > combo.slash1[0] && animTime < combo.slash1[1]) flashSword = true
      else if (animLady.current == "Slash 2" && animTime > combo.slash2[0] && animTime < combo.slash2[1]) flashSword = true

      if (flashSword) {
        ladySword.current.children[0].material.color.set(1,0,0)
      } else {
        ladySword.current.children[0].material.color.set(.3,.3,.3)
      }

      let isHitFrame = false
      let dmg = 3
      if (hitFrame.current == true) {
        if (animLady.current == "Slash 1" && animTime > combo.slash1[0]) {
          isHitFrame = true
        } 
        else if (animLady.current == "Slash 2" && animTime > combo.slash2[0]) {
          isHitFrame = true
          dmg = dmg * 2
        }
        else if (animLady.current == "Slash 3" && animTime > combo.slash3[0]) {
          isHitFrame = true
          dmg = dmg * 3
          console.log(animTime)
        }
        
        if (isHitFrame) {
          hitFrame.current = false
          const newEnemyHealth = enemyHealth - dmg
          setEnemyHealth(newEnemyHealth)

          if (newEnemyHealth <= 0) {
            //Enemy Dead
            animOgre.current = "ogreDie"
            animLady.current = "Win"
            setBattleOver("Victorious!")
            return

          } else {
            let attacking = false
            if (animOgre.current == "ogreJab") attacking = true 
            else if (animOgre.current == "ogreStrongLeft") attacking = true 
            else if (animOgre.current == "ogreStrongRight") attacking = true 

            if (!attacking) {
              animOgre.current = "ogreHurt"
              if (animOgreLast.current == "ogreHurt") animOgre.current = "ogreHurt2"
            }
          }
        }
      }
    }
    updateSword()

    const updateActions = () => {
      if (userInput.current == null) return
      const animTime = actions[animLady.current].time

      if (userInput.current == "attack") {
        if (animLady.current == "Idle") {
          animLady.current = "Slash 1"
          hitFrame.current = true
        }
        else if (animLady.current == "Slash 1") {
          if (animTime > combo.slash1[0] && animTime < combo.slash1[1]) {
            animLady.current = "Slash 2"
            hitFrame.current = true
          }
        }
        else if (animLady.current == "Slash 2") {
          if (animTime > combo.slash2[0] && animTime < combo.slash2[1]) {
            animLady.current = "Slash 3"
            hitFrame.current = true
          }
        }
      } 
      else if (userInput.current == "release") {
        if (animLady.current == "Block") animLady.current = "Idle"
      } 
      else if (userInput.current == "block") {
        if (animLady.current != "Take Damage") animLady.current = "Block"
      }
      else if (userInput.current == "rollLeft") {
        if (animLady.current != "Take Damage") animLady.current = "Dodge Left"
      } else if (userInput.current == "rollRight") {
        if (animLady.current != "Take Damage") animLady.current = "Dodge Right"
      }

      userInput.current = null
    }
    updateActions()

    const ogreAI = () => {
      let isAttacking = false
      let dmg = 5

      if (ogreHitFrame.current) {
        const animTime = actions[animOgre.current].time
        if (animOgre.current == "ogreStrongLeft" && animTime > 1.0) {
          if (animLady.current != "Dodge Left") {
            isAttacking = true
            dmg = dmg * 2
          }
          else {
            ogreHitFrame.current = false
          }
        }
        else if (animOgre.current == "ogreStrongRight" && animTime > 1.0) {
          if (animLady.current != "Dodge Right") {
            isAttacking = true
            dmg = dmg * 2
          }
          else {
            ogreHitFrame.current = false
          }
        }
        else if (animOgre.current == "ogreJab" && animTime > 0.7) {
          if (animLady.current != "Block") {
            isAttacking = true
          }
          else {
            ogreHitFrame.current = false
            animLady.current = "Blocked"
          }
        }
      }

      if (isAttacking) {
        // Attack Player
        ogreHitFrame.current = false
        const newPlayerHealth = playerHealth - dmg
        setPlayerHealth(newPlayerHealth)

        if (newPlayerHealth <= 0) {
          //Player Dead
          animLady.current = "Die"
          animOgre.current = "ogreWin"
          setBattleOver("You are Defeated!")
          return

        } else {
          animLady.current = "Take Damage"
        }
      }

      const readyToAttack = ["ogreIdle", "ogreHurt2"]
      if (readyToAttack.includes(animOgre.current)) {
        if (Math.random() < 1 * delta) {
          // Try attack
          const attackRandom = Math.random()
          if (attackRandom < 0.5) {
            animOgre.current = "ogreJab"
            ogreHitFrame.current = true
          } else if (attackRandom < 0.75) {
            animOgre.current = "ogreStrongLeft"
            ogreHitFrame.current = true
            setAttackIndicator(2)
          } else  {
            animOgre.current = "ogreStrongRight"
            ogreHitFrame.current = true
            setAttackIndicator(1)
          }
        }
      }

    }
    ogreAI()

    const updateRigPosition = () => {
      if (animLady.current === "Dodge Left" || animLady.current === "Dodge Right") {
        //const animTime = actions[animLady.current].time
        let direction = 1
        if (animLady.current === "Dodge Left") direction = -1
        const angle = (Math.PI / 2) * delta * direction

        const currentX = nodes["rig"].position.x
        const currentZ = nodes["rig"].position.z

        // Convert to polar coordinates
        const radius = Math.sqrt(currentX * currentX + currentZ * currentZ)
        const currentAngle = Math.atan2(currentZ, currentX)

        // Calculate new angle after rotation
        const newAngle = currentAngle - angle

        // Convert back to Cartesian coordinates
        nodes["rig"].position.x = radius * Math.cos(newAngle)
        nodes["rig"].position.z = radius * Math.sin(newAngle)

        // Calculate the direction to the origin and update rotation
        const directionToOrigin = dirVec.set(nodes["rig"].position.x, 0, nodes["rig"].position.z).normalize()
        nodes["rig"].quaternion.setFromUnitVectors(posVec.set(0, 0, -1), directionToOrigin)
      }
    }
    updateRigPosition()

    const updateOgrePosition = () => {
      if (animOgre.current == "ogreDie") return
      else if (animOgre.current == "ogreStrongLeft") return
      else if (animOgre.current == "ogreStrongRight") return

      // Calculate the direction to the player and update rotation
      const directionToPlayer = dirVec.set(-nodes["rig"].position.x, 0, -nodes["rig"].position.z).normalize()
      nodes["rigogre"].quaternion.setFromUnitVectors(posVec.set(0, 0, -1), directionToPlayer)
    }
    updateOgrePosition()

    const updateCamera = () => {
      camVec.copy(nodes["rig"].position)
      camVec.multiplyScalar(1.8)
      camVec.y += 1.5
      state.camera.position.copy(camVec)

      targetVec.copy(nodes["rigogre"].position)
      targetVec.y += 2
      state.camera.lookAt(targetVec)

      // Update camera projection matrix
      state.camera.updateProjectionMatrix()
    }
    updateCamera()

    const updateAnimations = () => {
      if (!actions) return

      let playLadyAnim = false
      if (animLady.current != animLadyLast.current) playLadyAnim = true

      if (playLadyAnim) {
        actions[animLadyLast.current].fadeOut(0.2)
        actions[animLady.current].reset().fadeIn(0.2).play()
        animLadyLast.current = animLady.current
      }

      let playOgreAnim = false
      if (animOgre.current != animOgreLast.current) playOgreAnim = true
      
      if (playOgreAnim) {
        actions[animOgreLast.current].fadeOut(0.2)
        actions[animOgre.current].reset().fadeIn(0.2).play()
        animOgreLast.current = animOgre.current
      }
    }
    updateAnimations()

  })

  return (
    <>
      <primitive object={scene} dispose={null} />

      <Environment 
        preset='forest' 
        background={true}
        backgroundIntensity={0.2}
        backgroundBlurriness={0.06}
        environmentIntensity={.95}
      />
      <directionalLight 
        position={[10,10,0]} 
        castShadow={true} 
        intensity={.75}
        color={"#EEAA11"} 
      />
    </>
  )
}

export default Boss
