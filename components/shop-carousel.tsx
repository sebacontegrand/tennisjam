"use client"
import { motion } from "framer-motion"
import { ArrowRight, ShoppingBag } from "lucide-react"

const ITEMS = [
    { id: 1, name: "Overgrip Pro", price: "$5.99", img: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=60" },
    { id: 2, name: "Zoquetes Performance", price: "$12.99", img: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=60" },
    { id: 3, name: "Antivibrador", price: "$4.99", img: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60" },
    { id: 4, name: "Gorra Tour", price: "$24.99", img: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=800&auto=format&fit=crop&q=60" },
    { id: 5, name: "Muñequeras", price: "$9.99", img: "https://images.unsplash.com/photo-1616699002805-0741e1e4a9c5?w=800&auto=format&fit=crop&q=60" },
]

export function ShopCarousel() {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center px-4 mb-4">
                <h3 className="text-lg font-bold text-tennis-white flex items-center gap-2">
                    <ShoppingBag size={20} className="text-tennis-green" />
                    Equipamiento Destacado
                </h3>
                <button className="text-xs text-tennis-green font-semibold flex items-center gap-1 hover:underline">
                    Ver Tienda <ArrowRight size={12} />
                </button>
            </div>

            <div className="flex overflow-x-auto gap-4 px-4 pb-6 snap-x snap-mandatory scrollbar-hide">
                {ITEMS.map((item) => (
                    <motion.div
                        key={item.id}
                        className="flex-shrink-0 w-40 snap-start bg-card rounded-xl overflow-hidden border border-white/5 shadow-lg group relative"
                        whileHover={{ y: -5 }}
                    >
                        <div className="aspect-square bg-white/5 relative">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                            <h4 className="text-xs font-medium text-white/80 line-clamp-1">{item.name}</h4>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-sm font-bold text-tennis-green">{item.price}</span>
                                <button className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-tennis-clay hover:text-white transition-colors">
                                    <span className="text-xs">+</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
