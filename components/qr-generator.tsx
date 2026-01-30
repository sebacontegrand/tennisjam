"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"

export function QRGenerator() {
    const [courtName, setCourtName] = useState("Court 1")
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tennisjam.app'
    const qrValue = `${baseUrl}/start?court=${encodeURIComponent(courtName)}`

    return (
        <div className="bg-card border border-white/10 rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-tennis-white">Generador QR de Cancha</h3>
                    <p className="text-sm text-tennis-white/60">Genera códigos de check-in para cada cancha.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 items-center">
                {/* QR Preview */}
                <div className="bg-white p-4 rounded-xl shadow-lg">
                    <QRCodeSVG
                        value={qrValue}
                        size={200}
                        level="H"
                        includeMargin={true}
                    />
                    <div className="text-center mt-2 font-mono text-black font-bold text-sm uppercase">
                        {courtName}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-2">
                        <label className="text-sm text-tennis-white/80 font-medium">Nombre / ID de Cancha</label>
                        <Input
                            value={courtName}
                            onChange={(e) => setCourtName(e.target.value)}
                            placeholder="ej. Cancha Central"
                        />
                    </div>

                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <span className="text-xs text-tennis-white/40 uppercase font-bold block mb-1">URL Codificada</span>
                        <code className="text-xs text-tennis-green break-all">{qrValue}</code>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button className="flex-1" variant="outline">
                            <Printer size={16} className="mr-2" /> Imprimir PDF
                        </Button>
                        <Button className="flex-1">
                            <Download size={16} className="mr-2" /> Descargar SVG
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
