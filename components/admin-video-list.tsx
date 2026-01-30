"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Trash2, Calendar, Clock, User } from "lucide-react"

// Mock Data
const INITIAL_VIDEOS = [
    { id: 1, court: "Court 3", date: "2024-11-12", time: "09:00 AM", duration: "58m", players: ["Sebastian C.", "Rafael N."] },
    { id: 2, court: "Center Court", date: "2024-11-12", time: "10:30 AM", duration: "1h 20m", players: ["Serena W.", "Venus W."] },
    { id: 3, court: "Court 1", date: "2024-11-11", time: "04:00 PM", duration: "45m", players: ["Roger F.", "Novak D."] },
]

export function AdminVideoList() {
    const [videos, setVideos] = useState(INITIAL_VIDEOS)

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this recording?")) {
            setVideos(videos.filter(v => v.id !== id))
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-tennis-white">Grabaciones Recientes</h3>
                <span className="text-xs font-mono text-tennis-green border border-tennis-green/20 px-2 py-1 rounded bg-tennis-green/10">
                    {videos.length} Sesiones Activas
                </span>
            </div>

            <div className="grid gap-4">
                {videos.map((video) => (
                    <div key={video.id} className="bg-card border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition-colors group">

                        {/* Info */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                <Play size={20} className="text-tennis-white/40 group-hover:text-tennis-green transition-colors" />
                            </div>
                            <div>
                                <h4 className="font-bold text-tennis-white text-sm">{video.court}</h4>
                                <div className="flex items-center gap-3 text-xs text-tennis-white/60 mt-1">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {video.date}</span>
                                    <span className="flex items-center gap-1"><Clock size={12} /> {video.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-tennis-white/40 mt-1">
                                    <User size={12} /> {video.players.join(" vs ")}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                            <Button variant="outline" className="h-8 text-xs border-white/10 hover:bg-tennis-green hover:border-tennis-green hover:text-white">
                                Ver Partido
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => handleDelete(video.id)}
                                className="h-8 w-8 p-0 text-tennis-white/40 hover:text-tennis-clay hover:bg-tennis-clay/10"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>

                    </div>
                ))}

                {videos.length === 0 && (
                    <div className="text-center py-10 text-tennis-white/40 border border-dashed border-white/10 rounded-xl">
                        No se encontraron grabaciones.
                    </div>
                )}
            </div>
        </div>
    )
}
