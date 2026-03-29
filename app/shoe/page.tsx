import { ShoeShowcase } from "@/components/shoe-showcase"
import { ShoeExpertTestimonials } from "@/components/shoe-expert-testimonials"
import { ShoePlayerInterviewStories } from "@/components/shoe-player-interview-stories"
import { ShoeBuyingSection } from "@/components/shoe-buying-section"

export const metadata = {
  title: "Wilson Rush Pro 4.5 - Zapatilla de Tenis",
  description: "Descubre la zapatilla de tenis Wilson Rush Pro 4.5 con perspectivas de expertos y testimonios de jugadores.",
}

export default function ShoePage() {
  return (
    <main className="w-full bg-tennis-navy">
      <ShoeShowcase
        shoeName="RUSH PRO 4.5"
        price="$189.999,00"
        size="Tallas: 35-50"
        weight="270g"
        material="Mesh + Sintético"
        color="Blanco/Azul"
        showBuySection={false}
      />
      <ShoeExpertTestimonials />
      <ShoePlayerInterviewStories />
      <ShoeBuyingSection
        shoeName="RUSH PRO 4.5"
        price="$189.999,00"
        size="Tallas: 35-50"
        weight="270g"
        material="Mesh + Sintético"
        color="Blanco/Azul"
      />
    </main>
  )
}
