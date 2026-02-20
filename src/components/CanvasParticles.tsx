import { useEffect, useRef } from "react"

const CanvasParticles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let stars: Star[] = []

        // Starfield Configuration
        const STAR_COUNT = 800 // High density for a rich night sky
        const MOUSE_INFLUENCE = 0.05 // Subtle parallax on mouse move

        // Resize Canvas
        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        window.addEventListener("resize", resize)
        resize()

        // Mouse tracking
        let mouse: { x: number | null; y: number | null } = { x: null, y: null }

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.x
            mouse.y = e.y
        }
        const handleMouseLeave = () => {
            mouse.x = null
            mouse.y = null
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseleave", handleMouseLeave)

        // Star Class definition
        class Star {
            x: number = 0
            y: number = 0
            z: number = 0
            size: number = 1
            baseX: number = 0
            baseY: number = 0
            twinkleSpeed: number = 0.05
            alpha: number = 1
            color: string = "rgba(255, 255, 255, 1)"

            constructor() {
                if (!canvas) return;
                // Distribute stars randomly across a 3D coordinate system (x, y, z)
                // z acts as our depth/parallax multiplier
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.z = Math.random() * 2 // Depth layer 0 (far) to 2 (near)

                this.baseX = this.x
                this.baseY = this.y

                // Stars closer to us (higher z) are larger
                this.size = Math.max(0.2, this.z * 1.5)

                // Randomize twinkling speed
                this.twinkleSpeed = (Math.random() * 0.02) + 0.005
                this.alpha = Math.random()

                // Slight color variation: mostly white, some faint blue/warm white
                const colorType = Math.random()
                if (colorType > 0.95) {
                    this.color = "200, 220, 255" // Faint blue star
                } else if (colorType > 0.90) {
                    this.color = "255, 250, 200" // Faint yellow star
                } else {
                    this.color = "255, 255, 255" // White star
                }
            }

            draw() {
                if (!ctx) return;

                // Twinkle effect (sine wave pulsing)
                this.alpha += this.twinkleSpeed
                const currentAlpha = Math.abs(Math.sin(this.alpha)) * (this.z / 2 + 0.5) // Further stars are dimmer overall

                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.closePath()

                // Draw star with glow
                ctx.fillStyle = `rgba(${this.color}, ${currentAlpha})`
                ctx.shadowBlur = this.z * 5 // Closer stars have bigger glow
                ctx.shadowColor = `rgba(${this.color}, ${currentAlpha})`
                ctx.fill()

                // Reset shadow to avoid affecting other draws
                ctx.shadowBlur = 0
            }

            update() {
                // Mouse Parallax Effect
                if (mouse.x && mouse.y && canvas) {
                    // Calculate distance from center of screen
                    const centerX = canvas.width / 2
                    const centerY = canvas.height / 2

                    const mouseDx = mouse.x - centerX
                    const mouseDy = mouse.y - centerY

                    // Apply parallax shift based on star's depth (z)
                    // Closer stars shift more than far stars
                    this.x = this.baseX - (mouseDx * MOUSE_INFLUENCE * this.z)
                    this.y = this.baseY - (mouseDy * MOUSE_INFLUENCE * this.z)
                } else {
                    // Smoothly return to base x if mouse leaves
                    this.x += (this.baseX - this.x) * 0.05
                    this.y = this.baseY
                }
            }
        }

        // Initialize stars
        const init = () => {
            stars = []
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push(new Star())
            }
        }

        // Animation Loop
        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (let i = 0; i < stars.length; i++) {
                stars[i].draw()
                stars[i].update()
            }
            animationFrameId = requestAnimationFrame(animate)
        }

        init()
        animate()

        // Cleanup
        return () => {
            window.removeEventListener("resize", resize)
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseleave", handleMouseLeave)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-auto"
            style={{
                background: "linear-gradient(to bottom, #0a0a0a, #151515)",
                width: "100%",
                height: "100%"
            }}
        />
    )
}

export default CanvasParticles
