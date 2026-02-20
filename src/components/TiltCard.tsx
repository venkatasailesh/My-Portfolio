import { useRef, type MouseEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from 'framer-motion'

interface Props extends HTMLMotionProps<"div"> {
    children: ReactNode
    className?: string
}

const TiltCard = ({ children, className = '', ...rest }: Props) => {
    const ref = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0.5)
    const y = useMotionValue(0.5)

    const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), { stiffness: 300, damping: 30 })
    const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), { stiffness: 300, damping: 30 })
    const brightness = useTransform(y, [0, 0.5, 1], [1.15, 1, 0.95])
    const glareX = useTransform(x, [0, 1], [0, 100])
    const glareY = useTransform(y, [0, 1], [0, 100])

    const handleMove = (e: MouseEvent) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        x.set((e.clientX - rect.left) / rect.width)
        y.set((e.clientY - rect.top) / rect.height)
    }

    const handleLeave = () => {
        x.set(0.5)
        y.set(0.5)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{
                rotateX,
                rotateY,
                filter: useTransform(brightness, (v) => `brightness(${v})`),
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                ...rest.style,
            }}
            className={className}
            {...rest}
        >
            {children}
            {/* Glare overlay */}
            <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: useTransform(
                        [glareX, glareY],
                        ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.08) 0%, transparent 60%)`
                    ),
                }}
            />
        </motion.div>
    )
}

export default TiltCard
