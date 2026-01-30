"use client"

import { MatchCard } from "@/components/match-card"
import { motion } from "framer-motion"
import { User, Activity, Settings } from "lucide-react"

// Mock Data
const HISTORY = [
    {
        id: "m1",
        date: "30 Ene 2026",
        duration: "1h 30m",
        result: "WON",
        opponent: "N. Djokovic",
        thumbnail: "https://images.unsplash.com/photo-1599474924187-334a405be2fa?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "m2",
        date: "28 Ene 2026",
        duration: "45m",
        result: "LOST",
        opponent: "R. Nadal",
        thumbnail: "https://images.unsplash.com/photo-1531315630201-bb15dbbe16fb?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "m3",
        date: "25 Ene 2026",
        duration: "2h 10m",
        result: "WON",
        opponent: "C. Alcaraz",
        thumbnail: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "m4",
        date: "20 Ene 2026",
        duration: "1h 00m",
        result: "WON",
        opponent: "J. Sinner",
        thumbnail: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=800&auto=format&fit=crop"
    }
]

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-tennis-navy p-6 md:p-10">

            {/* Header / Profile Summary */}
            <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-tennis-green to-tennis-clay flex items-center justify-center shadow-2xl">
                        <span className="text-2xl font-black text-white">SC</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Sebastian C.</h1>
                        <p className="text-tennis-white/60 text-sm flex items-center gap-2">
                            <Activity size={14} className="text-tennis-green" />
                            Jugador Pro &bull; Miembro desde 2025
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium text-white transition-colors flex items-center gap-2">
                        <Settings size={16} /> Configurar
                    </button>
                    <button className="px-4 py-2 bg-tennis-green text-white rounded-full text-sm font-bold shadow-lg hover:bg-tennis-green/80 transition-colors">
                        Editar Perfil
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <main className="max-w-6xl mx-auto space-y-8">

                {/* Section Title */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <User size={20} className="text-tennis-clay" />
                        Historial de Partidos
                    </h2>
                    <span className="text-xs text-tennis-white/40 uppercase font-mono">Mostrando {HISTORY.length} Registros</span>
                </div>

                {/* Match Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {HISTORY.map((match, i) => (
                        <motion.div
                            key={match.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <MatchCard {...match} />
                        </motion.div>
                    ))}
                </div>

            </main>
        </div>
    )
}
