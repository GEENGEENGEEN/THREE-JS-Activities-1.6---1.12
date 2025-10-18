import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Debug: log script loaded
console.log('Activity 1.10 script loaded')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Green pyramid
const pyramidGeometry = new THREE.ConeGeometry(0.5, 1, 4)
const pyramidMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial)
pyramid.position.x = -1.5
scene.add(pyramid)

// Red sphere (was circle)
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.x = 0
scene.add(sphere)

// Blue cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.x = 1.5
scene.add(cube)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
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

// Animate
const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    pyramid.rotation.y = elapsedTime * 0.7
    cube.rotation.y = elapsedTime * 0.7
    sphere.rotation.y = elapsedTime * 0.7
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()