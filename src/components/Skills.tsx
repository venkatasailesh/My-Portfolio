import { motion } from 'framer-motion'
import { useRef } from 'react'
import TiltCard from './TiltCard'

const skills = [
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original-wordmark.svg', bg: 'bg-[#f8981d]/10', ring: 'hover:ring-[#f8981d]/30' },
    { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg', bg: 'bg-[#6295cb]/10', ring: 'hover:ring-[#6295cb]/30' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original-wordmark.svg', bg: 'bg-[#ffd845]/10', ring: 'hover:ring-[#ffd845]/30' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', bg: 'bg-[#f7df1e]/10', ring: 'hover:ring-[#f7df1e]/30' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg', bg: 'bg-[#61dafb]/10', ring: 'hover:ring-[#61dafb]/30' },
    { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original-wordmark.svg', bg: 'bg-[#6db33f]/10', ring: 'hover:ring-[#6db33f]/30' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original-wordmark.svg', bg: 'bg-[#2496ed]/10', ring: 'hover:ring-[#2496ed]/30' },
    { name: 'Jenkins', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg', bg: 'bg-[#d33833]/10', ring: 'hover:ring-[#d33833]/30' },
    { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg', bg: 'bg-[#4479a1]/10', ring: 'hover:ring-[#4479a1]/30' },
    { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-plain-wordmark.svg', bg: 'bg-[#e34f26]/10', ring: 'hover:ring-[#e34f26]/30' },
    { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original-wordmark.svg', bg: 'bg-[#1572b6]/10', ring: 'hover:ring-[#1572b6]/30' },
]

const Skills = () => {
    return (
        <section id="skills" className="py-24 px-6 md:px-12">
            <div className="max-w-[1400px] mx-auto">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="text-sky font-display font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-none opacity-10 select-none"
                >
                    SKILLS
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="font-display font-bold text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight -mt-3 md:-mt-8 mb-10"
                >
                    Technologies I work with <span className="text-accent">every day</span>.
                </motion.h2>

                <div className="relative mt-16 flex flex-col gap-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                    {/* Top Row — Moving Left */}
                    <div className="flex w-max animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] gap-6 px-3">
                        {[...skills, ...skills].map((skill, i) => (
                            <TiltCard key={`${skill.name}-${i}-top`} className={`bento w-[200px] shrink-0 flex flex-col items-center justify-center gap-4 p-6 cursor-default group ring-2 ring-transparent ${skill.ring} transition-all duration-300 relative block`}>
                                <div className={`w-16 h-16 rounded-2xl ${skill.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <img src={skill.icon} alt={skill.name} className="w-9 h-9" />
                                </div>
                                <span className="text-sm font-semibold text-text-2 group-hover:text-text-1 transition-colors">{skill.name}</span>
                            </TiltCard>
                        ))}
                    </div>

                    {/* Bottom Row — Moving Right */}
                    <div className="flex w-max animate-[marquee_45s_linear_infinite_reverse] hover:[animation-play-state:paused] gap-6 px-3 ml-[-50%]">
                        {[...skills.reverse(), ...skills].map((skill, i) => (
                            <TiltCard key={`${skill.name}-${i}-bottom`} className={`bento w-[200px] shrink-0 flex flex-col items-center justify-center gap-4 p-6 cursor-default group ring-2 ring-transparent ${skill.ring} transition-all duration-300 relative block`}>
                                <div className={`w-16 h-16 rounded-2xl ${skill.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <img src={skill.icon} alt={skill.name} className="w-9 h-9" />
                                </div>
                                <span className="text-sm font-semibold text-text-2 group-hover:text-text-1 transition-colors">{skill.name}</span>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Skills
