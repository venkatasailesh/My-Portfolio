import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface PlanetDef {
  radius: number       // orbit radius
  size: number         // planet size
  speed: number        // orbital speed
  color: number
  ringColor: number
  tilt: number         // orbital tilt
  label: string
  startAngle: number
}

const PLANETS: PlanetDef[] = [
  {
    radius: 2.0, size: 0.32, speed: 0.28, tilt: 0.15,
    color: 0x38bdf8, ringColor: 0x38bdf8,
    label: 'Secondary', startAngle: 0,
  },
  {
    radius: 3.2, size: 0.45, speed: 0.16, tilt: 0.08,
    color: 0xf0c27f, ringColor: 0xf0c27f,
    label: 'Higher Sec', startAngle: 2.1,
  },
  {
    radius: 4.6, size: 0.58, speed: 0.10, tilt: 0.22,
    color: 0xc6f135, ringColor: 0xc6f135,
    label: 'B.Tech CS', startAngle: 4.5,
  },
]

const Orrery = () => {
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
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
    camera.position.set(0, 5.5, 10)
    camera.lookAt(0, 0, 0)

    // ── Sun ───────────────────────────────────────────────────
    const sunGeo = new THREE.SphereGeometry(0.7, 32, 32)
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
    const sun = new THREE.Mesh(sunGeo, sunMat)
    scene.add(sun)

    // Sun glow layers
    ;[1.0, 1.4, 1.9].forEach((scale, i) => {
      const g = new THREE.SphereGeometry(0.7 * scale, 32, 32)
      const m = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.06 - i * 0.015,
        side: THREE.BackSide,
      })
      scene.add(new THREE.Mesh(g, m))
    })

    // Sun point light
    scene.add(new THREE.PointLight(0xfbbf24, 3, 15))
    scene.add(new THREE.AmbientLight(0x1e1b4b, 1.5))

    // ── Star field ────────────────────────────────────────────
    const starCount = 250
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 40
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 40
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.6 })
    scene.add(new THREE.Points(starGeo, starMat))

    // ── Orbit rings + planets ─────────────────────────────────
    const planetMeshes: { mesh: THREE.Mesh; pivot: THREE.Object3D; def: PlanetDef; angle: number; trail: THREE.Points }[] = []

    PLANETS.forEach(def => {
      // Orbit ring
      const orbitGeo = new THREE.TorusGeometry(def.radius, 0.008, 8, 128)
      const orbitMat = new THREE.MeshBasicMaterial({ color: def.ringColor, transparent: true, opacity: 0.2 })
      const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat)
      orbitMesh.rotation.x = Math.PI / 2 + def.tilt
      scene.add(orbitMesh)

      // Pivot for orbital motion
      const pivot = new THREE.Object3D()
      pivot.rotation.x = def.tilt
      scene.add(pivot)

      // Planet
      const pGeo = new THREE.SphereGeometry(def.size, 24, 24)
      const pMat = new THREE.MeshStandardMaterial({
        color: def.color,
        emissive: new THREE.Color(def.color),
        emissiveIntensity: 0.25,
        roughness: 0.6,
        metalness: 0.3,
      })
      const planet = new THREE.Mesh(pGeo, pMat)
      planet.position.set(def.radius, 0, 0)
      pivot.add(planet)

      // Planet glow
      const glowGeo = new THREE.SphereGeometry(def.size * 1.5, 16, 16)
      const glowMat = new THREE.MeshBasicMaterial({ color: def.color, transparent: true, opacity: 0.08, side: THREE.BackSide })
      const glow = new THREE.Mesh(glowGeo, glowMat)
      planet.add(glow)

      // Trail (small points along orbit arc)
      const trailCount = 40
      const trailPos = new Float32Array(trailCount * 3)
      const trailGeo = new THREE.BufferGeometry()
      trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3))
      const trailMat = new THREE.PointsMaterial({ color: def.color, size: 0.05, transparent: true, opacity: 0.5, sizeAttenuation: true })
      const trail = new THREE.Points(trailGeo, trailMat)
      scene.add(trail)

      planetMeshes.push({ mesh: planet, pivot, def, angle: def.startAngle, trail })
    })

    // ── Mouse ─────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 }
    const onMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // ── Animation ─────────────────────────────────────────────
    let animId: number
    const startTime = performance.now()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = (performance.now() - startTime) / 1000

      // Sun pulse + rotate
      const pulse = 1 + Math.sin(t * 2) * 0.03
      sun.scale.setScalar(pulse)

      // Orbit planets
      planetMeshes.forEach(({ pivot, def, trail }, i) => {
        pivot.rotation.y = def.startAngle + t * def.speed

        // Update trail arc
        const trailPos = trail.geometry.attributes.position.array as Float32Array
        const trailCount = trailPos.length / 3
        for (let j = 0; j < trailCount; j++) {
          const angle = def.startAngle + t * def.speed - j * 0.12
          trailPos[j * 3]     = Math.cos(angle) * def.radius
          trailPos[j * 3 + 1] = Math.sin(angle * def.tilt) * 0.3
          trailPos[j * 3 + 2] = Math.sin(angle) * def.radius
        }
        trail.geometry.attributes.position.needsUpdate = true
        ;(trail.material as THREE.PointsMaterial).opacity = 0.3 + Math.sin(t + i) * 0.1
      })

      // Camera sway
      camera.position.x += (mouse.x * 2 - camera.position.x) * 0.015
      camera.position.y += (5 + mouse.y * 1 - camera.position.y) * 0.015
      camera.lookAt(0, 0, 0)

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

export default Orrery
