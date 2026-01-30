"use client"
import { Play, Maximize2, Volume2, Settings } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

export function VideoPlayer() {
    const [isPlaying, setIsPlaying] = useState(false)

    // Placeholder poster image
    const poster = "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2940&auto=format&fit=crop"

    return (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black group">
            {/* Video / Placeholder */}
            <img src={poster} alt="Match Preview" className="w-full h-full object-cover opacity-80" />

            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">

                {/* Play Button (Big Center) */}
                {!isPlaying && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <button
                            onClick={() => setIsPlaying(true)}
                            className="w-20 h-20 bg-tennis-green/90 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl shadow-tennis-green/30 pointer-events-auto hover:bg-tennis-green transition-colors"
                        >
                            <Play fill="white" className="ml-2 w-8 h-8 text-white" />
                        </button>
                    </motion.div>
                )}

                {/* Bottom Bar */}
                <div className="flex items-center justify-between text-white pb-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <button className="hover:text-tennis-green"><Play size={20} fill="currentColor" /></button>
                        <span className="text-sm font-mono">00:00 / 01:32:00</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="hover:text-tennis-green"><Volume2 size={20} /></button>
                        <button className="hover:text-tennis-green"><Settings size={20} /></button>
                        <button className="hover:text-tennis-green"><Maximize2 size={20} /></button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-white/20 rounded-full overflow-hidden mt-4 group-hover:h-2 transition-all">
                    <div className="h-full w-1/3 bg-tennis-green rounded-full" />
                </div>
            </div>

            {/* AI Highlights Badge */}
            <div className="absolute top-6 right-6 bg-tennis-navy/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">IA Lista</span>
            </div>
        </div>
    )
}
