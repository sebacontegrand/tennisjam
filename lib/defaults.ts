import type { PlayerStrategy, ServePayoffMatrix } from '../types'

export const DEFAULT_SERVE_PAYOFFS: ServePayoffMatrix = {
  wide: { wide: 49, body: 62, T: 63 },
  body: { wide: 61, body: 50, T: 60 },
  T:    { wide: 62, body: 61, T: 49 },
}

export const PLAYER_PRESETS: Record<string, PlayerStrategy> = {
  baseline_grinder: {
    id: 'baseline_grinder',
    name: 'Player',
    serveMix: { wide: 0.4, body: 0.25, T: 0.35 },
    returnBias: 0.5,
    rallyAggression: 0.3,
    netApproachFreq: 0.05,
    adaptationRate: 0.6,
    rallyLength: 0.7,
    openCourtFreq: 0.25,
    tacticAggression: 0.2,
    probabilityImpact: 0.5,
  },
  big_server: {
    id: 'big_server',
    name: 'Player',
    serveMix: { wide: 0.25, body: 0.2, T: 0.55 },
    returnBias: 0.3,
    rallyAggression: 0.6,
    netApproachFreq: 0.2,
    adaptationRate: 0.4,
    rallyLength: 0.3,
    openCourtFreq: 0.45,
    tacticAggression: 0.8,
    probabilityImpact: 0.7,
  },
  all_court: {
    id: 'all_court',
    name: 'Player',
    serveMix: { wide: 0.35, body: 0.3, T: 0.35 },
    returnBias: 0.55,
    rallyAggression: 0.5,
    netApproachFreq: 0.3,
    adaptationRate: 0.7,
    rallyLength: 0.5,
    openCourtFreq: 0.5,
    tacticAggression: 0.5,
    probabilityImpact: 0.6,
  },
  serve_volley: {
    id: 'serve_volley',
    name: 'Player',
    serveMix: { wide: 0.3, body: 0.15, T: 0.55 },
    returnBias: 0.45,
    rallyAggression: 0.75,
    netApproachFreq: 0.65,
    adaptationRate: 0.5,
    rallyLength: 0.2,
    openCourtFreq: 0.6,
    tacticAggression: 0.85,
    probabilityImpact: 0.8,
  },
  counter_puncher: {
    id: 'counter_puncher',
    name: 'Player',
    serveMix: { wide: 0.45, body: 0.3, T: 0.25 },
    returnBias: 0.7,
    rallyAggression: 0.25,
    netApproachFreq: 0.08,
    adaptationRate: 0.85,
    rallyLength: 0.8,
    openCourtFreq: 0.3,
    tacticAggression: 0.15,
    probabilityImpact: 0.6,
  },
}

export const ZONE_COLORS: Record<string, string> = {
  wide: '#4ade80',
  body: '#facc15',
  T: '#60a5fa',
}

export const ZONE_LABELS: Record<string, string> = {
  wide: 'Wide',
  body: 'Body',
  T: 'T',
}
