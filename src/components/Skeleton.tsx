import { motion } from 'framer-motion'

const shimmer = {
    animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
        transition: {
            duration: 1.8,
            repeat: Infinity,
            ease: 'linear',
        },
    },
}

const SkeletonBlock = ({ className = '' }: { className?: string }) => (
    <motion.div
        variants={shimmer}
        animate="animate"
        className={`rounded-xl ${className}`}
        style={{
            background:
                'linear-gradient(90deg, #1a1a2e 25%, #252540 50%, #1a1a2e 75%)',
            backgroundSize: '400% 100%',
        }}
    />
)

const Skeleton = () => {
    return (
        <div className="fixed inset-0 bg-dark z-[99] overflow-hidden p-6 md:p-12 flex flex-col gap-6">
            {/* Navbar skeleton */}
            <div className="flex items-center justify-between mb-4">
                <SkeletonBlock className="h-7 w-32" />
                <div className="hidden md:flex gap-6">
                    {[...Array(5)].map((_, i) => (
                        <SkeletonBlock key={i} className="h-4 w-16" />
                    ))}
                </div>
                <SkeletonBlock className="h-9 w-24 rounded-xl" />
            </div>

            {/* Hero skeleton */}
            <div className="flex-1 flex flex-col justify-center gap-5 max-w-[1400px] mx-auto w-full">
                <SkeletonBlock className="h-4 w-28" />
                <SkeletonBlock className="h-16 md:h-24 w-3/4" />
                <SkeletonBlock className="h-16 md:h-24 w-1/2" />
                <SkeletonBlock className="h-4 w-96 max-w-full" />
                <SkeletonBlock className="h-4 w-80 max-w-full" />
                <div className="flex gap-4 mt-4">
                    <SkeletonBlock className="h-12 w-36 rounded-xl" />
                    <SkeletonBlock className="h-12 w-36 rounded-xl" />
                </div>
            </div>

            {/* Bento card row skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[1400px] mx-auto w-full">
                {[...Array(4)].map((_, i) => (
                    <SkeletonBlock key={i} className="h-24 rounded-2xl" />
                ))}
            </div>

            {/* Pulsing dot overlay to suggest activity */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.span
                        key={i}
                        className="w-2 h-2 rounded-full bg-accent/60"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay }}
                    />
                ))}
            </motion.div>
        </div>
    )
}

export default Skeleton
