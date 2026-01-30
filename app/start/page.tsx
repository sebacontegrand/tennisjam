"use client"

import { MatchForm } from "@/components/match-form"
import { Suspense } from "react"

// Separate component to handle search params in Suspense
import { useSearchParams } from "next/navigation"

function StartPageContent() {
    const searchParams = useSearchParams()
    const courtId = searchParams.get("courtId")
    const courtName = searchParams.get("courtName")

    return (
        <div className="min-h-screen bg-tennis-navy flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-tennis-green/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-tennis-clay/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Brand */}
            <div className="mb-12 text-center relative z-10">
                <h1 className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-tennis-white to-gray-400 italic">
                    TENNIS<span className="text-tennis-green">JAM</span>
                </h1>
                <p className="text-tennis-white/60 text-sm mt-2 font-medium tracking-wide">SISTEMA DE CANCHA INTELIGENTE</p>
            </div>

            {/* Main Form */}
            <div className="w-full relative z-10">
                <MatchForm courtId={courtId} courtName={courtName} />
            </div>

        </div>
    )
}

export default function StartPage() {
    return (
        <Suspense fallback={<div className="text-white text-center pt-20">Cargando...</div>}>
            <StartPageContent />
        </Suspense>
    )
}
