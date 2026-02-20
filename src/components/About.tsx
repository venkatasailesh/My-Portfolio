import { motion } from 'framer-motion'
import { useRef } from 'react'
import { Zap, Wrench, Package } from 'lucide-react'
import TiltCard from './TiltCard'

const About = () => {
    return (
        <section id="about" className="py-24 px-6 md:px-12">
            <div className="max-w-[1400px] mx-auto">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="text-accent font-display font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-none opacity-10 select-none"
                >
                    ABOUT
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="font-display font-bold text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight -mt-3 md:-mt-8 mb-12"
                >
                    A little bit <span className="text-accent">about me</span>.
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Big statement card */}
                    <TiltCard
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="bento p-6 md:p-10 md:col-span-2 block"
                    >
                        <h3 className="font-display font-bold text-[clamp(1.5rem,3.5vw,2.5rem)] leading-[1.3] tracking-tight">
                            I'm a Computer Science graduate who loves building things that live on the internet.
                            Currently crafting <span className="text-warm">beautiful interfaces</span> and{' '}
                            <span className="text-sky">robust backend systems</span>.
                        </h3>
                    </TiltCard>

                    {/* What I do */}
                    <TiltCard
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                        className="bento p-6 md:p-8 block"
                    >
                        <span className="text-[10px] tracking-[0.3em] uppercase text-accent font-bold mb-5 block">What I Do</span>
                        <div className="space-y-4">
                            {[
                                { icon: Zap, text: 'Full-stack web development', color: 'text-accent bg-accent/10' },
                                { icon: Wrench, text: 'API design & microservices', color: 'text-sky bg-sky/10' },
                                { icon: Package, text: 'DevOps & containerization', color: 'text-lavender bg-lavender/10' },
                            ].map((item) => (
                                <div key={item.text} className="flex items-center gap-3 text-text-2 text-sm">
                                    <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                                        <item.icon size={16} />
                                    </div>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </TiltCard>

                    {/* Background */}
                    <TiltCard
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="bento p-6 md:p-8 block"
                    >
                        <span className="text-[10px] tracking-[0.3em] uppercase text-lavender font-bold mb-5 block">Background</span>
                        <p className="text-text-2 text-[15px] leading-[2]">
                            Graduated from <span className="text-text-1 font-medium">Sri Venkateswara Engineering College</span> with
                            a B.Tech in Computer Science. Currently working as an Apprentice Software Engineer,
                            building production-ready apps with modern tech stacks.
                        </p>
                    </TiltCard>
                </div>
            </div>
        </section>
    )
}

export default About
