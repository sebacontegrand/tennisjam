import { AdminVideoList } from "@/components/admin-video-list"
import { CourtManager } from "@/components/court-manager"
import { Shield, Activity } from "lucide-react"

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-tennis-navy p-6 md:p-10">

            {/* Header */}
            <header className="max-w-6xl mx-auto mb-10 flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-white flex items-center gap-3">
                        <Shield className="text-tennis-clay" size={32} />
                        ADMINISTRADOR
                    </h1>
                    <p className="text-tennis-white/60 mt-1">Gestiona activos de cancha y grabaciones.</p>
                </div>
                <div className="flex items-center gap-2 bg-tennis-green/10 px-4 py-2 rounded-full border border-tennis-green/20">
                    <div className="w-2 h-2 rounded-full bg-tennis-green animate-pulse" />
                    <span className="text-xs font-bold text-tennis-green uppercase tracking-wide">Sistema Online</span>
                </div>
            </header>

            <main className="max-w-6xl mx-auto space-y-12">

                {/* Top: Court Management */}
                <section>
                    <h2 className="text-sm font-bold text-white/40 uppercase mb-4 tracking-wider flex items-center gap-2">
                        <Activity size={16} /> Gestión de Activos
                    </h2>
                    <CourtManager />
                </section>

                {/* Bottom: Video Management */}
                <section>
                    <h2 className="text-sm font-bold text-white/40 uppercase mb-4 tracking-wider">Gestión de Sesiones</h2>
                    <AdminVideoList />
                </section>

            </main>
        </div>
    )
}
