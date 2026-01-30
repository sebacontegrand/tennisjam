"use client"

import { motion } from "framer-motion"
import { Play, Calendar, Clock, Trophy } from "lucide-react"
import Link from "next/link"

interface MatchCardProps {
    id: string
    date: string
    duration: string
    result?: string
    thumbnail: string
    opponent?: string
}

export function MatchCard({ id, date, duration, result, thumbnail, opponent }: MatchCardProps) {
    return (
        <Link href={`/match/${id}`}>
            <motion.div
                whileHover={{ y: -5 }}
                className="group relative bg-card border border-white/10 rounded-xl overflow-hidden shadow-lg cursor-pointer"
            >
                {/* Thumbnail */}
                <div className="aspect-video bg-black relative">
                    <img
                        src={thumbnail}
                        alt={`Match ${date}`}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                    />

                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-tennis-green rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            <Play size={20} className="text-white ml-1" />
                        </div>
                    </div>

                    {/* Badge: Result */}
                    {result && (
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide
                            ${result === 'WON' ? 'bg-tennis-green text-white' : 'bg-tennis-clay text-white'}
                        `}>
                            {result === 'WON' ? 'Victoria' : 'Derrota'}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-tennis-white/60 text-xs font-mono uppercase">
                                <Calendar size={12} /> {date}
                            </div>
                            <h3 className="font-bold text-tennis-white text-lg">vs. {opponent || "Oponente"}</h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 border-t border-white/5 pt-3">
                        <div className="flex items-center gap-1.5 text-xs text-tennis-white/60">
                            <Clock size={12} className="text-tennis-clay" />
                            {duration}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-tennis-white/60">
                            <Trophy size={12} className="text-tennis-green" />
                            Match Play
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}
