import { VideoPlayer } from "@/components/video-player"
import { AdBanner } from "@/components/ad-banner"
import { ShopCarousel } from "@/components/shop-carousel"
import { Share2, Trophy, Clock, Zap } from "lucide-react"

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    return (
        <div className="min-h-screen bg-tennis-navy pb-20">

            {/* Header */}
            <header className="sticky top-0 z-50 bg-tennis-navy/80 backdrop-blur-lg border-b border-white/5 px-4 h-14 flex items-center justify-between">
                <div className="font-bold text-tennis-white tracking-tight">REPETICIÓN DEL PARTIDO</div>
                <button className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                    <Share2 size={18} className="text-tennis-white" />
                </button>
            </header>

            <main className="max-w-7xl mx-auto p-4 space-y-8">

                {/* Top Section: Video & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left: Video Player (Smaller) */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                            <VideoPlayer />
                        </div>
                        <div className="flex justify-between items-start px-2">
                            <div>
                                <h1 className="text-2xl font-bold text-white">Sesión Matutina</h1>
                                <p className="text-sm text-white/60">12 Nov, 2024 • Cancha 3</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Briefing / Stats Grid */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-white/40 uppercase tracking-wider">Resumen</h2>
                            <div className="bg-tennis-green/20 text-tennis-green px-3 py-1 rounded-full text-xs font-bold border border-tennis-green/20">
                                GANADOR
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-card p-4 rounded-xl border border-white/5 text-center transition-transform hover:scale-105">
                                <Trophy size={24} className="mx-auto text-tennis-clay mb-2" />
                                <div className="text-3xl font-black text-white">6-4</div>
                                <div className="text-xs text-white/40 uppercase font-medium">Resultado</div>
                            </div>
                            <div className="bg-card p-4 rounded-xl border border-white/5 text-center transition-transform hover:scale-105">
                                <Clock size={24} className="mx-auto text-tennis-green mb-2" />
                                <div className="text-3xl font-black text-white">58m</div>
                                <div className="text-xs text-white/40 uppercase font-medium">Duración</div>
                            </div>
                            <div className="bg-card p-4 rounded-xl border border-white/5 text-center col-span-2 flex flex-row items-center justify-center gap-4 transition-transform hover:scale-105">
                                <Zap size={24} className="text-yellow-500" />
                                <div className="text-left">
                                    <div className="text-3xl font-black text-white leading-none">12</div>
                                    <div className="text-xs text-white/40 uppercase font-medium">Aces</div>
                                </div>
                            </div>
                        </div>

                        {/* Vertical Ad in Sidebar for Desktop */}
                        <div className="hidden lg:block">
                            <AdBanner
                                sponsor="Rolex"
                                tagline="La medida de la excelencia."
                                cta="Descubrir"
                                color="bg-[#006039]"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Ad (Hidden on Desktop) */}
                <section className="lg:hidden">
                    <AdBanner
                        sponsor="Rolex"
                        tagline="La medida de la excelencia."
                        cta="Descubrir"
                        color="bg-[#006039]"
                    />
                </section>

                {/* Shop Carousel */}
                <section>
                    <ShopCarousel />
                </section>

                {/* Ad Campaign 2 */}
                <section className="px-4">
                    <AdBanner
                        sponsor="Wilson"
                        tagline="Más victorias."
                        cta="Ver Raquetas"
                        color="bg-[#C8102E]"
                    />
                </section>

            </main>
        </div>
    )
}
