"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { YouTubeEmbed } from "./youtube-embed"

interface Expert {
  id: number
  name: string
  title: string
  image: string
  videoId: string
  videoTitle: string
  topic: string
  description: string
  targetPlayer: string
}

const experts: Expert[] = [
  {
    id: 1,
    name: "Carlos Mendez",
    title: "Entrenador Profesional",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2940&auto=format&fit=crop",
    videoId: "mTVFOT8tptc",
    videoTitle: "Análisis de la Raqueta Ultra 100 V5",
    topic: "Potencia y Control",
    description: "Análisis experto de la Ultra 100 V5, cubriendo el comportamiento de la raqueta, características de tecnología y características de juego.",
    targetPlayer: "Jugadores de nivel intermedio a avanzado que buscan un juego agresivo de fondo",
  },
  {
    id: 2,
    name: "Sofia Rodriguez",
    title: "Analista de Tenis",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop",
    videoId: "mTVFOT8tptc",
    videoTitle: "Patrón de Encordado y Rendimiento",
    topic: "Efecto y Estabilidad",
    description: "Perspectivas de expertos sobre cómo el patrón de encordado 16x19 genera un efecto impresionante manteniendo la estabilidad.",
    targetPlayer: "Jugadores que aman el topspin y las tácticas agresivas",
  },
  {
    id: 3,
    name: "Juan Torres",
    title: "Especialista en Equipos",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2940&auto=format&fit=crop",
    videoId: "mTVFOT8tptc",
    videoTitle: "Tecnología SI3D Explicada",
    topic: "Tecnología",
    description: "Inmersión profunda en la tecnología SI3D y cómo optimiza la flexión del marco 3D para un rendimiento consistente.",
    targetPlayer: "Jugadores interesados en entender la ingeniería de raquetas",
  },
]

export function ExpertTestimonials() {
  const [activeExpert, setActiveExpert] = useState(0)

  const handleNext = () => {
    setActiveExpert((prev) => (prev + 1) % experts.length)
  }

  const handlePrev = () => {
    setActiveExpert((prev) => (prev - 1 + experts.length) % experts.length)
  }

  const current = experts[activeExpert]

  return (
    <div className="w-full bg-black py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black mb-4 text-white">Perspectivas de Expertos</h2>
          <p className="text-tennis-white/60 text-lg max-w-2xl mx-auto">
            Entrenadores profesionales y especialistas discuten el comportamiento de la raqueta, tecnología y estilo de juego ideal.
          </p>
        </motion.div>

        {/* Main Expert Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-tennis-green/20 to-transparent shadow-2xl max-w-2xl">
              <YouTubeEmbed videoId={current.videoId} title={current.videoTitle} />
            </div>

            {/* Video Info */}
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 space-y-4"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">{current.videoTitle}</h3>
                <p className="text-tennis-green text-sm uppercase font-semibold tracking-widest">{current.topic}</p>
              </div>
              <p className="text-tennis-white/70 leading-relaxed">{current.description}</p>
              <div className="bg-gradient-to-r from-tennis-green/10 to-transparent border border-tennis-green/30 rounded-lg p-4">
                <p className="text-sm text-tennis-white/80">
                  <span className="font-bold text-tennis-green">Jugador Objetivo:</span> {current.targetPlayer}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Expert Cards Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {experts.map((expert, idx) => (
              <motion.button
                key={expert.id}
                onClick={() => setActiveExpert(idx)}
                whileHover={{ scale: 1.02 }}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                  activeExpert === idx
                    ? "bg-tennis-green text-black border-2 border-tennis-green"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
              >
                <div className="flex gap-3 items-start">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className={`font-bold truncate ${activeExpert === idx ? "" : ""}`}>
                      {expert.name}
                    </p>
                    <p
                      className={`text-xs truncate ${
                        activeExpert === idx ? "text-black/70" : "text-tennis-white/60"
                      }`}
                    >
                      {expert.title}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}

            {/* Navigation */}
            <div className="flex gap-2 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                className="flex-1 h-12 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="flex-1 h-12 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {experts.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setActiveExpert(idx)}
              className={`h-2 rounded-full transition-all ${
                activeExpert === idx ? "w-8 bg-tennis-green" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
