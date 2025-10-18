import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI()

// Debug parameters object
const parameters = {
    color: 0xff0000,
    spin: false,
    spinSpeed: 1,
    wireframe: false,
    radius: 1,
    height: 2,
    updatePyramid: () => {
        // Remove old geometry
        geometry.dispose()
        // Create new geometry with current parameters
        mesh.geometry = new THREE.ConeGeometry(parameters.radius, parameters.height, 4)
    }
}

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
// Pyramid geometry (4 sides)
const geometry = new THREE.ConeGeometry(1, 2, 4)  // radius, height, sides
const material = new THREE.MeshBasicMaterial({ color: parameters.color })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Debug GUI
// Object position folder
const positionFolder = gui.addFolder('Position')
positionFolder.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('X Position')
positionFolder.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('Y Position')
positionFolder.add(mesh.position, 'z').min(-3).max(3).step(0.01).name('Z Position')

// Object rotation folder
const rotationFolder = gui.addFolder('Rotation')
rotationFolder.add(mesh.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.01).name('X Rotation')
rotationFolder.add(mesh.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.01).name('Y Rotation')
rotationFolder.add(mesh.rotation, 'z').min(-Math.PI).max(Math.PI).step(0.01).name('Z Rotation')

// Object scale folder
const scaleFolder = gui.addFolder('Scale')
scaleFolder.add(mesh.scale, 'x').min(0.1).max(5).step(0.1).name('X Scale')
scaleFolder.add(mesh.scale, 'y').min(0.1).max(5).step(0.1).name('Y Scale')
scaleFolder.add(mesh.scale, 'z').min(0.1).max(5).step(0.1).name('Z Scale')

// Pyramid dimensions
const dimensionsFolder = gui.addFolder('Pyramid Dimensions')
dimensionsFolder.add(parameters, 'radius').min(0.1).max(3).step(0.1).name('Base Radius')
    .onChange(parameters.updatePyramid)
dimensionsFolder.add(parameters, 'height').min(0.1).max(5).step(0.1).name('Height')
    .onChange(parameters.updatePyramid)

// Material properties
const materialFolder = gui.addFolder('Material')
materialFolder.addColor(parameters, 'color')
    .onChange(() => {
        material.color.set(parameters.color)
    })
materialFolder.add(material, 'wireframe')

// Animation controls
const animationFolder = gui.addFolder('Animation')
animationFolder.add(parameters, 'spin').name('Auto Rotate')
animationFolder.add(parameters, 'spinSpeed').min(0.1).max(5).step(0.1).name('Rotation Speed')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update object rotation if spin is enabled
    if (parameters.spin) {
        mesh.rotation.y += parameters.spinSpeed * 0.01
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()