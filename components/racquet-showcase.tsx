"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Share2, Heart } from "lucide-react"

interface RacquetShowcaseProps {
  racquetName?: string
  price?: string
  grip?: string
  headSize?: string
  weight?: string
  pattern?: string
  color?: string
  showBuySection?: boolean
}

export function RacquetShowcase({
  racquetName = "ULTRA 100 V5",
  price = "$474.999,00",
  grip = "4 1/4",
  headSize = "100",
  weight = "300g",
  pattern = "16 x 19",
  color = "Electric Blue",
  showBuySection = true,
}: RacquetShowcaseProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  // Local racquet images
  const images = [
    "/ultra1.jpeg",
    "/ultra2.jpeg",
    "/ultra3.jpeg",
  ]

  const features = [
    { title: "Tecnología SI3D", description: "Optimiza la flexión del marco 3D para potencia, efecto y control" },
    { title: "FORTY-FIVE°", description: "Construcción de marco patentada para mejor sensación de contacto y estabilidad" },
    { title: "Perforación Paralela", description: "Respuesta consistente y tolerante del encordado con punto dulce expandido" },
    { title: "Viga Cónica Doble", description: "Maximiza la potencia manteniendo la tolerancia" },
  ]

  const specs = [
    { label: "Tamaño de Cabeza", value: headSize },
    { label: "Peso", value: weight },
    { label: "Patrón de Encordado", value: pattern },
    { label: "Tamaño de Grip", value: grip },
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
                alt={`${racquetName} View ${selectedImage + 1}`}
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
              <p className="text-tennis-green font-semibold text-sm uppercase tracking-widest">Raqueta Wilson</p>
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight">{racquetName}</h1>
              <p className="text-tennis-white/60 text-lg max-w-md">
                La siguiente fase de la serie Ultra combina diseño audaz con rendimiento revolucionario.
              </p>
            </div>

            {/* Price & Actions */}
            {showBuySection && (
              <div className="space-y-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-tennis-green">{price}</span>
                  <span className="text-sm text-tennis-white/50">Envío gratis</span>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 h-14 bg-tennis-green hover:bg-tennis-green/90 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-tennis-green/30 transition-colors"
                  >
                    <ShoppingCart size={20} /> Añadir al Carrito
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 h-14 bg-white/5 hover:bg-white/10 rounded-xl font-bold border border-white/10 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Share2 size={20} />
                  </motion.button>
                </div>
              </div>
            )}

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
              <h2 className="text-4xl lg:text-5xl font-black mb-4">Tecnología Avanzada</h2>
              <p className="text-tennis-white/60 text-lg max-w-2xl">
                Diseñada para jugadores de nivel intermedio y avanzado que buscan potencia, efecto y control.
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
