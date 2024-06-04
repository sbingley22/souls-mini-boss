/* eslint-disable react/no-unknown-property */
import { Environment, useAnimations, useGLTF } from '@react-three/drei'
import glbFile from '../assets/souls.glb?url'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

const camVec = new Vector3()
const targetVec = new Vector3()

const combo = {
  slash1: [0.4,0.6],
  slash2: [0.4,0.6]
}

const Boss = () => {
  const { scene, nodes, animations } = useGLTF(glbFile)
  const { actions, names, mixer } = useAnimations(animations, scene)

  const userInput = useRef(null)
  const animLady = useRef("Idle")
  const animLadyLast = useRef("Idle")
  const animOgre = useRef("ogreIdle")
  const animOgreLast = useRef("ogreIdle")
  const ladySword = useRef(null)

  // Initial setup
  useEffect(()=>{
    console.log(names, nodes)

    actions["Idle"].play()
    actions["ogreIdle"].play()

    ladySword.current = nodes["Sword"]

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
    const oneshots = ["Take Damage", "Blocked", "Slash 1", "Slash 2", "Slash 3", "ogreJab", "ogreStrongLeft", "ogreStrongRight", "ogreStun", "ogreHurt"]

    oneshots.forEach( oneshot => {
      actions[oneshot].repetitions = 1
      actions[oneshot].clampWhenFinished = true
    })

    const actionFinished = (e) => {
      const name = e.action.getClip().name
      if (name.includes("ogre")) {
        animOgre.current = "ogreIdle"
      } else {
        animLady.current = "Idle"
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

    const updateActions = () => {
      if (userInput.current == null) return
      const animTime = actions[animLady.current].time

      if (userInput.current == "attack") {
        if (animLady.current == "Idle") {
          animLady.current = "Slash 1"
        }
        else if (animLady.current == "Slash 1") {
          if (animTime > combo.slash1[0] && animTime < combo.slash1[1]) animLady.current = "Slash 2"
        }
        else if (animLady.current == "Slash 2") {
          if (animTime > combo.slash2[0] && animTime < combo.slash2[1]) animLady.current = "Slash 3"
        }
      } 
      else if (userInput.current == "release") {
        if (animLady.current == "Block") animLady.current = "Idle"
      } 
      else if (userInput.current == "block") {
        if (animLady.current == "Idle") animLady.current = "Block"
      }
      else if (user input.current == "rollLeft") {
        if (animLady.current == "Idle") animLady.current = "Dodge Left"
      } else if (user input.current == "rollRight") {
        if (animLady.current == "Idle") animLady.current = "Dodge Right"
      }

      userInput.current = null
    }
    updateActions()

    const updateSword = () => {
      let flashSword = false
      const animTime = actions[animLady.current].time
      if (animLady.current == "Slash 1" && animTime > combo.slash1[0] && animTime < combo.slash1[1]) flashSword = true
      else if (animLady.current == "Slash 2" && animTime > combo.slash2[0] && animTime < combo.slash2[1]) flashSword = true

      if (flashSword) {
        ladySword.current.children[0].material.color.set(1,0,0)
      } else {
        ladySword.current.children[0].material.color.set(.3,.3,.3)
      }
    }
    updateSword()

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

      if (animLady.current != animLadyLast.current) {
        actions[animLadyLast.current].fadeOut(0.2)
        actions[animLady.current].reset().fadeIn(0.2).play()
        //console.log(animLady.current, animLadyLast.current)
        animLadyLast.current = animLady.current
      } else if (animOgre.current != animOgreLast.current) {
        actions[animOgreLast.current].fadeOut(0.2)
        actions[animOgre.current].reset().fadeIn(0.2)
        animOgreLast.current = animOgre.current.play()
      }
    }
    updateAnimations()

  })

  return (
    <>
      <primitive object={scene} dispose={null} />

      <Environment preset='forest' background={true} />
    </>
  )
}

export default Boss
