"use client"
import { motion } from "framer-motion"
import { ShoppingCart, Check, Truck, Shield } from "lucide-react"

interface ShoeBuyingSectionProps {
  shoeName?: string
  price?: string
  size?: string
  weight?: string
  material?: string
  color?: string
}

export function ShoeBuyingSection({
  shoeName = "RUSH PRO 4.5",
  price = "$189.999,00",
  size = "Tallas: 35-50",
  weight = "270g",
  material = "Mesh + Sintético",
  color = "Blanco/Azul",
}: ShoeBuyingSectionProps) {
  const specs = [
    { label: "Modelo", value: shoeName },
    { label: "Peso por Zapato", value: weight },
    { label: "Material", value: material },
    { label: "Disponible en", value: size },
    { label: "Color", value: color },
  ]

  const benefits = [
    { icon: Check, title: "Calidad Premium", description: "Fabricado por Wilson con estándares profesionales" },
    { icon: Truck, title: "Envío Rápido", description: "Entrega en 2-4 días hábiles" },
    { icon: Shield, title: "Garantía", description: "Garantía de 2 años del fabricante" },
  ]

  return (
    <div className="w-full bg-gradient-to-b from-black to-tennis-navy py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black mb-4 text-white">Obtén Tus Zapatillas Ahora</h2>
          <p className="text-tennis-white/60 text-lg max-w-2xl mx-auto">
            Después de conocer cómo expertos y jugadores han mejorado su juego, es tu turno de experimentar la comodidad de las Rush Pro 4.5.
          </p>
        </motion.div>

        {/* Main Buying Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Product Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Product Name & Price */}
            <div className="space-y-6">
              <div>
                <p className="text-tennis-green font-semibold text-sm uppercase tracking-widest mb-2">Zapatilla Wilson</p>
                <h3 className="text-4xl lg:text-5xl font-black mb-4">{shoeName}</h3>
              </div>

              {/* Price Tag */}
              <div className="bg-gradient-to-br from-tennis-green/20 to-tennis-green/5 rounded-2xl p-8 border border-tennis-green/30">
                <p className="text-tennis-white/60 text-sm uppercase tracking-widest mb-2">Precio Especial</p>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-5xl font-black text-tennis-green">{price}</span>
                </div>
                <p className="text-tennis-green/80 text-sm flex items-center gap-2">
                  <Truck size={16} /> Envío gratis a todo el país
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4">
                {specs.map((spec, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <p className="text-tennis-white/50 text-xs uppercase tracking-widest mb-2">{spec.label}</p>
                    <p className="text-lg font-bold text-white">{spec.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-16 bg-tennis-green hover:bg-tennis-green/90 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-tennis-green/40 transition-colors"
              >
                <ShoppingCart size={24} /> Comprar Ahora
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-14 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/10 transition-colors"
              >
                Agregar a Lista de Deseos
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="space-y-2 text-sm text-tennis-white/60">
              <p className="flex items-center gap-2">
                <Shield size={16} className="text-tennis-green" /> Compra segura con SSL encriptado
              </p>
              <p className="flex items-center gap-2">
                <Check size={16} className="text-tennis-green" /> Disponible en stock
              </p>
            </div>
          </motion.div>

          {/* Right: Why This Shoe */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h4 className="text-2xl font-bold text-white mb-8">¿Por Qué Elegir las Rush Pro 4.5?</h4>

            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  viewport={{ once: true }}
                  className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-tennis-green/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <Icon className="w-6 h-6 text-tennis-green mt-1" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-1">{benefit.title}</h5>
                    <p className="text-tennis-white/60 text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              )
            })}

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              viewport={{ once: true }}
              className="mt-8 p-6 rounded-lg bg-gradient-to-br from-tennis-green/10 to-transparent border border-tennis-green/30"
            >
              <p className="text-tennis-white/80 text-sm leading-relaxed">
                <span className="font-bold text-tennis-green">Nota:</span> Las Rush Pro 4.5 están diseñadas para jugadores de nivel intermedio a avanzado que buscan máxima comodidad y rendimiento.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 pt-20 border-t border-white/10"
        >
          <h4 className="text-2xl font-bold text-white mb-8">Comparativa de Zapatillas Wilson</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-tennis-white/60">Modelo</th>
                  <th className="text-left py-4 px-4 text-tennis-white/60">Nivel</th>
                  <th className="text-left py-4 px-4 text-tennis-white/60">Enfoque</th>
                  <th className="text-left py-4 px-4 text-tennis-white/60">Precio</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10 bg-tennis-green/10">
                  <td className="py-4 px-4 font-bold text-tennis-green">Rush Pro 4.5</td>
                  <td className="py-4 px-4 text-white">Intermedio - Avanzado</td>
                  <td className="py-4 px-4 text-white">Comodidad + Rendimiento</td>
                  <td className="py-4 px-4 font-bold text-tennis-green">{price}</td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-4 px-4 text-tennis-white/80">Rush Pro 4.0</td>
                  <td className="py-4 px-4 text-tennis-white/80">Intermedio</td>
                  <td className="py-4 px-4 text-tennis-white/80">Comodidad</td>
                  <td className="py-4 px-4 text-tennis-white/80">$149.999,00</td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-4 px-4 text-tennis-white/80">Rush Elite</td>
                  <td className="py-4 px-4 text-tennis-white/80">Avanzado</td>
                  <td className="py-4 px-4 text-tennis-white/80">Rendimiento</td>
                  <td className="py-4 px-4 text-tennis-white/80">$219.999,00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
