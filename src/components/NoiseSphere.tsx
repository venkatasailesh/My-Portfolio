import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// ─── Simplex 3D noise (compact implementation) ───────────────
const F3 = 1.0 / 3.0
const G3 = 1.0 / 6.0

const grad3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
]

function buildPerm() {
  const p: number[] = []
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]]
  }
  const perm = new Uint8Array(512)
  const permMod12 = new Uint8Array(512)
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255]
    permMod12[i] = perm[i] % 12
  }
  return { perm, permMod12 }
}

const { perm, permMod12 } = buildPerm()

function simplex3(x: number, y: number, z: number): number {
  const s = (x + y + z) * F3
  const i = Math.floor(x + s)
  const j = Math.floor(y + s)
  const k = Math.floor(z + s)
  const t = (i + j + k) * G3
  const X0 = i - t, Y0 = j - t, Z0 = k - t
  const x0 = x - X0, y0 = y - Y0, z0 = z - Z0

  let i1: number, j1: number, k1: number, i2: number, j2: number, k2: number
  if (x0 >= y0) {
    if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0 }
    else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1 }
    else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1 }
  } else {
    if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1 }
    else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1 }
    else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0 }
  }

  const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3
  const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3
  const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3

  const ii = i & 255, jj = j & 255, kk = k & 255

  const calc = (tx: number, ty: number, tz: number, gi: number) => {
    let tt = 0.6 - tx * tx - ty * ty - tz * tz
    if (tt < 0) return 0
    tt *= tt
    const g = grad3[gi]
    return tt * tt * (g[0] * tx + g[1] * ty + g[2] * tz)
  }

  return 32 * (
    calc(x0, y0, z0, permMod12[ii + perm[jj + perm[kk]]]) +
    calc(x1, y1, z1, permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]]) +
    calc(x2, y2, z2, permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]]) +
    calc(x3, y3, z3, permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]])
  )
}

// ─── Custom shader material ─────────────────────────────────
const vertexShader = `
  uniform float uTime;
  uniform float uNoiseScale;
  uniform float uDisplacementStrength;
  uniform vec2 uMouse;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  //
  // Simplex 3D noise in GLSL
  //
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normal;
    vPosition = position;

    // Layered noise for organic feel
    float noise1 = snoise(position * uNoiseScale + uTime * 0.3);
    float noise2 = snoise(position * uNoiseScale * 2.0 + uTime * 0.5) * 0.5;
    float noise3 = snoise(position * uNoiseScale * 4.0 + uTime * 0.2) * 0.25;
    
    float displacement = (noise1 + noise2 + noise3) * uDisplacementStrength;
    
    // Mouse influence - subtle pull toward mouse
    float mouseInfluence = dot(normalize(position.xy), uMouse) * 0.15;
    displacement += mouseInfluence;
    
    vDisplacement = displacement;

    vec3 newPosition = position + normal * displacement;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  void main() {
    // Gradient from accent green to white based on displacement + position
    vec3 accentGreen = vec3(0.776, 0.945, 0.208);  // #c6f135
    vec3 softWhite = vec3(0.95, 0.97, 0.98);
    vec3 deepGreen = vec3(0.3, 0.55, 0.1);
    
    // Mix based on displacement and vertical position
    float mixFactor = smoothstep(-0.3, 0.5, vDisplacement) + vPosition.y * 0.2;
    mixFactor = clamp(mixFactor, 0.0, 1.0);
    
    vec3 color = mix(deepGreen, accentGreen, mixFactor);
    color = mix(color, softWhite, smoothstep(0.6, 1.0, mixFactor));
    
    // Fresnel edge glow
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
    color += accentGreen * fresnel * 0.6;
    
    // Subtle pulsing brightness
    float pulse = sin(uTime * 0.8) * 0.05 + 1.0;
    color *= pulse;

    // Slight transparency at edges for ethereal feel
    float alpha = 0.85 + fresnel * 0.15;
    
    gl_FragColor = vec4(color, alpha);
  }
`

// ─── Sphere mesh with noise displacement ─────────────────────
function NoiseMesh({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uNoiseScale: { value: 1.2 },
    uDisplacementStrength: { value: 0.35 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), [])

  useFrame((state) => {
    if (!materialRef.current || !meshRef.current) return

    const t = state.clock.elapsedTime
    materialRef.current.uniforms.uTime.value = t

    // Smooth mouse follow
    const u = materialRef.current.uniforms.uMouse.value
    u.x += (mouse.current.x * 0.5 - u.x) * 0.03
    u.y += (mouse.current.y * 0.5 - u.y) * 0.03

    // Gentle autonomous rotation
    meshRef.current.rotation.y = t * 0.08
    meshRef.current.rotation.x = Math.sin(t * 0.12) * 0.15

    // Breathing scale
    const breathe = 1 + Math.sin(t * 0.6) * 0.03
    meshRef.current.scale.setScalar(breathe)
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.6, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ─── Ambient particle dust around the sphere ─────────────────
function ParticleDust() {
  const pointsRef = useRef<THREE.Points>(null!)
  const count = 200

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Distribute in a shell around the sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.0 + Math.random() * 1.5
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      sz[i] = Math.random() * 2 + 0.5
    }
    return { positions: pos, sizes: sz }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#c6f135"
        size={0.02}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// ─── Scene ───────────────────────────────────────────────────
function SphereScene({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 3, 5]} intensity={0.4} color="#c6f135" />
      <directionalLight position={[-3, -2, 3]} intensity={0.2} color="#ffffff" />

      <NoiseMesh mouse={mouse} />
      <ParticleDust />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          intensity={0.8}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

// ─── Exported component ──────────────────────────────────────
const NoiseSphere = () => {
  const mouse = useRef({ x: 0, y: 0 })
  const [hasWebGL, setHasWebGL] = useState(true)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handle)

    try {
      const c = document.createElement('canvas')
      if (!c.getContext('webgl2') && !c.getContext('webgl')) setHasWebGL(false)
    } catch {
      setHasWebGL(false)
    }

    return () => window.removeEventListener('mousemove', handle)
  }, [])

  if (!hasWebGL) return null

  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <SphereScene mouse={mouse} />
    </Canvas>
  )
}

export default NoiseSphere
