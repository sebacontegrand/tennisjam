'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Eraser, PenLine, RotateCcw, Users } from 'lucide-react'

type Mode = 'move' | 'draw'
type PlayerId = 'red' | 'blue'

type Point = {
  x: number
  y: number
}

type Stroke = {
  color: string
  width: number
  points: Point[]
}

type Player = {
  id: PlayerId
  name: string
  shirtColor: string
  accentColor: string
  x: number
  y: number
}

const COURT_ASPECT_RATIO = 1531 / 980
const PLAYER_MARKER_WIDTH = 72
const PLAYER_MARKER_HEIGHT = 104
const DRAW_COLORS = ['#ffffff', '#ef4444', '#3b82f6', '#facc15', '#22c55e']
const STROKE_WIDTHS = [3, 5, 8, 12]
const INITIAL_PLAYERS: Player[] = [
  {
    id: 'red',
    name: 'Jugador Rojo',
    shirtColor: '#ef4444',
    accentColor: '#fca5a5',
    x: 0.33,
    y: 0.72,
  },
  {
    id: 'blue',
    name: 'Jugador Azul',
    shirtColor: '#2563eb',
    accentColor: '#93c5fd',
    x: 0.67,
    y: 0.28,
  },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function TennisPlayer({
  player,
  active,
}: {
  player: Player
  active: boolean
}) {
  return (
    <div className="relative flex h-[112px] w-[78px] items-end justify-center">
      <div
        className="absolute bottom-3 h-14 w-14 rounded-full blur-2xl transition-all"
        style={{
          backgroundColor: player.shirtColor,
          opacity: active ? 0.48 : 0.28,
        }}
      />
      <svg
        viewBox="0 0 96 132"
        aria-hidden="true"
        className="pointer-events-none relative z-20 h-full w-full select-none drop-shadow-[0_16px_28px_rgba(15,23,42,0.42)]"
      >
        <ellipse cx="49" cy="124" rx="18" ry="5" fill="rgba(15,23,42,0.25)" />

        <g transform="translate(64 18) rotate(22)">
          <ellipse
            cx="10"
            cy="12"
            rx="9"
            ry="15"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="3"
          />
          <rect x="8.5" y="24" width="3" height="30" rx="1.5" fill="#d6a85f" />
        </g>

        <circle cx="47" cy="22" r="10" fill="#f2c9a5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
        <path
          d="M38 20c3-7 15-8 19-1-1 0-2 1-3 1-2-2-5-3-8-3-3 0-6 1-8 3Z"
          fill="#111827"
        />

        <path
          d="M36 35c2-6 8-10 12-10s10 4 12 10l2 16H34Z"
          fill={player.shirtColor}
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="1.5"
        />
        <path d="M42 35h10l2 24H40Z" fill={player.shirtColor} opacity="0.82" />

        <path d="M34 39 24 56" stroke="#f2c9a5" strokeWidth="4.2" strokeLinecap="round" />
        <path d="M60 39 70 50" stroke="#f2c9a5" strokeWidth="4.2" strokeLinecap="round" />
        <path d="M70 50 74 39" stroke="#f2c9a5" strokeWidth="4.2" strokeLinecap="round" />

        <path d="M42 59 39 91" stroke="#f2c9a5" strokeWidth="4.6" strokeLinecap="round" />
        <path d="M54 59 58 91" stroke="#f2c9a5" strokeWidth="4.6" strokeLinecap="round" />
        <path d="M39 91 31 118" stroke="#f8fafc" strokeWidth="4.2" strokeLinecap="round" />
        <path d="M58 91 64 118" stroke="#f8fafc" strokeWidth="4.2" strokeLinecap="round" />

        <path d="M38 58h18" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round" />
        <path d="M41 62h12" stroke="#0f172a" strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div
        className="absolute inset-x-3 bottom-2 top-2 rounded-[26px] transition-all"
        style={{
          boxShadow: active
            ? `0 0 0 2px ${player.accentColor}40, 0 18px 38px rgba(15, 23, 42, 0.32)`
            : '0 16px 28px rgba(15, 23, 42, 0.2)',
        }}
      />
    </div>
  )
}

export default function TennisTacticsBoard() {
  const [mode, setMode] = useState<Mode>('move')
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS)
  const [selectedColor, setSelectedColor] = useState(DRAW_COLORS[0])
  const [selectedWidth, setSelectedWidth] = useState(STROKE_WIDTHS[1])
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [courtSize, setCourtSize] = useState({ width: 0, height: 0 })

  const courtRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dragPlayerRef = useRef<PlayerId | null>(null)
  const drawStrokeRef = useRef<Stroke | null>(null)

  const activeModeLabel = useMemo(
    () =>
      mode === 'move'
        ? 'Modo mover: arrastra a los jugadores para ajustar su posicion en la cancha.'
        : 'Modo dibujar: marca patrones y trayectorias sobre la cancha.',
    [mode]
  )

  useLayoutEffect(() => {
    const node = courtRef.current
    if (!node) return

    const updateSize = () => {
      const rect = node.getBoundingClientRect()
      setCourtSize({ width: rect.width, height: rect.height })
    }

    updateSize()

    const observer = new ResizeObserver(() => updateSize())
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !courtSize.width || !courtSize.height) return

    const ratio = window.devicePixelRatio || 1
    canvas.width = Math.round(courtSize.width * ratio)
    canvas.height = Math.round(courtSize.height * ratio)
    canvas.style.width = `${courtSize.width}px`
    canvas.style.height = `${courtSize.height}px`

    const context = canvas.getContext('2d')
    if (!context) return

    context.setTransform(1, 0, 0, 1, 0, 0)
    context.scale(ratio, ratio)
    context.clearRect(0, 0, courtSize.width, courtSize.height)
    context.lineCap = 'round'
    context.lineJoin = 'round'

    strokes.forEach((stroke) => {
      if (!stroke.points.length) return
      context.beginPath()
      context.strokeStyle = stroke.color
      context.lineWidth = stroke.width
      stroke.points.forEach((point, index) => {
        const x = point.x * courtSize.width
        const y = point.y * courtSize.height
        if (index === 0) {
          context.moveTo(x, y)
          return
        }
        context.lineTo(x, y)
      })

      if (stroke.points.length === 1) {
        const point = stroke.points[0]
        context.arc(
          point.x * courtSize.width,
          point.y * courtSize.height,
          stroke.width / 2,
          0,
          Math.PI * 2
        )
        context.fillStyle = stroke.color
        context.fill()
      } else {
        context.stroke()
      }
    })
  }, [courtSize.height, courtSize.width, strokes])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const node = courtRef.current
      if (!node) return

      const rect = node.getBoundingClientRect()
      const halfWidth = PLAYER_MARKER_WIDTH / 2 / rect.width
      const halfHeight = PLAYER_MARKER_HEIGHT / 2 / rect.height
      const x = clamp((event.clientX - rect.left) / rect.width, halfWidth, 1 - halfWidth)
      const y = clamp((event.clientY - rect.top) / rect.height, halfHeight, 1 - halfHeight)

      if (dragPlayerRef.current) {
        setPlayers((current) =>
          current.map((player) =>
            player.id === dragPlayerRef.current ? { ...player, x, y } : player
          )
        )
        return
      }

      if (drawStrokeRef.current && mode === 'draw') {
        setStrokes((current) => {
          const next = [...current]
          const lastStroke = next[next.length - 1]
          if (!lastStroke) return current

          lastStroke.points = [...lastStroke.points, { x, y }]
          return next
        })
      }
    }

    const endInteraction = () => {
      dragPlayerRef.current = null
      drawStrokeRef.current = null
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', endInteraction)
    window.addEventListener('pointercancel', endInteraction)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', endInteraction)
      window.removeEventListener('pointercancel', endInteraction)
    }
  }, [mode])

  const beginPlayerDrag = (playerId: PlayerId) => (event: React.PointerEvent<HTMLButtonElement>) => {
    if (mode !== 'move') return
    event.preventDefault()
    dragPlayerRef.current = playerId
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const beginDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode !== 'draw') return
    event.preventDefault()

    const node = courtRef.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1)
    const stroke: Stroke = {
      color: selectedColor,
      width: selectedWidth,
      points: [{ x, y }],
    }

    drawStrokeRef.current = stroke
    setStrokes((current) => [...current, stroke])
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const clearDrawings = () => {
    drawStrokeRef.current = null
    setStrokes([])
  }

  const resetAll = () => {
    dragPlayerRef.current = null
    drawStrokeRef.current = null
    setPlayers(INITIAL_PLAYERS)
    setStrokes([])
    setMode('move')
    setSelectedColor(DRAW_COLORS[0])
    setSelectedWidth(STROKE_WIDTHS[1])
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_30%),linear-gradient(180deg,_#07111f_0%,_#0a192f_48%,_#07111f_100%)] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft size={16} />
                Volver al inicio
              </Link>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/80">
                  Pizarra Tactica Interactiva
                </p>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Dibuja jugadas. Reubica jugadores. Prepara el punto.
                </h1>
                <p className="max-w-xl text-sm leading-6 text-white/70 sm:text-base">
                  Usa el modo mover para ubicar a ambos jugadores en cualquier parte de la
                  cancha. Cambia al modo dibujar para marcar desplazamientos, objetivos y
                  secuencias del peloteo sin arrastrar los marcadores.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
              <button
                type="button"
                onClick={() => setMode('move')}
                className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  mode === 'move'
                    ? 'border-emerald-300/50 bg-emerald-400/15 text-white shadow-lg shadow-emerald-900/30'
                    : 'border-white/10 bg-slate-950/40 text-white/70 hover:border-white/20 hover:text-white'
                }`}
              >
                <Users size={18} />
                Mover Jugadores
              </button>
              <button
                type="button"
                onClick={() => setMode('draw')}
                className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  mode === 'draw'
                    ? 'border-sky-300/50 bg-sky-400/15 text-white shadow-lg shadow-sky-900/30'
                    : 'border-white/10 bg-slate-950/40 text-white/70 hover:border-white/20 hover:text-white'
                }`}
              >
                <PenLine size={18} />
                Dibujar Jugadas
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-2 sm:p-3 lg:p-4">
              <div
                ref={courtRef}
                className="relative mx-auto w-full overflow-hidden rounded-[20px] border border-white/10 bg-[#0d5a41] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                style={{ aspectRatio: `${COURT_ASPECT_RATIO}` }}
              >
                <Image
                  src="/tenniscourt.jpg"
                  alt="Tennis court background"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/18 via-transparent to-slate-950/10" />

                <canvas
                  ref={canvasRef}
                  onPointerDown={beginDrawing}
                  className={`absolute inset-0 z-10 h-full w-full ${
                    mode === 'draw' ? 'pointer-events-auto cursor-crosshair touch-none' : 'pointer-events-none'
                  }`}
                  aria-label="Capa de dibujo de tactica de tenis"
                />

                {players.map((player) => (
                  <button
                    key={player.id}
                    type="button"
                    onPointerDown={beginPlayerDrag(player.id)}
                    className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                      mode === 'move' ? 'cursor-grab active:cursor-grabbing touch-none' : 'pointer-events-none'
                    }`}
                    style={{
                      left: `${player.x * 100}%`,
                      top: `${player.y * 100}%`,
                    }}
                    aria-label={`Move ${player.name}`}
                    
                  >
                    <TennisPlayer player={player} active={mode === 'move'} />
                    <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-black/10 bg-slate-950/75 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white/90 backdrop-blur">
                      {player.name}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <aside className="grid w-full gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
              <section className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-white/50">
                    Controles
                  </h2>
                  <p className="text-sm leading-6 text-white/75">{activeModeLabel}</p>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                      Color del Trazo
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {DRAW_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`h-11 w-11 rounded-2xl border transition ${
                            selectedColor === color
                              ? 'scale-105 border-white shadow-lg shadow-black/20'
                              : 'border-white/15 hover:border-white/35'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Elegir color ${color}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                      Grosor del Trazo
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {STROKE_WIDTHS.map((width) => (
                        <button
                          key={width}
                          type="button"
                          onClick={() => setSelectedWidth(width)}
                          className={`flex min-h-11 items-center justify-center rounded-2xl border text-sm font-semibold transition ${
                            selectedWidth === width
                              ? 'border-sky-300/50 bg-sky-400/15 text-white'
                              : 'border-white/10 bg-slate-950/40 text-white/70 hover:border-white/20 hover:text-white'
                          }`}
                          aria-label={`Elegir grosor ${width}`}
                        >
                          {width}px
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={clearDrawings}
                      className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
                    >
                      <Eraser size={16} />
                      Limpiar Dibujo
                    </button>
                    <button
                      type="button"
                      onClick={resetAll}
                      className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 text-sm font-semibold text-amber-50 transition hover:border-amber-200/30 hover:bg-amber-300/15"
                    >
                      <RotateCcw size={16} />
                      Reiniciar Pizarra
                    </button>
                  </div>
                </div>
              </section>

              <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-white/50">
                  Uso
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-6 text-white/70">
                  <p>El modo mover desactiva la capa de dibujo para que arrastrar jugadores sea preciso.</p>
                  <p>El modo dibujar desactiva los jugadores y convierte la cancha en una superficie lista para tocar y dibujar.</p>
                  <p>Todas las anotaciones escalan con la imagen, asi que el diseno se mantiene en celular y en pantallas grandes.</p>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}
