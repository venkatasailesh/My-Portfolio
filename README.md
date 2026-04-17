# V Venkata Sailesh — Software Engineer Portfolio

A premium, immersive personal portfolio built with React, TypeScript, and Three.js. It showcases professional experience, skills, education, and projects through cinematic animations and interactive 3D scenes.

## 🚀 Live Demo

*(Add your Vercel or Netlify link here once deployed)*

## ✨ Features

### 🎬 Cinematic Entrance
- **Skeleton Loader** — Custom staggered shimmer skeleton with framer-motion while assets load.
- **Text Reveal** — Antigravity-style text scramble animation on the hero section name.

### 🌌 Interactive 3D Scenes (Three.js / React Three Fiber)
Each major section features a unique, lazy-loaded 3D background:

| Section | 3D Scene | Description |
|---------|----------|-------------|
| **Hero** | `CanvasParticles` | Custom-built starfield with twinkling stars, mouse parallax, and shooting stars |
| **About** | `NeuralNetwork` | Real-time animated neural network with interconnected nodes and synaptic pulses |
| **Skills** | `NoiseSphere` | Organic noise-displaced icosahedron with simplex noise, bloom post-processing, and mouse reactivity |
| **Experience** | `CityBackground` | Corporate glass-tower cityscape with dynamic lighting |
| **Education** | `Orrery` | Solar-system orrery with orbiting planets and ambient glow |
| **Contact** | `WaveTerrain` | Undulating wave terrain mesh with gradient coloring |

### 🎨 Premium UI & Animations
- **Glassmorphism UI** — Frosted-glass navigation bar, bento-box styled cards, and modern design tokens.
- **Magnetic 3D Tilt Cards** — Framer Motion powered perspective transforms on experience and contact cards (`TiltCard`).
- **Animated Counters** — Smooth number count-up animations for statistics (`AnimatedCounter`).
- **Custom Cursor** — Bespoke magnetic cursor with hover effects (`Cursor`).
- **Bloom Post-Processing** — HDR bloom via `@react-three/postprocessing` on select 3D scenes.

### 📱 Responsive & Performant
- **Fully Responsive** — Flawless layout across desktop, tablet, and mobile viewports.
- **Lazy-Loaded 3D** — All Three.js scenes are code-split with `React.lazy()` and `Suspense` for fast initial paint.
- **WebGL Detection** — Graceful fallback when WebGL is unavailable.
- **Optimized Rendering** — DPR capping, efficient shader uniforms, and minimal re-renders.

### 📬 Contact Integration
- Direct form submission configured via **FormSubmit**.

## 💻 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 + Vite 6 |
| **Language** | TypeScript 5 |
| **3D Graphics** | Three.js, React Three Fiber, React Three Drei, React Three Postprocessing |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |

## 📁 Project Structure

```
src/
├── components/
│   ├── Hero.tsx              # Hero section with starfield background
│   ├── About.tsx             # About section with neural network
│   ├── Skills.tsx            # Skills section with noise sphere
│   ├── Experience.tsx        # Work experience with city background
│   ├── Education.tsx         # Education with orrery
│   ├── Contact.tsx           # Contact form with wave terrain
│   ├── Navbar.tsx            # Glassmorphism navigation bar
│   ├── CanvasParticles.tsx   # 3D starfield scene
│   ├── NeuralNetwork.tsx     # 3D neural network scene
│   ├── NoiseSphere.tsx       # 3D noise-displaced sphere scene
│   ├── CityBackground.tsx    # 3D glass-tower city scene
│   ├── Orrery.tsx            # 3D solar system orrery scene
│   ├── WaveTerrain.tsx       # 3D wave terrain scene
│   ├── Skeleton.tsx          # Loading skeleton screen
│   ├── TiltCard.tsx          # 3D perspective tilt card
│   ├── AnimatedCounter.tsx   # Count-up number animation
│   ├── AntigravityText.tsx   # Text scramble reveal effect
│   └── Cursor.tsx            # Custom magnetic cursor
└── ...
```

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/venkatasailesh/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open** `http://localhost:5173/` in your browser.

## 📦 Building for Production

```bash
npm run build
```

Runs the TypeScript compiler (`tsc -b`) and Vite bundler to output optimized static files into the `dist/` directory.

## 📬 Contact

- **Email**: [vvenkatasailesh@gmail.com](mailto:vvenkatasailesh@gmail.com)
- **LinkedIn**: [Venkata Sailesh](https://www.linkedin.com/in/venkata-sailesh-27b0b11bb)
- **GitHub**: [@venkatasailesh](https://github.com/venkatasailesh)
