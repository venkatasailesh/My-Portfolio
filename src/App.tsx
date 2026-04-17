import { motion, AnimatePresence } from 'framer-motion'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Skeleton from './components/Skeleton'
import { Terminal } from 'lucide-react'
import { useState, useEffect } from 'react'

function App() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Show skeleton shimmer for a smooth initial load experience
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1200)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="bg-dark cursor-none min-h-screen">
            <Cursor />

            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="skeleton"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-[99]"
                    >
                        <Skeleton />
                    </motion.div>
                )}
            </AnimatePresence>

            {!isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }} // Wait for loader panels to slide away
                >
                    <Navbar />
                    <Hero />
                    <About />
                    <Experience />
                    <Skills />
                    <Education />
                    <Contact />

                    {/* Footer */}
                    <footer className="px-6 md:px-12 pb-8">
                        <div className="max-w-[1400px] mx-auto bento p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <Terminal size={18} className="text-accent" />
                                <span className="font-display font-medium text-lg tracking-tight">Sailesh<span className="text-text-2">.dev</span></span>
                                <span className="text-text-2 text-sm">·</span>
                            </div>
                            <div className="flex gap-6">
                                {[
                                    { label: 'GitHub', href: 'https://github.com/venkatasailesh' },
                                    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/venkatasailesh28' },
                                    { label: 'Email', href: 'mailto:vvenkatasailesh@gmail.com' },
                                ].map((l) => (
                                    <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                                        className="text-sm font-medium text-text-1 hover:text-accent transition-colors">{l.label}</a>
                                ))}
                            </div>
                            <span className="text-text-2 text-xs">© {new Date().getFullYear()}</span>
                        </div>
                    </footer>
                </motion.div>
            )}
        </div>
    )
}

export default App
