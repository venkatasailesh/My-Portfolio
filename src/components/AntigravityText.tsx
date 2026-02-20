import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface AntigravityTextProps {
    text: string
    className?: string
    delay?: number
}

const AntigravityText = ({ text, className = '', delay = 0 }: AntigravityTextProps) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" })

    // Split text into lines, then words, then characters to preserve spacing properly
    const words = text.split(' ').map(word => {
        return word.split('')
    })

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.02, // 20ms stagger exactly as Antigravity site
                delayChildren: delay,
            }
        }
    }

    const charVariants = {
        hidden: {
            opacity: 0,
            y: 30, // 30px translation
            filter: 'blur(10px)',
            scale: 1 // Removing scale as Antigravity strictly translates
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            scale: 1,
            transition: {
                duration: 0.8, // 800ms duration
                ease: [0.23, 1, 0.32, 1] as [number, number, number, number], // Ease Out Quint used for Liftoff effect
            }
        }
    }

    return (
        <span ref={ref} className={`inline-block ${className}`}>
            <motion.span
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                aria-label={text}
                className="inline-block"
            >
                {words.map((word, wordIndex) => (
                    <span key={wordIndex} className="inline-block whitespace-nowrap">
                        {word.map((char, charIndex) => (
                            <motion.span
                                key={`${wordIndex}-${charIndex}`}
                                variants={charVariants}
                                className="inline-block"
                            >
                                {char}
                            </motion.span>
                        ))}
                        {/* Add space between words, except for the last word */}
                        {wordIndex !== words.length - 1 && (
                            <span className="inline-block">&nbsp;</span>
                        )}
                    </span>
                ))}
            </motion.span>
        </span>
    )
}

export default AntigravityText
