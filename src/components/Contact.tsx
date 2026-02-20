import { motion } from 'framer-motion'
import { useRef } from 'react'
import { Mail, MapPin, Github, Linkedin, Send, ArrowUpRight } from 'lucide-react'
import TiltCard from './TiltCard'

const Contact = () => {
    const inputClass = "w-full bg-dark-3/50 border border-dark-4 rounded-xl px-5 py-4 text-text-1 text-sm outline-none focus:border-accent/50 focus:bg-accent/[0.03] transition-all duration-200 placeholder:text-text-2"

    return (
        <section id="contact" className="py-24 px-6 md:px-12">
            <div className="max-w-[1400px] mx-auto">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="text-lavender font-display font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-none opacity-10 select-none"
                >
                    HELLO
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="font-display font-bold text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight -mt-3 md:-mt-8 mb-12"
                >
                    Let's work <span className="text-lavender">together</span>.
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Left — CTA + info */}
                    <TiltCard
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="bento p-6 md:p-10 flex flex-col justify-between block"
                    >
                        <div>
                            <h3 className="font-display font-bold text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.3] mb-4 md:mb-5">
                                Have a project? <br />Let's make it <span className="text-accent">happen</span>.
                            </h3>
                            <p className="text-text-2 text-sm leading-relaxed mb-8">
                                I'm always excited to work on new challenges and collaborate on innovative projects.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <a href="mailto:vvenkatasailesh@gmail.com"
                                className="flex items-center gap-3 text-sm text-text-1 hover:text-accent transition-colors group">
                                <span className="w-9 h-9 rounded-xl bg-warm/10 text-warm flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Mail size={16} />
                                </span>
                                vvenkatasailesh@gmail.com
                            </a>
                            <div className="flex items-center gap-3 text-sm text-text-1">
                                <span className="w-9 h-9 rounded-xl bg-sky/10 text-sky flex items-center justify-center">
                                    <MapPin size={16} />
                                </span>
                                Hyderabad, India
                            </div>
                            <div className="flex gap-3 pt-2">
                                <a href="https://github.com/venkatasailesh" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-3 border border-dark-4 text-xs text-text-1 hover:text-accent hover:border-accent/30 transition-all">
                                    <Github size={14} />
                                    GitHub
                                    <ArrowUpRight size={12} />
                                </a>
                                <a href="https://www.linkedin.com/in/venkata-sailesh-27b0b11bb" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-3 border border-dark-4 text-xs text-text-1 hover:text-accent hover:border-accent/30 transition-all">
                                    <Linkedin size={14} />
                                    LinkedIn
                                    <ArrowUpRight size={12} />
                                </a>
                            </div>
                        </div>
                    </TiltCard>

                    {/* Right — Form */}
                    <TiltCard
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                        className="bento p-6 md:p-10 block"
                    >
                        <form
                            action="https://formsubmit.co/vvenkatasailesh@gmail.com"
                            method="POST"
                            className="space-y-4"
                        >
                            {/* Honeypot & Config for FormSubmit */}
                            <input type="text" name="_honey" style={{ display: 'none' }} />
                            <input type="hidden" name="_captcha" value="false" />
                            <input type="hidden" name="_template" value="box" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input type="text" name="name" placeholder="Name" required className={inputClass} />
                                <input type="email" name="email" placeholder="Email" required className={inputClass} />
                            </div>
                            <input type="text" name="subject" placeholder="Subject" required className={inputClass} />
                            <textarea name="message" rows={4} placeholder="Your message..." required
                                className={`${inputClass} resize-none`} />
                            <button type="submit"
                                className="w-full py-4 bg-accent text-dark font-display font-bold text-sm rounded-xl border-none cursor-pointer hover:bg-cream transition-colors duration-200 flex items-center justify-center gap-2">
                                <Send size={16} />
                                Send Message
                            </button>
                        </form>
                    </TiltCard>
                </div>
            </div>
        </section>
    )
}

export default Contact
