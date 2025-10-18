import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Debug / identification: makes it obvious in the browser console and tab which activity is loaded
console.log('Loaded Activity 1.7 script — should render a brown pyramid (ConeGeometry with 4 sides)');
document.title = 'Activity 1.7 — Pyramid'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Pyramid geometry (4 sides)
const geometry = new THREE.ConeGeometry(1, 1, 4)
const material = new THREE.MeshBasicMaterial({ color:0x964B00 })  // Using MeshBasicMaterial for flat brown color
const pyramid = new THREE.Mesh(geometry, material)
scene.add(pyramid)

// Camera
const sizes = { width: window.innerWidth, height: window.innerHeight }
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animation
const clock = new THREE.Clock()
const tick = () => {
    pyramid.rotation.y = clock.getElapsedTime() * 0.3
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()
