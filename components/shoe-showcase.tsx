"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface ShoeShowcaseProps {
  shoeName?: string
  price?: string
  size?: string
  weight?: string
  material?: string
  color?: string
  showBuySection?: boolean
}

export function ShoeShowcase({
  shoeName = "RUSH PRO 4.5",
  price = "$189.999,00",
  size = "Tallas: 35-50",
  weight = "270g",
  material = "Mesh + Sintético",
  color = "Blanco/Azul",
  showBuySection = true,
}: ShoeShowcaseProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  // Local shoe images
  const images = [
    "/rush1.jpeg",
    "/rush2.jpeg",
    "/rush3.jpeg",
  ]

  const features = [
    { title: "Tecnología de Amortiguación Avanzada", description: "Proporciona comodidad superior durante partidos largos y entrenamientos intensos" },
    { title: "Sistema de Soporte Lateral", description: "Estabilidad mejorada en movimientos laterales rápidos y cambios de dirección" },
    { title: "Suela de Tracción Optimizada", description: "Agarre excepcional en diferentes tipos de superficie de cancha" },
    { title: "Construcción Transpirable", description: "Mantiene los pies frescos y secos durante toda la actividad" },
  ]

  const specs = [
    { label: "Modelo", value: shoeName },
    { label: "Peso por Zapato", value: weight },
    { label: "Material", value: material },
    { label: "Disponible en", value: size },
    { label: "Color", value: color },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-tennis-navy via-tennis-navy to-black text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative bg-gradient-to-br from-tennis-green/10 to-transparent rounded-2xl overflow-hidden group max-w-sm">
              <img
                src={images[selectedImage]}
                alt={`${shoeName} View ${selectedImage + 1}`}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`p-3 rounded-full backdrop-blur-md transition-colors ${
                    isFavorited
                      ? "bg-tennis-green text-white"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <Heart size={24} fill={isFavorited ? "currentColor" : "none"} />
                </motion.button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 max-w-sm">
              {images.map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all ${
                    selectedImage === idx ? "ring-2 ring-tennis-green" : "opacity-60 hover:opacity-100"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right: Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Brand & Name */}
            <div className="space-y-4">
              <p className="text-tennis-green font-semibold text-sm uppercase tracking-widest">Zapatilla Wilson</p>
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight">{shoeName}</h1>
              <p className="text-tennis-white/60 text-lg max-w-md">
                Diseñada para jugadores que buscan máxima comodidad, estabilidad y rendimiento en la cancha.
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
              {specs.map((spec, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="space-y-2"
                >
                  <p className="text-tennis-white/50 text-xs uppercase tracking-widest">{spec.label}</p>
                  <p className="text-lg font-semibold">{spec.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">Características Destacadas</h2>
            <p className="text-tennis-white/60 text-lg max-w-2xl">
              Cada detalle está cuidadosamente diseñado para optimizar tu rendimiento en la cancha.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 lg:p-8 hover:border-tennis-green/50 transition-colors"
              >
                <h3 className="text-xl font-bold mb-3 text-tennis-green">{feature.title}</h3>
                <p className="text-tennis-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
