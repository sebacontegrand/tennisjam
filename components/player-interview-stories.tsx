"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Quote, Award } from "lucide-react"
import { YouTubeEmbed } from "./youtube-embed"

interface PlayerStory {
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

const playerStories: PlayerStory[] = [
  {
    id: 1,
    playerName: "Martina Santana",
    ranking: "Ranking WTA: #450",
    playStyle: "Jugadora Agresiva de Fondo",
    playerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2940&auto=format&fit=crop",
    videoId: "8ewQ0-N9buE",
    interviewTitle: "Primeras Impresiones: Ultra 100 V5",
    quote: "En el momento que tomé la Ultra 100 V5, sentí la diferencia. El punto dulce es masivo, y el potencial de efecto es increíble. Ha cambiado cómo abordo los rallies de fondo.",
    experience:
      "Desde el primer partido, noté una confianza mejorada en mis golpes de fondo. La raqueta responde excepcionalmente bien a patrones de swing agresivos, y la recuperación en golpes fuera del centro es extraordinaria.",
    improvements: [
      "30% de mejora en la potencia del primer saque",
      "Mayor efecto en drives de revés",
      "Mejor control en puntos de presión",
      "Reducción de fatiga en el brazo durante partidos largos",
    ],
    stats: [
      { label: "Partidos Jugados", value: "15" },
      { label: "Tasa de Victorias", value: "73%" },
      { label: "Aces Prom/Partido", value: "6.2" },
      { label: "Errores No Forzados ↓", value: "-18%" },
    ],
  },
  {
    id: 2,
    playerName: "Diego Flores",
    ranking: "Ranking ATP: #280",
    playStyle: "Especialista en Servicio y Volea",
    playerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2940&auto=format&fit=crop",
    videoId: "8ewQ0-N9buE",
    interviewTitle: "Rendimiento del Servicio y Sensación en Cancha",
    quote: "La estabilidad es incomparable. En la red, tengo confianza completa en mis voleas. La raqueta absorbe el impacto increíblemente bien, incluso en voleas extremas.",
    experience:
      "La tecnología FORTY-FIVE° hizo una diferencia inmediata en mi juego de volea. Puedo generar más ritmo sin sacrificar control, y el punto dulce en golpes fuera del centro es muy indulgente.",
    improvements: [
      "Tasa de puntos de volea aumentó a 72%",
      "Preparación del servicio más rápida por mejor ligereza",
      "Mejor agarre en servicios cortados",
      "Control mejorado en globos defensivos",
    ],
    stats: [
      { label: "Puntos de Volea Ganados", value: "84%" },
      { label: "Puntos de Quiebre Salvados", value: "67%" },
      { label: "Winners de Volea", value: "8.1/partido" },
      { label: "Juegos de Servicio Ganados", value: "91%" },
    ],
  },
  {
    id: 3,
    playerName: "Ana Castillo",
    ranking: "Jugadora Competitiva Amateur",
    playStyle: "Jugadora Polivalente",
    playerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop",
    videoId: "8ewQ0-N9buE",
    interviewTitle: "Transición al Juego Avanzado",
    quote: "Como jugadora amateur ambiciosa, esta raqueta cubre la brecha entre el juego recreativo y el profesional. Me está ayudando a desarrollar mejor técnica y confianza.",
    experience:
      "La curva de aprendizaje con la Ultra 100 V5 fue mínima. El punto dulce expandido realmente me ayudó a concentrarme en la técnica en lugar de luchar con la raqueta. Estoy golpeando más limpio.",
    improvements: [
      "Colocación más consistente en derechas",
      "Generación de topspin mejorada",
      "Mayor conciencia en juego de transición",
      "Más victorias en partidos de torneo",
    ],
    stats: [
      { label: "Victorias de Torneo", value: "5" },
      { label: "Largo Promedio Rally", value: "7.3 golpes" },
      { label: "Conversión de Quiebre", value: "41%" },
      { label: "Puntuación de Confianza", value: "9/10" },
    ],
  },
]

export function PlayerInterviewStories() {
  const [activeStory, setActiveStory] = useState(0)

  const current = playerStories[activeStory]

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
            Escucha a jugadores competitivos hablar sobre su experiencia y mejoras de rendimiento con la Ultra 100 V5.
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
                  <h4 className="text-sm uppercase tracking-widest text-tennis-green font-bold mb-2">Experiencia de Juego</h4>
                  <p className="text-tennis-white/70">{current.experience}</p>
                </div>

                {/* Improvements */}
                <div>
                  <h4 className="text-sm uppercase tracking-widest text-tennis-green font-bold mb-3">Mejoras de Rendimiento</h4>
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
            {playerStories.map((story, idx) => (
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
