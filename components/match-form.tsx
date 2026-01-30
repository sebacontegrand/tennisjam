"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X, Video, MapPin, AlertCircle } from "lucide-react"

const formSchema = z.object({
    email: z.string().email("Email inválido"),
    duration: z.string().min(1, "Por favor selecciona una duración"),
    players: z.array(z.string().min(1, "El nombre del jugador es requerido")).min(1, "Se requiere al menos 1 jugador"),
})

type FormValues = z.infer<typeof formSchema>

interface MatchFormProps {
    courtId?: string | null
    courtName?: string | null
}

export function MatchForm({ courtId, courtName }: MatchFormProps) {
    const [players, setPlayers] = useState<string[]>([""])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [cameraBindStatus, setCameraBindStatus] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            duration: "60",
            players: [""]
        }
    })

    // Watch players to maintain sync
    const currentPlayers = watch("players")

    const addPlayer = () => {
        setValue("players", [...currentPlayers, ""])
        setPlayers([...players, ""])
    }

    const removePlayer = (index: number) => {
        if (players.length > 1) {
            const newPlayers = currentPlayers.filter((_, i) => i !== index)
            setValue("players", newPlayers)
            setPlayers(prev => prev.filter((_, i) => i !== index))
        }
    }

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true)
        setCameraBindStatus(null)

        // Simulate API call and Camera Binding
        console.log("Submitting match for Court:", courtId, "Data:", data)

        // Fake server delay
        await new Promise(resolve => setTimeout(resolve, 800))

        if (courtId && courtName) {
            setCameraBindStatus(`Vinculando a cámaras de ${courtName}...`)
            // Simulate camera binding check
            await new Promise(resolve => setTimeout(resolve, 1000))
            setCameraBindStatus("Grabación Iniciada. ¡Buen partido!")
            await new Promise(resolve => setTimeout(resolve, 800))
        }

        // In a real app, this would redirect with a match ID
        window.location.href = `/match/demo-match-id`
        setIsSubmitting(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto p-6 bg-[#0E1F3B] border border-white/5 rounded-2xl shadow-2xl backdrop-blur-xl"
        >
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-tennis-white mb-1">Check-In de Cancha</h1>
                {courtName ? (
                    <div className="inline-flex items-center gap-2 bg-tennis-green/10 text-tennis-green px-3 py-1 rounded-full text-xs font-bold border border-tennis-green/20">
                        <MapPin size={12} />
                        {courtName} Detectada
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-2 bg-tennis-clay/10 text-tennis-clay px-3 py-1 rounded-full text-xs font-bold border border-tennis-clay/20">
                        <AlertCircle size={12} />
                        Escaneo Manual / Sin Cancha
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Email Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-tennis-white/80">Email de Notificación</label>
                    <Input
                        {...register("email")}
                        placeholder="jugador@ejemplo.com"
                        className="bg-black/20"
                    />
                    {errors.email && <p className="text-tennis-clay text-xs">{errors.email.message}</p>}
                </div>

                {/* Duration Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-tennis-white/80">Duración</label>
                    <div className="grid grid-cols-4 gap-2">
                        {["30", "60", "90", "120"].map((time) => (
                            <button
                                key={time}
                                type="button"
                                onClick={() => setValue("duration", time)}
                                className={`
                  h-10 rounded-md text-sm font-medium transition-all
                  ${watch("duration") === time
                                        ? 'bg-tennis-green text-white shadow-lg shadow-tennis-green/20'
                                        : 'bg-white/5 text-tennis-white/60 hover:bg-white/10'}
                `}
                            >
                                {time}m
                            </button>
                        ))}
                    </div>
                    {errors.duration && <p className="text-tennis-clay text-xs">{errors.duration.message}</p>}
                </div>

                {/* Players List */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-tennis-white/80 flex justify-between items-center">
                        Jugadores
                        <span className="text-xs text-tennis-white/40">{players.length} Activos</span>
                    </label>

                    <div className="space-y-2">
                        {players.map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-2"
                            >
                                <Input
                                    {...register(`players.${index}`)}
                                    placeholder={`Nombre Jugador ${index + 1}`}
                                    className="bg-black/20"
                                />
                                {players.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removePlayer(index)}
                                        className="p-2 text-tennis-white/40 hover:text-tennis-clay transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={addPlayer}
                        className="w-full border-dashed border-white/20"
                    >
                        <Plus size={16} className="mr-2" /> Agregar Jugador
                    </Button>
                </div>

                <div className="space-y-2">
                    <Button
                        type="submit"
                        className="w-full h-12 text-base font-semibold"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">Conectando...</span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Video size={18} /> Iniciar Grabación
                            </span>
                        )}
                    </Button>

                    {cameraBindStatus && (
                        <p className="text-center text-xs text-tennis-green font-bold animate-pulse">
                            {cameraBindStatus}
                        </p>
                    )}
                </div>

            </form>
        </motion.div>
    )
}
