import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Menu, X, Send } from 'lucide-react'
import { useState, useEffect } from 'react'

const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
]

const Navbar = () => {
    const [active, setActive] = useState('')
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)

            // Simple scroll spy
            const sections = navItems.map(item => document.querySelector(item.href))
            const scrollPosition = window.scrollY + 200

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i] as HTMLElement
                if (section && section.offsetTop <= scrollPosition) {
                    setActive(navItems[i].label)
                    break
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    const handleMobileLink = (label: string) => {
        setActive(label)
        setMobileOpen(false)
    }

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 right-0 z-[500] flex justify-center w-full px-4 transition-all duration-300 ${isScrolled ? 'pt-3 pb-2' : 'pt-6 pb-4'
                    }`}
            >
                {/* ─── Desktop Pill ─── */}
                <div className="hidden md:flex items-center gap-8 bg-dark/70 backdrop-blur-2xl px-5 py-3 rounded-[32px] border border-white/5 shadow-2xl">
                    {/* Logo */}
                    <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex items-center px-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors group cursor-pointer mr-4 py-2">
                        <Terminal size={18} className="text-white group-hover:rotate-12 transition-transform duration-300 mr-2" />
                        <span className="font-display font-medium text-[15px] tracking-tight text-white mb-[1px]">
                            Sailesh<span className="text-text-3">.dev</span>
                        </span>
                    </a>

                    {/* Desktop Nav Links */}
                    <div className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = active === item.label
                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setActive(item.label)}
                                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 z-10 ${isActive ? 'text-dark' : 'text-text-2 hover:text-white'
                                        }`}
                                >
                                    {item.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navBlob"
                                            className="absolute inset-0 bg-white rounded-full -z-10"
                                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                </a>
                            )
                        })}
                    </div>

                    {/* Desktop CTA */}
                    <a
                        href="#contact"
                        className="ml-4 flex items-center justify-center px-5 py-2.5 bg-accent text-dark font-semibold text-sm rounded-full hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                        Say Hello
                    </a>
                </div>

                {/* ─── Mobile Top Bar ─── */}
                <div className="flex md:hidden items-center justify-between w-full max-w-lg bg-dark/80 backdrop-blur-2xl px-4 py-3 rounded-2xl border border-white/5 shadow-2xl">
                    {/* Logo */}
                    <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false) }} className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <Terminal size={16} className="text-white" />
                        </div>
                        <span className="font-display font-medium text-sm text-white">
                            Sailesh<span className="text-text-3">.dev</span>
                        </span>
                    </a>

                    {/* Hamburger / Close Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border-none cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        <AnimatePresence mode="wait">
                            {mobileOpen ? (
                                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <X size={20} className="text-white" />
                                </motion.div>
                            ) : (
                                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <Menu size={20} className="text-white" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.nav>

            {/* ─── Mobile Full-Screen Overlay Menu ─── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[490] bg-dark/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center"
                    >
                        <nav className="flex flex-col items-center gap-2 w-full max-w-xs">
                            {navItems.map((item, i) => {
                                const isActive = active === item.label
                                return (
                                    <motion.a
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => handleMobileLink(item.label)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3, delay: i * 0.06 }}
                                        className={`w-full text-center py-4 px-6 rounded-2xl text-lg font-display font-semibold tracking-tight transition-all duration-200 ${isActive
                                            ? 'bg-accent text-dark'
                                            : 'text-text-2 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {item.label}
                                    </motion.a>
                                )
                            })}

                            {/* Mobile CTA */}
                            <motion.a
                                href="#contact"
                                onClick={() => setMobileOpen(false)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, delay: navItems.length * 0.06 }}
                                className="w-full text-center mt-4 py-4 px-6 bg-accent text-dark font-display font-bold text-lg rounded-2xl hover:bg-white active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <Send size={18} />
                                Let's Talk
                            </motion.a>
                        </nav>

                        {/* Decorative bottom text */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="absolute bottom-10 text-text-3 text-xs tracking-widest uppercase"
                        >
                            Sailesh.dev
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navbar
