"use client"
import { motion } from "framer-motion"

interface AdBannerProps {
    sponsor: string
    tagline: string
    cta: string
    color?: string
}

export function AdBanner({ sponsor, tagline, cta, color = "bg-tennis-clay" }: AdBannerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`relative w-full overflow-hidden rounded-xl ${color} p-6 pb-12 shadow-lg`}
        >
            <div className="absolute top-0 right-0 p-3">
                <span className="text-[10px] font-bold text-white/40 border border-white/20 px-2 py-1 rounded">SPONSORED</span>
            </div>

            <div className="relative z-10 flex flex-col items-start gap-4">
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{sponsor}</h3>
                <p className="text-white/90 font-medium max-w-[80%]">{tagline}</p>
                <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors shadow-lg">
                    {cta}
                </button>
            </div>

            {/* Abstract shapes */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute top-10 right-20 w-24 h-24 bg-black/10 rounded-full blur-2xl" />
        </motion.div>
    )
}
