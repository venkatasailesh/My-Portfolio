import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ── Corporate tower blueprints ────────────────────────────────
// Inspired by real glass high-rise profiles: tiered setbacks,
// curtain-wall glazing, mechanical penthouses, spires.
interface TowerDef {
    x: number; z: number
    base: { w: number; d: number; floors: number }
    setbacks?: { floorStart: number; scaleFactor: number }[]
    glassColor: number      // facade glass tint
    frameColor: number      // mullion / frame color
    accentColor: number     // rooftop / signage accent
    features: ('spire' | 'helipad' | 'penthouse' | 'dome' | 'fins')[]
}

const FLOOR_H = 0.17

const TOWERS: TowerDef[] = [
    // ── Central Hero Tower (like Salesforce / One World Trade silhouette)
    {
        x: 0, z: 0,
        base: { w: 1.3, d: 1.3, floors: 36 },
        setbacks: [
            { floorStart: 24, scaleFactor: 0.80 },
            { floorStart: 30, scaleFactor: 0.60 },
        ],
        glassColor: 0x1a3c5e, frameColor: 0x8aafc8, accentColor: 0x38bdf8,
        features: ['spire', 'penthouse'],
    },
    // ── Left Corporate HQ (wide rectangular slab)
    {
        x: -3.0, z: 0.3,
        base: { w: 1.6, d: 0.9, floors: 26 },
        setbacks: [{ floorStart: 18, scaleFactor: 0.85 }],
        glassColor: 0x162a3a, frameColor: 0x607d8b, accentColor: 0x7c3aed,
        features: ['penthouse', 'fins'],
    },
    // ── Right Finance Tower (tapered pinstripe)
    {
        x: 3.2, z: 0.2,
        base: { w: 1.1, d: 1.1, floors: 30 },
        setbacks: [
            { floorStart: 20, scaleFactor: 0.82 },
            { floorStart: 27, scaleFactor: 0.65 },
        ],
        glassColor: 0x1c3f2f, frameColor: 0x7aaB8a, accentColor: 0xc6f135,
        features: ['spire', 'helipad'],
    },
    // ── Far-left mid-rise (boutique office block)
    {
        x: -5.5, z: -0.2,
        base: { w: 1.2, d: 1.0, floors: 18 },
        glassColor: 0x1e2d40, frameColor: 0x546e7a, accentColor: 0xa78bfa,
        features: ['penthouse'],
    },
    // ── Far-right tower
    {
        x: 5.8, z: 0.4,
        base: { w: 1.0, d: 1.2, floors: 20 },
        setbacks: [{ floorStart: 14, scaleFactor: 0.78 }],
        glassColor: 0x1a2535, frameColor: 0x5c7a9a, accentColor: 0x38bdf8,
        features: ['dome'],
    },
    // ── Medium background fills
    {
        x: -1.8, z: 2.0,
        base: { w: 1.0, d: 0.8, floors: 14 },
        glassColor: 0x192435, frameColor: 0x4a6a80, accentColor: 0x818cf8,
        features: ['penthouse'],
    },
    {
        x: 1.6, z: -2.0,
        base: { w: 0.9, d: 1.1, floors: 16 },
        glassColor: 0x1a2e3e, frameColor: 0x567a8a, accentColor: 0x7c3aed,
        features: ['fins'],
    },
    // ── Far background silhouettes
    {
        x: -7.2, z: -0.5,
        base: { w: 1.8, d: 1.4, floors: 10 },
        glassColor: 0x111d2a, frameColor: 0x334455, accentColor: 0x334455,
        features: [],
    },
    {
        x: 7.4, z: -0.3,
        base: { w: 1.5, d: 1.2, floors: 12 },
        glassColor: 0x111d2a, frameColor: 0x334455, accentColor: 0x334455,
        features: [],
    },
]

// ── Build one section of a curtain-wall facade ─────────────────
function addCurtainWall(
    parent: THREE.Group,
    w: number, h: number, d: number,
    yCenter: number,
    glassColor: number,
    frameColor: number,
    accentColor: number,
) {
    const PANEL_W = 0.18, PANEL_H = FLOOR_H * 0.82
    const colsF = Math.max(2, Math.round(w / PANEL_W))
    const rowsF = Math.max(1, Math.round(h / PANEL_H))
    const colsD = Math.max(2, Math.round(d / PANEL_W))

    // Helper to stamp panels on a face
    const stampFace = (
        facePanelCols: number,
        faceW: number,
        positionFn: (u: number, v: number) => THREE.Vector3,
        normalY: number,
    ) => {
        for (let r = 0; r < rowsF; r++) {
            for (let c = 0; c < facePanelCols; c++) {
                const u = (c / (facePanelCols - 1 || 1) - 0.5) * faceW * 0.88
                const v = (r / (rowsF - 1 || 1) - 0.5) * h * 0.90

                // Glass panel
                const glassGeo = new THREE.PlaneGeometry(
                    faceW / facePanelCols * 0.78,
                    PANEL_H * 0.80,
                )
                const lit = Math.random() > 0.30
                const glassMat = new THREE.MeshBasicMaterial({
                    color: lit
                        ? (Math.random() > 0.72 ? accentColor : glassColor)
                        : 0x080e18,
                    transparent: true,
                    opacity: lit ? (0.55 + Math.random() * 0.35) : 0.18,
                })
                const glassMesh = new THREE.Mesh(glassGeo, glassMat)
                const pos = positionFn(u, v + yCenter)
                glassMesh.position.copy(pos)
                glassMesh.rotation.y = normalY
                parent.add(glassMesh)
            }
        }
    }

    // Front / back faces
    stampFace(colsF, w,
        (u, v) => new THREE.Vector3(u, v, d / 2 + 0.002), 0)
    stampFace(colsF, w,
        (u, v) => new THREE.Vector3(u, v, -d / 2 - 0.002), Math.PI)
    // Side faces
    stampFace(colsD, d,
        (u, v) => new THREE.Vector3(w / 2 + 0.002, v, u), Math.PI / 2)
    stampFace(colsD, d,
        (u, v) => new THREE.Vector3(-w / 2 - 0.002, v, u), -Math.PI / 2)

    // Horizontal mullion bands (floor plates visible from outside)
    for (let r = 0; r <= rowsF; r++) {
        const bandY = yCenter - h / 2 + (r / rowsF) * h
        const frontGeo = new THREE.PlaneGeometry(w, 0.016)
        const bandMat = new THREE.MeshBasicMaterial({ color: frameColor, transparent: true, opacity: 0.35 })
        const band = new THREE.Mesh(frontGeo, bandMat)
        band.position.set(0, bandY, d / 2 + 0.003)
        parent.add(band)
        const bandB = band.clone()
        bandB.rotation.y = Math.PI
        bandB.position.set(0, bandY, -d / 2 - 0.003)
        parent.add(bandB)
    }
}

// ── Build a full corporate tower ──────────────────────────────
function makeTower(def: TowerDef): THREE.Group {
    const group = new THREE.Group()
    group.position.set(def.x, 0, def.z)

    let currentW = def.base.w
    let currentD = def.base.d
    let floorBase = 0

    // Collect all segments: base + setbacks
    interface Segment { w: number; d: number; floors: number; yStart: number }
    const segments: Segment[] = []

    let prevFloor = 0
    ;(def.setbacks ?? []).forEach(sb => {
        segments.push({ w: currentW, d: currentD, floors: sb.floorStart - prevFloor, yStart: prevFloor * FLOOR_H })
        currentW *= sb.scaleFactor
        currentD *= sb.scaleFactor
        prevFloor = sb.floorStart
    })
    segments.push({ w: currentW, d: currentD, floors: def.base.floors - prevFloor, yStart: prevFloor * FLOOR_H })

    // Build each segment
    segments.forEach(seg => {
        const h = seg.floors * FLOOR_H
        const yCenter = seg.yStart + h / 2

        // Structural shell
        const shellGeo = new THREE.BoxGeometry(seg.w, h, seg.d)
        const shellMat = new THREE.MeshStandardMaterial({
            color: def.glassColor,
            metalness: 0.85,
            roughness: 0.15,
            envMapIntensity: 1,
            emissive: new THREE.Color(def.accentColor),
            emissiveIntensity: 0.018,
        })
        const shell = new THREE.Mesh(shellGeo, shellMat)
        shell.position.y = yCenter
        shell.castShadow = true
        group.add(shell)

        // Corner columns (steel)
        const colH = h + 0.02
        const colGeo = new THREE.BoxGeometry(0.04, colH, 0.04)
        const colMat = new THREE.MeshStandardMaterial({ color: def.frameColor, metalness: 0.9, roughness: 0.1 })
        ;[[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([sx, sz]) => {
            const col = new THREE.Mesh(colGeo, colMat)
            col.position.set(sx * seg.w / 2, yCenter, sz * seg.d / 2)
            group.add(col)
        })

        // Edge glow silhouette
        const edgeMat = new THREE.LineBasicMaterial({ color: def.accentColor, transparent: true, opacity: 0.20 })
        const edgeLines = new THREE.LineSegments(new THREE.EdgesGeometry(shellGeo), edgeMat)
        edgeLines.position.set(0, yCenter, 0)
        group.add(edgeLines)

        // Curtain wall panels + mullions
        addCurtainWall(group, seg.w, h, seg.d, yCenter, def.glassColor, def.frameColor, def.accentColor)

        floorBase = seg.yStart + h
    })

    const roofY = def.base.floors * FLOOR_H

    // ── Rooftop ledge ─────────────────────────────────────────
    const ledgeGeo = new THREE.BoxGeometry(currentW + 0.08, 0.05, currentD + 0.08)
    const ledgeMat = new THREE.MeshBasicMaterial({ color: def.accentColor, transparent: true, opacity: 0.75 })
    const ledge = new THREE.Mesh(ledgeGeo, ledgeMat)
    ledge.position.y = roofY + 0.025
    group.add(ledge)

    // ── Mechanical penthouse ──────────────────────────────────
    if (def.features.includes('penthouse') || def.features.includes('spire') || def.features.includes('helipad')) {
        const phW = currentW * 0.55, phD = currentD * 0.55, phH = 0.28
        const phGeo = new THREE.BoxGeometry(phW, phH, phD)
        const phMat = new THREE.MeshStandardMaterial({ color: def.frameColor, metalness: 0.8, roughness: 0.3 })
        const ph = new THREE.Mesh(phGeo, phMat)
        ph.position.y = roofY + phH / 2
        group.add(ph)

        // Vertical louvres on penthouse
        for (let i = 0; i < 5; i++) {
            const lx = (i / 4 - 0.5) * phW * 0.8
            const louGeo = new THREE.BoxGeometry(0.02, phH * 0.7, 0.01)
            const louMesh = new THREE.Mesh(louGeo, new THREE.MeshBasicMaterial({ color: def.accentColor, transparent: true, opacity: 0.4 }))
            louMesh.position.set(lx, roofY + phH / 2, phD / 2 + 0.008)
            group.add(louMesh)
        }
        floorBase = roofY + phH
    }

    // ── Spire ─────────────────────────────────────────────────
    if (def.features.includes('spire')) {
        const spireH = 0.9 + Math.random() * 0.4
        const spireGeo = new THREE.ConeGeometry(0.03, spireH, 6)
        const spireMat = new THREE.MeshStandardMaterial({ color: def.frameColor, metalness: 0.95, roughness: 0.05 })
        const spire = new THREE.Mesh(spireGeo, spireMat)
        spire.position.y = floorBase + spireH / 2
        group.add(spire)

        // Blinking beacon at tip
        const beaconGeo = new THREE.SphereGeometry(0.025, 8, 8)
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 1 })
        const beacon = new THREE.Mesh(beaconGeo, beaconMat)
        beacon.position.y = floorBase + spireH + 0.03
        beacon.userData.isBeacon = true
        group.add(beacon)
    }

    // ── Helipad ───────────────────────────────────────────────
    if (def.features.includes('helipad')) {
        const padGeo = new THREE.CircleGeometry(currentW * 0.38, 32)
        const padMat = new THREE.MeshBasicMaterial({ color: 0x1e3a2a, transparent: true, opacity: 0.9 })
        const pad = new THREE.Mesh(padGeo, padMat)
        pad.rotation.x = -Math.PI / 2
        pad.position.y = roofY + 0.06
        group.add(pad)
        // H marking
        const hMarkGeo = new THREE.RingGeometry(currentW * 0.28, currentW * 0.36, 32)
        const hMarkMesh = new THREE.Mesh(hMarkGeo, new THREE.MeshBasicMaterial({ color: def.accentColor, transparent: true, opacity: 0.7 }))
        hMarkMesh.rotation.x = -Math.PI / 2
        hMarkMesh.position.y = roofY + 0.065
        group.add(hMarkMesh)
    }

    // ── Vertical fin cladding (like Willis Tower) ─────────────
    if (def.features.includes('fins')) {
        const finCount = 6
        for (let i = 0; i < finCount; i++) {
            const t = i / (finCount - 1)
            const fx = (t - 0.5) * def.base.w * 1.05
            const finH = def.base.floors * FLOOR_H * (0.7 + Math.random() * 0.3)
            const finGeo = new THREE.BoxGeometry(0.02, finH, 0.04)
            const finMat = new THREE.MeshStandardMaterial({ color: def.frameColor, metalness: 0.9, roughness: 0.1 })
            const fin = new THREE.Mesh(finGeo, finMat)
            fin.position.set(fx, finH / 2, def.base.d / 2 + 0.025)
            group.add(fin)
        }
    }

    // ── Dome (like Lloyds / Gherkin top) ─────────────────────
    if (def.features.includes('dome')) {
        const domeGeo = new THREE.SphereGeometry(currentW * 0.5, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2)
        const domeMat = new THREE.MeshStandardMaterial({
            color: def.glassColor,
            metalness: 0.9, roughness: 0.1,
            transparent: true, opacity: 0.7,
        })
        const dome = new THREE.Mesh(domeGeo, domeMat)
        dome.position.y = roofY + 0.05
        group.add(dome)
        const domeEdge = new THREE.LineSegments(
            new THREE.EdgesGeometry(domeGeo),
            new THREE.LineBasicMaterial({ color: def.accentColor, transparent: true, opacity: 0.4 })
        )
        domeEdge.position.y = roofY + 0.05
        group.add(domeEdge)
    }

    return group
}

// ── Main component ─────────────────────────────────────────────
const CityBackground = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const mount = mountRef.current
        if (!mount) return
        try {
            const test = document.createElement('canvas')
            if (!test.getContext('webgl2') && !test.getContext('webgl')) return
        } catch { return }

        const W = mount.clientWidth, H = mount.clientHeight
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(W, H)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFShadowMap
        renderer.setClearColor(0x000000, 0)
        mount.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        scene.fog = new THREE.FogExp2(0x04080f, 0.038)

        const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100)
        camera.position.set(0, 4.5, 12)
        camera.lookAt(0, 3, 0)

        // ── Lighting ─────────────────────────────────────────
        scene.add(new THREE.AmbientLight(0x0a1828, 8))
        const moonLight = new THREE.DirectionalLight(0x7090b0, 1.0)
        moonLight.position.set(-6, 12, 4)
        moonLight.castShadow = true
        moonLight.shadow.mapSize.set(1024, 1024)
        scene.add(moonLight)
        // Cool city glow from below
        scene.add(new THREE.HemisphereLight(0x0d1f40, 0x050a10, 0.6))

        // ── Ground (reflective wet road) ──────────────────────
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x050c18,
            metalness: 0.6,
            roughness: 0.4,
        })
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), groundMat)
        ground.rotation.x = -Math.PI / 2
        ground.receiveShadow = true
        scene.add(ground)

        // Fine grid (city block lines)
        const grid = new THREE.GridHelper(30, 30, 0x1a2d45, 0x0d1825)
        grid.position.y = 0.004
        scene.add(grid)

        // ── Build city ────────────────────────────────────────
        const beaconMeshes: THREE.Mesh[] = []
        TOWERS.forEach(def => {
            const g = makeTower(def)
            scene.add(g)
            g.traverse(child => {
                if (child instanceof THREE.Mesh && child.userData.isBeacon) {
                    beaconMeshes.push(child)
                }
            })
        })

        // ── Stars ─────────────────────────────────────────────
        const starPos = new Float32Array(350 * 3)
        for (let i = 0; i < 350; i++) {
            starPos[i * 3]     = (Math.random() - 0.5) * 80
            starPos[i * 3 + 1] = 8 + Math.random() * 25
            starPos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5
        }
        const starGeo = new THREE.BufferGeometry()
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
        scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.07, transparent: true, opacity: 0.5 })))

        // ── Mouse / resize ────────────────────────────────────
        const mouse = { x: 0, y: 0 }
        const onMove = (e: MouseEvent) => {
            const rect = mount.getBoundingClientRect()
            mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
            mouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2
        }
        const onResize = () => {
            const w = mount.clientWidth, h = mount.clientHeight
            camera.aspect = w / h; camera.updateProjectionMatrix()
            renderer.setSize(w, h)
        }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('resize', onResize)

        // ── Animate ───────────────────────────────────────────
        let animId: number
        const startTime = performance.now()

        const animate = () => {
            animId = requestAnimationFrame(animate)
            const t = (performance.now() - startTime) / 1000

            // Beacons blink at ~1.2 Hz
            const on = Math.floor(t * 1.2) % 2 === 0
            beaconMeshes.forEach(b => {
                ;(b.material as THREE.MeshBasicMaterial).opacity = on ? 1 : 0.06
            })

            // Gentle mouse parallax
            camera.position.x += (mouse.x * 1.4 - camera.position.x) * 0.018
            camera.position.y += (4.5 + mouse.y * 0.4 - camera.position.y) * 0.018
            camera.lookAt(0, 3, 0)

            renderer.render(scene, camera)
        }
        animate()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('resize', onResize)
            renderer.dispose()
            if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
        }
    }, [])

    return <div ref={mountRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}

export default CityBackground
