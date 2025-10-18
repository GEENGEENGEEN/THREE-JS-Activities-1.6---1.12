import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

console.log('Activity 1.9 script loaded');

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
camera.position.z = 1
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

// Vite serves static assets from /textures/ (publicDir = ../static/)
// So use "/textures/..." as the path
const colorTexture = textureLoader.load('/textures/maxresdefault.jpg')

// Door textures (for PBR demonstration)
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorAoTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// Texture optimization tip: Use power-of-2 sizes (e.g., 256x256, 512x512) for best GPU performance and mipmapping.
// Compression: Use compressed formats (like JPEG for color, PNG for alpha) and keep file sizes small for faster loading.

/**
 * Object with texture (MeshStandardMaterial for PBR)
 */
const pbrMaterial = new THREE.MeshStandardMaterial({
    map: colorTexture, // Try doorColorTexture for a more complex look
    // Uncomment below to use PBR textures:
    // aoMap: doorAoTexture,
    // normalMap: doorNormalTexture,
    // metalnessMap: doorMetalnessTexture,
    // roughnessMap: doorRoughnessTexture,
    // displacementMap: doorHeightTexture,
    // alphaMap: doorAlphaTexture,
    // transparent: true,
    metalness: 0.5,
    roughness: 0.5
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
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight.position.set(2, 2, 2)
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