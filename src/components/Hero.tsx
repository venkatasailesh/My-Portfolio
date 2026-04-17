import AntigravityText from './AntigravityText'
import AnimatedCounter from './AnimatedCounter'
import TiltCard from './TiltCard'
import CanvasParticles from './CanvasParticles'
import NoiseSphere from './NoiseSphere'
import { MapPin, ArrowDown } from 'lucide-react'

const Hero = () => (
    <section id="hero" className="min-h-screen relative overflow-hidden bg-dark">
        {/* Starfield background */}
        <CanvasParticles />

        {/* Abstract noise sphere floating on the right */}
        <div
            className="absolute top-1/2 right-0 -translate-y-1/2 w-[55%] h-[80%] z-[1] pointer-events-none hidden md:block"
            style={{
                maskImage: 'radial-gradient(ellipse at 60% 50%, black 20%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(ellipse at 60% 50%, black 20%, transparent 70%)',
            }}
        >
            <NoiseSphere />
        </div>

        {/* Layer 3: Content */}
        <div className="max-w-[1400px] w-full mx-auto relative z-10 px-6 md:px-12 pt-32 pb-16 pointer-events-none">

            <div className="pointer-events-auto w-max">
                <h1 className="font-display font-medium text-[clamp(2.5rem,10vw,8rem)] leading-[0.92] tracking-tight text-white/90">
                    <AntigravityText text="Venkata" delay={0.2} />
                </h1>
            </div>
            <div className="pointer-events-auto w-max">
                <h1 className="font-display font-medium text-[clamp(2.5rem,10vw,8rem)] leading-[0.92] tracking-tight text-accent mt-2 md:mt-0">
                    <AntigravityText text="Sailesh" delay={0.4} />
                </h1>
            </div>

            {/* Bottom bento row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-12 md:mt-16 pointer-events-auto">

                {/* Left Card - Bio */}
                <TiltCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1 }}
                    className="bento p-6 md:p-8 md:col-span-4 flex flex-col justify-between"
                >
                    <p className="text-text-2 text-[15px] sm:text-lg md:text-xl leading-[1.8] font-light">
                        Software Engineer building <span className="text-white font-medium">scalable web apps</span> with React, Java & Spring Boot.
                    </p>
                    <p className="flex items-center gap-2 text-text-3 text-sm mt-6 md:mt-8">
                        <MapPin size={16} className="text-white" /> Hyderabad, India
                    </p>
                </TiltCard>

                {/* Middle Card - Big Stats */}
                <TiltCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1.15 }}
                    className="bento p-6 md:p-8 md:col-span-5 flex flex-col justify-center items-center relative overflow-hidden group min-h-[160px]"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex gap-8 md:gap-12 w-full justify-center relative z-10">
                        {[
                            { n: 2, s: '', l: 'Years Experience' },
                            { n: 10, s: '+', l: 'Projects' },
                        ].map((s) => (
                            <div key={s.l} className="flex flex-col items-center text-center">
                                <p className="font-display font-black text-5xl sm:text-6xl md:text-7xl text-white tracking-tighter">
                                    <AnimatedCounter end={s.n} suffix={s.s} duration={2000} />
                                </p>
                                <p className="text-[10px] sm:text-xs md:text-sm text-text-3 uppercase tracking-widest mt-2">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </TiltCard>

                {/* Right Card - Action */}
                <TiltCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1.3 }}
                    className="bento p-8 md:col-span-3 flex flex-col justify-center gap-4 hidden md:flex"
                >
                    <a href="#about" className="flex items-center justify-center gap-2 text-sm font-bold py-4 border border-dark-4 text-text-2 rounded-xl hover:border-white/40 hover:text-white hover:bg-white/5 transition-all">
                        <ArrowDown size={16} /> Discover More
                    </a>
                </TiltCard>
            </div>
        </div>
    </section>
)

export default Hero
