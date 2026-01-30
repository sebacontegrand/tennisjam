"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Camera, QrCode } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Mock Data Type
interface Court {
    id: string
    name: string
    cameras: string[]
}

export function CourtManager() {
    const [courts, setCourts] = useState<Court[]>([
        { id: "c1", name: "Cancha Central", cameras: ["CAM-01-N", "CAM-01-S"] },
        { id: "c2", name: "Cancha 2", cameras: ["CAM-02-FIXED"] },
    ])

    const [newCourtName, setNewCourtName] = useState("")
    const [newCamIds, setNewCamIds] = useState("")
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
    const [baseUrl, setBaseUrl] = useState("https://tennisjam.app")

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setBaseUrl(window.location.origin)
        }
    }, [])

    const handleAddCourt = () => {
        if (!newCourtName) return
        const newCourt: Court = {
            id: `c-${Date.now()}`,
            name: newCourtName,
            cameras: newCamIds.split(',').map(s => s.trim()).filter(Boolean)
        }
        setCourts([...courts, newCourt])
        setNewCourtName("")
        setNewCamIds("")
    }

    const handleDeleteCourt = (id: string) => {
        if (confirm("¿Eliminar esta cancha?")) {
            setCourts(courts.filter(c => c.id !== id))
            if (selectedCourt?.id === id) setSelectedCourt(null)
        }
    }

    const qrValue = selectedCourt ? `${baseUrl}/start?courtId=${selectedCourt.id}&courtName=${encodeURIComponent(selectedCourt.name)}` : ""

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left: Management List */}
            <div className="bg-card border border-white/10 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-bold text-tennis-white flex items-center gap-2">
                    <Camera size={20} className="text-tennis-clay" />
                    Gestión de Canchas y Cámaras
                </h3>

                {/* Add New */}
                <div className="bg-white/5 p-4 rounded-xl space-y-4 border border-white/5">
                    <Input
                        placeholder="Nombre (ej. Cancha 5)"
                        value={newCourtName}
                        onChange={e => setNewCourtName(e.target.value)}
                    />
                    <Input
                        placeholder="IDs de Cámara (separados por coma)"
                        value={newCamIds}
                        onChange={e => setNewCamIds(e.target.value)}
                    />
                    <Button onClick={handleAddCourt} className="w-full" disabled={!newCourtName}>
                        <Plus size={16} className="mr-2" /> Agregar Cancha
                    </Button>
                </div>

                {/* List */}
                <div className="space-y-3">
                    <AnimatePresence>
                        {courts.map(court => (
                            <motion.div
                                key={court.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedCourt?.id === court.id ? 'bg-tennis-green/20 border-tennis-green' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                onClick={() => setSelectedCourt(court)}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-tennis-white">{court.name}</div>
                                        <div className="text-xs text-tennis-white/60 mt-1 flex items-center gap-2">
                                            <Camera size={12} />
                                            {court.cameras.length > 0 ? court.cameras.join(", ") : "Sin cámaras asignadas"}
                                        </div>
                                        <div className="text-[10px] font-mono text-tennis-white/40 mt-1">ID: {court.id}</div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteCourt(court.id) }}
                                        className="text-tennis-white/40 hover:text-red-500 p-2"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right: QR Preview */}
            <div className="space-y-6">
                {selectedCourt ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-white/10 rounded-xl p-6 text-center space-y-6 sticky top-6"
                    >
                        {/* Printable Area Wrapper */}
                        <div id="printable-court-card" className="flex flex-col items-center">
                            <div className="bg-white p-6 rounded-xl inline-block shadow-2xl mb-6">
                                <QRCodeSVG
                                    value={qrValue}
                                    size={250}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-white print:text-black">{selectedCourt.name}</h2>
                                <p className="text-tennis-green font-mono text-xs mt-2 break-all max-w-[80%] mx-auto bg-tennis-green/10 px-2 py-1 rounded print:text-black print:bg-gray-100">
                                    {qrValue}
                                </p>
                            </div>

                            <div className="bg-white/5 p-4 rounded-xl text-left w-full mt-6 print:hidden">
                                <h4 className="text-xs font-bold text-tennis-white/60 uppercase mb-2">Configuración activa</h4>
                                <div className="space-y-2 text-sm text-tennis-white">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span>Cámaras Vinculadas:</span>
                                        <span className="font-mono text-tennis-clay">{selectedCourt.cameras.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>IDs de Transmisión:</span>
                                        <span className="font-mono text-right text-xs max-w-[150px]">{selectedCourt.cameras.join(", ")}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Print-only footer */}
                            <div className="hidden print:block mt-8 text-center text-sm text-gray-500">
                                <p>Escanea este código para iniciar tu partido.</p>
                                <p className="font-bold mt-2">TENNISJAM SYSTEM</p>
                            </div>
                        </div>

                        <Button className="w-full" onClick={() => window.print()}>
                            <QrCode size={18} className="mr-2" /> Imprimir Ficha de Cancha
                        </Button>
                    </motion.div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-tennis-white/40 border-2 border-dashed border-white/10 rounded-xl p-10 min-h-[400px]">
                        <QrCode size={48} className="mb-4 opacity-50" />
                        <p>Selecciona una cancha para generar su QR y ver configuración.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
