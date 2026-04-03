export type Zone = 'wide' | 'body' | 'T'
export type ShotType = 'forehand' | 'backhand' | 'volley' | 'overhead' | 'dropshot'
export type CourtSide = 'deuce' | 'ad'
export type PointOutcome = 'server_win' | 'returner_win'
export type RallyStage = 'serve' | 'return' | 'rally' | 'approach' | 'net'
export type TacticalDecision = 'aggressive' | 'lob' | 'neutral' | 'dropshot'

// Position state during rally
export interface CourtPosition {
  isOpen: boolean // opponent is positioned poorly
  distance: 'baseline' | 'midcourt' | 'net' // player's distance from net
  depth: 'deep' | 'shallow' // ball depth relative to baseline
}

export interface ServePayoffMatrix {
  [serverZone: string]: {
    [returnerRead: string]: number // server win %
  }
}

export interface RallyPayoffMatrix {
  [attackerShot: string]: {
    [defenderRead: string]: number // attacker win %
  }
}

export interface PlayerStrategy {
  id: string
  name: string
  // Serve mix (must sum to 1)
  serveMix: { wide: number; body: number; T: number }
  // Return bias: how much to commit vs stay neutral
  returnBias: number // 0 = pure neutral, 1 = full read/commit
  // Rally style
  rallyAggression: number // 0–1: how often to attack vs rally
  netApproachFreq: number // 0–1
  // Mental model: how much opponent adapts
  adaptationRate: number // 0–1
  // Tactical rally options (NEW)
  rallyLength: number // 0–1: tendency towards longer/shorter rallies
  openCourtFreq: number // 0–1: frequency of open court situations
  tacticAggression: number // 0–1: preference for aggressive tactics (vs defensive/lob)
  probabilityImpact: number // 0–1: how much tactical decisions affect win probability
}

export interface PointEvent {
  stage: RallyStage
  serverAction: string
  returnerAction: string
  rally: number // shot count in rally
  outcome: PointOutcome
  winProbability: number // at moment of decision
  tacticalDecision?: TacticalDecision // strategic choice (e.g., 'lob', 'aggressive')
}

export interface MatchPoint {
  id: number
  courtSide: CourtSide
  isBreakPoint: boolean
  isSetPoint: boolean
  events: PointEvent[]
  outcome: PointOutcome
  rallyLength: number
  serveZone: Zone
  returnerRead: Zone
  serverId: 0 | 1  // 0 = Player A, 1 = Player B
}

export interface MatchScore {
  sets: [number, number][]
  games: [number, number]
  points: [number, number]
  server: 0 | 1 // index of current server
}

export interface SimulationConfig {
  playerA: PlayerStrategy
  playerB: PlayerStrategy
  sets: number
  servePayoffs: ServePayoffMatrix
  rallyPayoffs: RallyPayoffMatrix
}

export interface NashEquilibrium {
  serverMix: { wide: number; body: number; T: number }
  returnerMix: { wide: number; body: number; T: number }
  expectedValue: number // server win %
}

export interface MatchResult {
  points: MatchPoint[]
  finalScore: MatchScore
  winner: 0 | 1
  stats: MatchStats
}

export interface MatchStats {
  totalPoints: number
  serverWinPct: [number, number]
  avgRallyLength: number
  aces: number
  breakPoints: number
  breakPointsConverted: number
  zoneFrequency: { wide: number; body: number; T: number }
  nashDeviation: number
}
