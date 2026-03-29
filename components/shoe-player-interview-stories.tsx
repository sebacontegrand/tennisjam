"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Quote, Award } from "lucide-react"
import { YouTubeEmbed } from "./youtube-embed"

interface ShoePlayerStory {
  id: number
  playerName: string
  ranking: string
  playStyle: string
  playerImage: string
  videoId: string
  interviewTitle: string
  quote: string
  experience: string
  improvements: string[]
  stats: { label: string; value: string }[]
}

const shoePlayerStories: ShoePlayerStory[] = [
  {
    id: 1,
    playerName: "Martina Santana",
    ranking: "Ranking WTA: #450",
    playStyle: "Jugadora Agresiva de Fondo",
    playerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2940&auto=format&fit=crop",
    videoId: "cEnuBEvQ9fk",
    interviewTitle: "Comodidad Durante Partidos Largos",
    quote: "Las Rush Pro 4.5 han transformado cómo me siento en la cancha. Puedo jugar todo el día sin dolor en los pies. La amortiguación es perfecta.",
    experience:
      "Desde el primer uso, sentí una diferencia en la comodidad. El soporte lateral es excelente, especialmente en movimientos rápidos de lado a lado. Mi rendimiento ha mejorado notablemente.",
    improvements: [
      "Cero dolor de pies después de partidos",
      "Mayor agilidad en cambios de dirección",
      "Mejor estabilidad en el saque",
      "Mayor confianza en rallies extendidos",
    ],
    stats: [
      { label: "Partidos Jugados", value: "22" },
      { label: "Horas de Juego", value: "68 hrs" },
      { label: "Confort Score", value: "9.5/10" },
      { label: "Durabilidad", value: "Excelente" },
    ],
  },
  {
    id: 2,
    playerName: "Diego Flores",
    ranking: "Ranking ATP: #280",
    playStyle: "Especialista en Servicio y Volea",
    playerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2940&auto=format&fit=crop",
    videoId: "cEnuBEvQ9fk",
    interviewTitle: "Rendimiento en Diferentes Superficies",
    quote: "He probado muchas zapatillas, pero las Rush Pro 4.5 son las mejores para cambiar rápidamente en la cancha. La tracción es insuperable.",
    experience:
      "Ya sea en arcilla, cemento o pista rápida, estas zapatillas mantienen su agarre. El sistema de soporte lateral me da confianza en cada movimiento, incluso en cambios abruptos.",
    improvements: [
      "Mejor tracción en todas las superficies",
      "Transiciones más rápidas",
      "Menor riesgo de resbalones",
      "Mejor equilibrio en la red",
    ],
    stats: [
      { label: "Superficies Probadas", value: "3" },
      { label: "Agarre Score", value: "9.8/10" },
      { label: "Puntos de Volea Ganados", value: "86%" },
      { label: "Confianza Lateral", value: "10/10" },
    ],
  },
  {
    id: 3,
    playerName: "Ana Castillo",
    ranking: "Jugadora Competitiva Amateur",
    playStyle: "Jugadora Polivalente",
    playerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop",
    videoId: "cEnuBEvQ9fk",
    interviewTitle: "Prevención de Lesiones y Salud",
    quote: "Tenía problemas con mis pies, pero estas zapatillas han reducido mi dolor significativamente. Me siento más protegida mientras juego.",
    experience:
      "Como jugadora que juega con frecuencia, necesitaba zapatillas que protejan mi pie pero también proporcionen comodidad. Las Rush Pro 4.5 hacen exactamente eso.",
    improvements: [
      "Reducción del 70% en dolor de pie",
      "Mejor alineación del pie",
      "Más partidos sin molestias",
      "Mayor durabilidad en entrenamientos",
    ],
    stats: [
      { label: "Sesiones de Entrenamiento", value: "4/semana" },
      { label: "Sin Molestias", value: "100%" },
      { label: "Durabilidad (meses)", value: "8+" },
      { label: "Recomendación", value: "10/10" },
    ],
  },
]

export function ShoePlayerInterviewStories() {
  const [activeStory, setActiveStory] = useState(0)

  const current = shoePlayerStories[activeStory]

  return (
    <div className="w-full bg-gradient-to-b from-black via-tennis-navy/20 to-black py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black mb-4 text-white">Historias de Jugadores</h2>
          <p className="text-tennis-white/60 text-lg max-w-2xl mx-auto">
            Escucha a jugadores competitivos hablar sobre su experiencia y mejoras con las Rush Pro 4.5.
          </p>
        </motion.div>

        {/* Main Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Player Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Player Card */}
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl overflow-hidden"
            >
              <img
                src={current.playerImage}
                alt={current.playerName}
                className="w-full aspect-square object-cover"
              />
            </motion.div>

            {/* Player Info */}
            <motion.div
              key={`info-${current.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{current.playerName}</h3>
                <p className="text-tennis-green font-semibold text-sm">{current.ranking}</p>
                <p className="text-tennis-white/60 text-sm mt-2">{current.playStyle}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                {current.stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="bg-white/5 rounded-lg p-3 text-center"
                  >
                    <p className="text-xs text-tennis-white/60 mb-1">{stat.label}</p>
                    <p className="text-lg font-bold text-tennis-green">{stat.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Video & Story */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Video Player */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-tennis-green/20 to-transparent shadow-2xl max-w-2xl">
              <YouTubeEmbed videoId={current.videoId} title={current.interviewTitle} />
            </div>

            {/* Interview Title */}
            <motion.div
              key={`title-${current.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold text-white">{current.interviewTitle}</h3>

              {/* Quote Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-tennis-green/10 via-transparent to-transparent border-l-4 border-tennis-green rounded-lg p-6"
              >
                <div className="flex gap-3">
                  <Quote className="text-tennis-green flex-shrink-0 mt-1" size={20} />
                  <p className="text-lg text-tennis-white/90 italic">{current.quote}</p>
                </div>
              </motion.div>

              {/* Experience Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-sm uppercase tracking-widest text-tennis-green font-bold mb-2">Experiencia de Uso</h4>
                  <p className="text-tennis-white/70">{current.experience}</p>
                </div>

                {/* Improvements */}
                <div>
                  <h4 className="text-sm uppercase tracking-widest text-tennis-green font-bold mb-3">Beneficios Principales</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {current.improvements.map((improvement, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="flex items-center gap-2 text-tennis-white/80"
                      >
                        <Award size={16} className="text-tennis-green flex-shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Story Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <p className="text-sm uppercase tracking-widest text-tennis-white/60 font-bold mb-4">Otras Historias de Jugadores</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shoePlayerStories.map((story, idx) => (
              <motion.button
                key={story.id}
                onClick={() => setActiveStory(idx)}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl text-left transition-all duration-300 ${
                  activeStory === idx
                    ? "bg-tennis-green text-black border-2 border-tennis-green"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
              >
                <div className="flex gap-3 items-start">
                  <img
                    src={story.playerImage}
                    alt={story.playerName}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-sm">{story.playerName}</p>
                    <p
                      className={`text-xs truncate ${
                        activeStory === idx ? "text-black/70" : "text-tennis-white/60"
                      }`}
                    >
                      {story.playStyle}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
