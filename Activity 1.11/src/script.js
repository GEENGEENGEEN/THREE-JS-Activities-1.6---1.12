import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// Load cube environment map
const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png',
],
    () => console.log('Env map loaded'),
    undefined,
    (err) => console.error('Env map error', err)
)
scene.background = envMap

// Reflective cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 0,
    envMap: envMap
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.x = -1.5
scene.add(cube)

// Matcap texture for shiny text
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/1.png',
    () => console.log('Matcap loaded'),
    undefined,
    (err) => console.error('Matcap error', err)
)

// 3D Text
const fontLoader = new FontLoader()
fontLoader.load('/fonts/helvetiker_regular.typeface.json',
    (font) => {
        console.log('Font loaded')
        const textGeometry = new TextGeometry('Reflect!', {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        })
        textGeometry.center()
        console.log('Text geometry created')
        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        const textMesh = new THREE.Mesh(textGeometry, textMaterial)
        textMesh.position.x = 1.5
        scene.add(textMesh)
        console.log('Text mesh added to scene')
    },
    undefined,
    (err) => console.error('Font load error:', err)
)

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 0.7)
pointLight.position.set(2, 2, 2)
scene.add(pointLight)

// Sizes
const sizes = { width: window.innerWidth, height: window.innerHeight }
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
camera.position.z = 4
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
    cube.rotation.y = elapsedTime * 0.5
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()