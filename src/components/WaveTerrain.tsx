import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const WaveTerrain = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const mount = mountRef.current
        if (!mount) return

        // ── Scene setup ──────────────────────────────────────────────
        const scene = new THREE.Scene()
        const width = mount.clientWidth
        const height = mount.clientHeight

        const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100)
        camera.position.set(0, 4, 10)
        camera.lookAt(0, 0, 0)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)
        mount.appendChild(renderer.domElement)

        // ── Terrain geometry ─────────────────────────────────────────
        const SEGS = 80
        const geometry = new THREE.PlaneGeometry(28, 20, SEGS, SEGS)
        geometry.rotateX(-Math.PI / 2.6)

        const material = new THREE.MeshBasicMaterial({
            color: 0x7c3aed,
            wireframe: true,
            transparent: true,
            opacity: 0.18,
        })

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.y = -3
        scene.add(mesh)

        // Store original Y positions
        const pos = geometry.attributes.position as THREE.BufferAttribute
        const originY = new Float32Array(pos.count)
        for (let i = 0; i < pos.count; i++) {
            originY[i] = pos.getY(i)
        }

        // ── Resize handler ───────────────────────────────────────────
        const onResize = () => {
            const w = mount.clientWidth
            const h = mount.clientHeight
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            renderer.setSize(w, h)
        }
        window.addEventListener('resize', onResize)

        // ── Animation loop ───────────────────────────────────────────
        let animId: number
        const startTime = performance.now()

        const animate = () => {
            animId = requestAnimationFrame(animate)
            const t = (performance.now() - startTime) / 1000

            for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i)
                const z = pos.getZ(i)
                const wave =
                    Math.sin(x * 0.5 + t * 0.8) * 0.6 +
                    Math.sin(z * 0.4 + t * 0.6) * 0.5 +
                    Math.sin((x + z) * 0.3 + t * 1.0) * 0.35
                pos.setY(i, originY[i] + wave)
            }
            pos.needsUpdate = true
            geometry.computeVertexNormals()

            renderer.render(scene, camera)
        }
        animate()

        // ── Cleanup ──────────────────────────────────────────────────
        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', onResize)
            renderer.dispose()
            geometry.dispose()
            material.dispose()
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement)
            }
        }
    }, [])

    return (
        <div
            ref={mountRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
        />
    )
}

export default WaveTerrain
