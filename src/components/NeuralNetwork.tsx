import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ── Network Architecture ─────────────────────────────────────
// Input(4) → Hidden1(6) → Hidden2(6) → Hidden3(5) → Output(3)
const ARCH = [4, 6, 6, 5, 3]


const LAYER_COLORS = [
    0x7dd3fc,   // input  — bright sky
    0xc084fc,   // h1     — bright violet
    0xe0aaff,   // h2     — bright lavender
    0x818cf8,   // h3     — bright indigo
    0xd9f97c,   // output — bright lime
]

const EDGE_OPACITY_RANGE: [number, number] = [0.38, 0.75]

interface NodeObj {
    mesh: THREE.Mesh
    glow: THREE.Mesh
    layerIdx: number
    nodeIdx: number
    worldPos: THREE.Vector3
    activationT: number   // 0=idle, 1=fully lit
}

interface Edge {
    line: THREE.Line
    from: NodeObj
    to: NodeObj
    weight: number        // simulated weight 0..1
}

interface Signal {
    sphere: THREE.Mesh
    from: THREE.Vector3
    to: THREE.Vector3
    t: number
    speed: number
    targetNode: NodeObj
    edgeIdx: number
}



const NeuralNetwork = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const mount = mountRef.current
        if (!mount) return

        try {
            const test = document.createElement('canvas')
            if (!test.getContext('webgl2') && !test.getContext('webgl')) return
        } catch { return }

        // ── Renderer ──────────────────────────────────────────
        const W = mount.clientWidth, H = mount.clientHeight
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(W, H)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)
        mount.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 100)
        camera.position.set(0, 0, 9)

        // ── Ambient ───────────────────────────────────────────
        scene.add(new THREE.AmbientLight(0x111122, 3))

        // ── Build nodes ───────────────────────────────────────
        const allNodes: NodeObj[] = []
        const layerGroups: NodeObj[][] = []

        const xSpan = 14          // full horizontal spread
        const yMult = 1.4          // taller vertical spread
        const nodeGeoS = new THREE.SphereGeometry(0.18, 20, 20)
        const glowGeoS = new THREE.SphereGeometry(0.32, 16, 16)

        ARCH.forEach((count, li) => {
            const x = (li / (ARCH.length - 1) - 0.5) * xSpan
            const ySpan = Math.max(count - 1, 1) * 0.85 * yMult
            const group: NodeObj[] = []

            for (let ni = 0; ni < count; ni++) {
                const y = count > 1 ? (ni / (count - 1) - 0.5) * ySpan : 0
                const color = LAYER_COLORS[li]

                // Core sphere
                const mat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b })
                const mesh = new THREE.Mesh(nodeGeoS, mat.clone())
                mesh.position.set(x, y, 0)
                scene.add(mesh)

                // Outer ring glow (dim when idle)
                const glowMat = new THREE.MeshBasicMaterial({
                    color,
                    transparent: true,
                    opacity: 0.12,
                    side: THREE.BackSide,
                })
                const glow = new THREE.Mesh(glowGeoS, glowMat.clone())
                glow.position.copy(mesh.position)
                scene.add(glow)

                // Border ring
                const ringGeo = new THREE.TorusGeometry(0.18, 0.022, 8, 48)
                const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55 })
                const ring = new THREE.Mesh(ringGeo, ringMat)
                ring.position.copy(mesh.position)
                scene.add(ring)

                const node: NodeObj = {
                    mesh, glow,
                    layerIdx: li, nodeIdx: ni,
                    worldPos: mesh.position.clone(),
                    activationT: 0,
                }
                allNodes.push(node)
                group.push(node)
            }
            layerGroups.push(group)
        })

        // ── Build edges with random weights ───────────────────
        const edges: Edge[] = []
        const linePositions: THREE.BufferGeometry[] = []

        for (let li = 0; li < layerGroups.length - 1; li++) {
            const fromLayer = layerGroups[li]
            const toLayer   = layerGroups[li + 1]

            fromLayer.forEach(from => {
                toLayer.forEach(to => {
                    const weight = 0.15 + Math.random() * 0.85
                    const opacity = EDGE_OPACITY_RANGE[0] + weight * (EDGE_OPACITY_RANGE[1] - EDGE_OPACITY_RANGE[0])

                    const geo = new THREE.BufferGeometry().setFromPoints([from.worldPos, to.worldPos])
                    const mat = new THREE.LineBasicMaterial({
                        color: LAYER_COLORS[li],
                        transparent: true,
                        opacity,
                    })
                    const line = new THREE.Line(geo, mat)
                    scene.add(line)
                    linePositions.push(geo)
                    edges.push({ line, from, to, weight })
                })
            })
        }



        // ── Signals ───────────────────────────────────────────
        const signals: Signal[] = []
        const sigGeo = new THREE.SphereGeometry(0.055, 10, 10)

        // Forward-pass wave: fires one full layer at a time
        let currentForwardLayer = 0
        const SIGNAL_INTERVAL = 0.18  // seconds between firing signals within a layer
        const LAYER_PAUSE = 1.4       // seconds pause between layer activations
        let layerPause = 0

        const fireLayerSignals = (fromLayerIdx: number) => {
            const fromLayer = layerGroups[fromLayerIdx]
            const toLayer   = layerGroups[fromLayerIdx + 1]
            if (!toLayer) return

            fromLayer.forEach((from, fi) => {
                toLayer.forEach(to => {
                    const edge = edges.find(e => e.from === from && e.to === to)
                    if (!edge || Math.random() > edge.weight * 0.9 + 0.1) return

                    const delay = fi * SIGNAL_INTERVAL
                    setTimeout(() => {
                        const mat = new THREE.MeshBasicMaterial({
                            color: LAYER_COLORS[fromLayerIdx],
                            transparent: true,
                            opacity: 1,
                        })
                        const sphere = new THREE.Mesh(sigGeo, mat)
                        sphere.position.copy(from.worldPos)
                        scene.add(sphere)
                        signals.push({
                            sphere,
                            from: from.worldPos.clone(),
                            to: to.worldPos.clone(),
                            t: 0,
                            speed: 0.006 + edge.weight * 0.006,
                            targetNode: to,
                            edgeIdx: edges.indexOf(edge),
                        })
                    }, delay * 1000)
                })
            })
        }

        // ── Mouse ─────────────────────────────────────────────
        const mouse = { x: 0, y: 0 }
        const onMove = (e: MouseEvent) => {
            const rect = mount.getBoundingClientRect()
            mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
            mouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2
        }
        window.addEventListener('mousemove', onMove)

        // ── Resize ────────────────────────────────────────────
        const onResize = () => {
            const w = mount.clientWidth, h = mount.clientHeight
            camera.aspect = w / h; camera.updateProjectionMatrix()
            renderer.setSize(w, h)
        }
        window.addEventListener('resize', onResize)

        // ── Animate ───────────────────────────────────────────
        let animId: number
        let lastTime = performance.now()
        const startTime = performance.now()
        fireLayerSignals(0)     // kick off immediately

        const animate = () => {
            animId = requestAnimationFrame(animate)
            const now = performance.now()
            const dt = (now - lastTime) / 1000
            lastTime = now
            const t = (now - startTime) / 1000

            // Forward-pass orchestration
            layerPause += dt
            if (layerPause >= LAYER_PAUSE) {
                layerPause = 0
                fireLayerSignals(currentForwardLayer)
                currentForwardLayer = (currentForwardLayer + 1) % (ARCH.length - 1)
            }

            // Nodes: idle float + activation glow
            allNodes.forEach((n, i) => {
                // Float
                n.mesh.position.y = n.worldPos.y + Math.sin(t * 0.5 + i * 0.7) * 0.04

                // Decay activation
                n.activationT = Math.max(0, n.activationT - dt * 1.2)

                // Core color: lerp between dark idle and layer color
                const color = LAYER_COLORS[n.layerIdx]
                const mat = n.mesh.material as THREE.MeshBasicMaterial
                const act = n.activationT
                const r = ((color >> 16) & 0xff) / 255
                const g = ((color >> 8)  & 0xff) / 255
                const b =  (color        & 0xff) / 255
                mat.color.setRGB(r * act * 0.9 + 0.06, g * act * 0.9 + 0.05, b * act * 0.9 + 0.12)

                // Glow
                const glowMat = n.glow.material as THREE.MeshBasicMaterial
                glowMat.opacity = 0.08 + act * 0.55
                n.glow.position.copy(n.mesh.position)
                n.glow.scale.setScalar(1 + act * 0.6)
            })

            // Move signals
            for (let i = signals.length - 1; i >= 0; i--) {
                const sig = signals[i]
                sig.t += sig.speed

                if (sig.t >= 1) {
                    // Activate target node
                    sig.targetNode.activationT = 1.0

                    // Brighten edge briefly
                    if (edges[sig.edgeIdx]) {
                        const eMat = edges[sig.edgeIdx].line.material as THREE.LineBasicMaterial
                        const baseOp = EDGE_OPACITY_RANGE[0] + edges[sig.edgeIdx].weight * (EDGE_OPACITY_RANGE[1] - EDGE_OPACITY_RANGE[0])
                        eMat.opacity = 1.0
                        setTimeout(() => { eMat.opacity = baseOp }, 250)
                    }

                    scene.remove(sig.sphere)
                    ;(sig.sphere.material as THREE.Material).dispose()
                    signals.splice(i, 1)
                } else {
                    // Interpolate along edge
                    const adjusted = Math.pow(sig.t, 0.85)   // ease-in feel
                    sig.sphere.position.lerpVectors(sig.from, sig.to, adjusted)

                    // Pulse size
                    const pulse = 1 + Math.sin(sig.t * Math.PI * 4) * 0.3
                    sig.sphere.scale.setScalar(pulse)

                    // Fade near end
                    ;(sig.sphere.material as THREE.MeshBasicMaterial).opacity =
                        sig.t < 0.75 ? 1 : 1 - (sig.t - 0.75) / 0.25
                }
            }

            // Camera subtle sway from mouse
            camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.025
            camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.025
            camera.lookAt(scene.position)

            renderer.render(scene, camera)
        }
        animate()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('resize', onResize)
            renderer.dispose()
            nodeGeoS.dispose(); glowGeoS.dispose(); sigGeo.dispose()
            linePositions.forEach(g => g.dispose())
            if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
        }
    }, [])

    return <div ref={mountRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}

export default NeuralNetwork
