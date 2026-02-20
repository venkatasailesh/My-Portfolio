import { motion } from 'framer-motion'
import { useRef } from 'react'
import { Briefcase, Calendar, MapPin, ArrowUpRight } from 'lucide-react'
import TiltCard from './TiltCard'

const SPGlobalLogo = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 60 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#c6f135" fontFamily="'Sora', sans-serif" fontWeight="800" fontSize="16">S&amp;P</text>
        <text x="50%" y="85%" dominantBaseline="middle" textAnchor="middle" fill="#a0a0a0" fontFamily="'Inter', sans-serif" fontWeight="600" fontSize="7">GLOBAL</text>
    </svg>
)

const experiences = [
    {
        role: 'Software Engineer',
        company: 'S&P Global',
        period: 'Nov 2025 – Present',
        duration: '4 months',
        location: 'Hyderabad, India',
        type: 'Full-time',
        description: [
            'Developing and maintaining enterprise-grade software solutions',
            'Working with C#, .Net, and React tech stack',
            'Designing microservice architecture for scalable applications',
        ],
        current: true,
        accent: 'accent',
    },
    {
        role: 'Apprentice Software Engineer',
        company: 'S&P Global',
        period: 'Oct 2024 – Oct 2025',
        duration: '1 year 1 month',
        location: 'Hyderabad, India',
        type: 'Full-time',
        description: [
            'Built React applications for internal business operations',
            'Collaborated on production-ready applications serving business teams',
            'Implemented DevOps practices to streamline development lifecycle',
        ],
        current: false,
        accent: 'sky',
    },
]

const Experience = () => {
    return (
        <section id="experience" className="py-24 px-6 md:px-12">
            <div className="max-w-[1400px] mx-auto">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="text-accent font-display font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-none opacity-10 select-none"
                >
                    WORK
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="font-display font-bold text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight -mt-3 md:-mt-8 mb-12"
                >
                    Professional <span className="text-accent">experience</span>.
                </motion.h2>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[23px] md:left-[31px] top-0 bottom-0 w-px bg-dark-3" />

                    <div className="space-y-6">
                        {experiences.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.7, delay: 0.3 + i * 0.2 }}
                                className="relative pl-14 md:pl-20"
                            >
                                {/* Timeline dot */}
                                <div className={`absolute left-[16px] md:left-[24px] top-8 w-[15px] h-[15px] rounded-full border-[3px] z-10 ${exp.current
                                    ? 'border-accent bg-accent/30 shadow-[0_0_12px_rgba(198,241,53,0.4)]'
                                    : 'border-sky bg-sky/20'
                                    }`}>
                                    {exp.current && (
                                        <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />
                                    )}
                                </div>

                                {/* Card */}
                                <TiltCard className="bento p-6 md:p-8 group hover:border-dark-4 transition-all duration-300 block">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 md:gap-5">
                                        {/* Company logo */}
                                        <motion.div
                                            whileHover={{ scale: 1.08, rotate: 2 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                            className="w-14 h-14 rounded-2xl bg-white/[0.08] border border-dark-3 flex items-center justify-center shrink-0 group-hover:border-accent/20 transition-colors"
                                        >
                                            <SPGlobalLogo className="w-full h-full" />
                                        </motion.div>

                                        <div className="flex-1 min-w-0">
                                            {/* Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                                <div>
                                                    <h3 className="font-display font-bold text-lg flex items-center gap-2">
                                                        {exp.role}
                                                        {exp.current && (
                                                            <span className="text-[9px] font-bold uppercase tracking-wider bg-accent/15 text-accent px-2 py-1 rounded-md">
                                                                Current
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p className={`text-sm font-medium ${exp.current ? 'text-accent' : 'text-sky'} flex items-center gap-1`}>
                                                        {exp.company}
                                                        <ArrowUpRight size={13} />
                                                    </p>
                                                </div>
                                                <span className={`text-[10px] font-bold tracking-wider uppercase ${exp.current ? 'text-accent bg-accent/10' : 'text-sky bg-sky/10'
                                                    } px-3 py-1.5 rounded-lg whitespace-nowrap self-start`}>
                                                    {exp.type}
                                                </span>
                                            </div>

                                            {/* Meta */}
                                            <div className="flex flex-wrap items-center gap-4 text-text-3 text-xs mb-5">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={12} /> {exp.period}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Briefcase size={12} /> {exp.duration}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin size={12} /> {exp.location}
                                                </span>
                                            </div>

                                            {/* Description bullets */}
                                            <ul className="space-y-2.5">
                                                {exp.description.map((desc, j) => (
                                                    <motion.li
                                                        key={j}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true, amount: 0.2 }}
                                                        transition={{ duration: 0.4, delay: 0.5 + i * 0.2 + j * 0.1 }}
                                                        className="flex items-start gap-3 text-text-2 text-sm leading-relaxed"
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${exp.current ? 'bg-accent' : 'bg-sky'}`} />
                                                        {desc}
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </div>

                    {/* Timeline end marker */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="relative pl-14 md:pl-20 mt-6"
                    >
                        <div className="absolute left-[19px] md:left-[27px] top-2 w-2 h-2 rounded-full bg-dark-3" />
                        <p className="text-text-3 text-xs uppercase tracking-widest">More to come...</p>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Experience
