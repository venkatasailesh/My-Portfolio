import { motion } from 'framer-motion'
import { useRef } from 'react'

import TiltCard from './TiltCard'
import { GraduationCap, BookOpen, School } from 'lucide-react'

const education = [
    { title: 'Computer Science and Engineering', place: 'Sri Venkateswara Engineering College', year: '2020 – 2024', cgpa: '8.4', accent: 'text-accent', bg: 'bg-accent/10', icon: GraduationCap },
    { title: 'Higher Secondary', place: 'SDHR Junior College', year: '2018 - 2020', cgpa: '8.4', accent: 'text-warm', bg: 'bg-warm/10', icon: BookOpen },
    { title: 'Secondary School', place: 'Red Cherries School', year: '2018', cgpa: '9.2', accent: 'text-sky', bg: 'bg-sky/10', icon: School },
]

const Education = () => {
    return (
        <section id="education" className="py-24 px-6 md:px-12">
            <div className="max-w-[1400px] mx-auto">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="text-warm font-display font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-none opacity-10 select-none"
                >
                    STUDY
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="font-display font-bold text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight -mt-3 md:-mt-8 mb-10"
                >
                    Academic <span className="text-warm">milestones</span>.
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {education.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                        >
                            <TiltCard className="bento p-6 md:p-8 flex flex-col justify-between h-full group block">
                                <div>
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                                            <item.icon className={item.accent} size={24} />
                                        </div>
                                        <span className={`text-[10px] tracking-wider uppercase ${item.accent} font-bold ${item.bg} px-3 py-1.5 rounded-lg`}>{item.year}</span>
                                    </div>
                                    <h3 className="font-display font-bold text-xl mb-2">{item.title}</h3>
                                    <p className="text-sm text-text-3">{item.place}</p>
                                </div>
                                <div className="mt-8 pt-5 border-t border-dark-3 flex items-center justify-between">
                                    <span className="text-xs text-text-3 uppercase tracking-wider">CGPA</span>
                                    <span className={`font-display font-extrabold text-3xl ${item.accent}`}>{item.cgpa}</span>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Education
