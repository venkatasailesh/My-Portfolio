import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
    end: number
    suffix?: string
    className?: string
    duration?: number
}

const AnimatedCounter = ({ end, suffix = '', className = '', duration = 2000 }: Props) => {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true })
    const started = useRef(false)

    useEffect(() => {
        if (!inView || started.current) return
        started.current = true

        const startTime = Date.now()
        const step = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(parseFloat((eased * end).toFixed(1)))
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [inView, end, duration])

    const display = Number.isInteger(end) ? Math.round(count) : count.toFixed(1)

    return <span ref={ref} className={className}>{display}{suffix}</span>
}

export default AnimatedCounter
