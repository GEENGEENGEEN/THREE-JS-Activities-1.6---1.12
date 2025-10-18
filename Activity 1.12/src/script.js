import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

console.log('Activity 1.12 script loaded');

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
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.x = 1
camera.position.y = 1
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
 * Textures
 * Demonstrates loading and using various texture types for realism and PBR
 */

const textureLoader = new THREE.TextureLoader()

// Use matcap texture since it's available
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')

// Texture optimization tip: Use power-of-2 sizes (e.g., 256x256, 512x512) for best GPU performance and mipmapping.
// Compression: Use compressed formats (like JPEG for color, PNG for alpha) and keep file sizes small for faster loading.

/**
 * Object with texture (MeshStandardMaterial for PBR)
 */
const pbrMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture
})

// Replace the mesh's material
mesh.material = pbrMaterial

// For ambient occlusion/displacement, set mesh.geometry.attributes.uv2 = mesh.geometry.attributes.uv
if (mesh.geometry.attributes.uv) {
    mesh.geometry.setAttribute('uv2', new THREE.BufferAttribute(mesh.geometry.attributes.uv.array, 2))
}

// Lighting for PBR
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(2, 2, 5)
scene.add(directionalLight)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Always rotate the mesh
    mesh.rotation.y += 0.01
    mesh.rotation.x += 0.005

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()