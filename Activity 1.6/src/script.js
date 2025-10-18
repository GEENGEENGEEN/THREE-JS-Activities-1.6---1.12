import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
// Use a lighting-aware material so the cube responds to lights (MeshBasicMaterial ignores lights)
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Lights: ambient for base illumination and a directional light to create highlights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
directionalLight.position.set(2, 2, 5)
scene.add(directionalLight)

// Color toggle helper: allow switching material color at runtime to verify lighting works
const RED = 0xff0000
const WHITE = 0xffffff
let isWhite = false

function setColorWhite() {
    mesh.material.color.set(WHITE)
    isWhite = true
    console.log('Cube color set to white')
}

function setColorRed() {
    mesh.material.color.set(RED)
    isWhite = false
    console.log('Cube color set to red')
}

// Toggle with the "c" key
window.addEventListener('keydown', (event) => {
    if (event.key === 'c') {
        if (isWhite) setColorRed()
        else setColorWhite()
    }
})

// Quick demo: auto-switch to white shortly after load so you can visually confirm lighting
setTimeout(() => {
    setColorWhite()
}, 1200)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()