import { RacquetShowcase } from "@/components/racquet-showcase"
import { ExpertTestimonials } from "@/components/expert-testimonials"
import { PlayerInterviewStories } from "@/components/player-interview-stories"
import { RacquetBuyingSection } from "@/components/racquet-buying-section"

export const metadata = {
  title: "Ultra 100 V5 - Raqueta de Tenis",
  description: "Descubre la raqueta de tenis Wilson Ultra 100 V5 con perspectivas de expertos y testimonios de jugadores.",
}

export default function RacquetPage() {
  return (
    <main className="w-full bg-tennis-navy">
      <RacquetShowcase
        racquetName="ULTRA 100 V5"
        price="$474.999,00"
        grip="4 1/4"
        headSize="100"
        weight="300g"
        pattern="16 x 19"
        color="Electric Blue"
        showBuySection={false}
      />
      <ExpertTestimonials />
      <PlayerInterviewStories />
      <RacquetBuyingSection
        racquetName="ULTRA 100 V5"
        price="$474.999,00"
        grip="4 1/4"
        headSize="100"
        weight="300g"
        pattern="16 x 19"
        color="Electric Blue"
      />
    </main>
  )
}
