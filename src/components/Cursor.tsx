import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const Cursor = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 })
    const [hovered, setHovered] = useState(false)
    const [clicked, setClicked] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const move = (e: MouseEvent) => {
            setPos({ x: e.clientX, y: e.clientY })
            setVisible(true)
        }
        const down = () => setClicked(true)
        const up = () => setClicked(false)
        const leave = () => setVisible(false)

        const addHoverListeners = () => {
            document.querySelectorAll('a, button, .bento, input, textarea').forEach((el) => {
                el.addEventListener('mouseenter', () => setHovered(true))
                el.addEventListener('mouseleave', () => setHovered(false))
            })
        }

        window.addEventListener('mousemove', move)
        window.addEventListener('mousedown', down)
        window.addEventListener('mouseup', up)
        document.addEventListener('mouseleave', leave)
        addHoverListeners()

        const observer = new MutationObserver(addHoverListeners)
        observer.observe(document.body, { childList: true, subtree: true })

        return () => {
            window.removeEventListener('mousemove', move)
            window.removeEventListener('mousedown', down)
            window.removeEventListener('mouseup', up)
            document.removeEventListener('mouseleave', leave)
            observer.disconnect()
        }
    }, [])

    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null

    return (
        <>
            {/* Main dot */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference"
                animate={{
                    x: pos.x - (hovered ? 24 : 6),
                    y: pos.y - (hovered ? 24 : 6),
                    width: hovered ? 48 : 12,
                    height: hovered ? 48 : 12,
                    opacity: visible ? 1 : 0,
                    scale: clicked ? 0.8 : 1,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
                style={{ backgroundColor: '#c6f135' }}
            />
            {/* Trail ring */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-accent/30"
                animate={{
                    x: pos.x - 20,
                    y: pos.y - 20,
                    width: 40,
                    height: 40,
                    opacity: visible && !hovered ? 0.5 : 0,
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 1 }}
            />
        </>
    )
}

export default Cursor
