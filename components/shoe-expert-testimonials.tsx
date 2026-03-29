"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { YouTubeEmbed } from "./youtube-embed"

interface ShoeExpert {
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

const shoeExperts: ShoeExpert[] = [
  {
    id: 1,
    name: "Carlos Mendez",
    title: "Entrenador Profesional",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2940&auto=format&fit=crop",
    videoId: "J8TxqpHpZNo",
    videoTitle: "Análisis de Zapatillas Wilson Rush Pro 4.5",
    topic: "Comodidad y Amortiguación",
    description: "Análisis experto de las Rush Pro 4.5, cubriendo el sistema de amortiguación, estabilidad lateral y características de rendimiento.",
    targetPlayer: "Jugadores de nivel intermedio a avanzado que priorizan comodidad",
  },
  {
    id: 2,
    name: "Sofia Rodriguez",
    title: "Analista de Equipamiento",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop",
    videoId: "J8TxqpHpZNo",
    videoTitle: "Tecnología de Tracción y Durabilidad",
    topic: "Agarre y Superficie",
    description: "Perspectivas expertas sobre cómo la suela de tracción optimizada funciona en diferentes tipos de cancha.",
    targetPlayer: "Jugadores que juegan frecuentemente en diferentes superficies",
  },
  {
    id: 3,
    name: "Juan Torres",
    title: "Especialista en Biomecánica",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2940&auto=format&fit=crop",
    videoId: "J8TxqpHpZNo",
    videoTitle: "Soporte y Alineación del Pie",
    topic: "Biomecánica",
    description: "Análisis profundo del sistema de soporte lateral y cómo previene lesiones durante movimientos rápidos.",
    targetPlayer: "Jugadores preocupados por prevención de lesiones y salud del pie",
  },
]

export function ShoeExpertTestimonials() {
  const [activeExpert, setActiveExpert] = useState(0)

  const handleNext = () => {
    setActiveExpert((prev) => (prev + 1) % shoeExperts.length)
  }

  const handlePrev = () => {
    setActiveExpert((prev) => (prev - 1 + shoeExperts.length) % shoeExperts.length)
  }

  const current = shoeExperts[activeExpert]

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
            Especialistas en equipamiento discuten la tecnología, comodidad y características de rendimiento de las Rush Pro 4.5.
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
            {shoeExperts.map((expert, idx) => (
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
                    <p className="font-bold truncate">{expert.name}</p>
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
          {shoeExperts.map((_, idx) => (
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
