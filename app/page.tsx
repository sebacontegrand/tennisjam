import Link from "next/link"
import { ArrowRight, QrCode, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-tennis-navy flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-tennis-green/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-lg space-y-8">
        <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-tennis-white to-gray-500 leading-tight">
          TENNIS<br /><span className="text-tennis-green">JAM</span>
        </h1>

        <p className="text-xl text-tennis-white/60 font-medium">
          El futuro del análisis en cancha. <br />Graba. Revisa. Repite.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto pt-8">
          <Link href="/start" className="w-full">
            <button className="w-full h-14 bg-tennis-green hover:bg-tennis-green/90 text-white rounded-xl font-bold text-lg shadow-xl shadow-tennis-green/20 flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95">
              <QrCode size={20} /> Escanear Cancha
            </button>
          </Link>

          <Link href="/racquet" className="w-full">
            <button className="w-full h-14 bg-tennis-clay hover:bg-tennis-clay/90 text-white rounded-xl font-bold text-lg shadow-xl shadow-tennis-clay/20 flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95">
              🎾 Ver Raquetas
            </button>
          </Link>

          <Link href="/shoe" className="w-full">
            <button className="w-full h-14 bg-tennis-green hover:bg-tennis-green/90 text-white rounded-xl font-bold text-lg shadow-xl shadow-tennis-green/20 flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95">
              👟 Ver Zapatillas
            </button>
          </Link>

          <Link href="/admin" className="w-full">
            <button className="w-full h-14 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-lg border border-white/10 flex items-center justify-center gap-3 transition-colors">
              <Shield size={20} className="text-tennis-clay" /> Admin / Gestor
            </button>
          </Link>

          <Link href="/match/demo" className="w-full">
            <button className="w-full h-14 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-lg border border-white/10 flex items-center justify-center gap-3 transition-colors">
              Ver Partido Demo <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-6 text-xs text-white/20 uppercase tracking-widest">
        Powered by Deepmind
      </footer>
    </div>
  )
}
