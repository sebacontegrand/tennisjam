import type {
  Zone,
  PlayerStrategy,
  ServePayoffMatrix,
  NashEquilibrium,
  PointOutcome,
  PointEvent,
  TacticalDecision,
  MatchPoint,
  MatchScore,
  SimulationConfig,
  MatchResult,
  MatchStats,
} from '../types'

// ─── Helpers ────────────────────────────────────────────────────────────────

export function weightedSample<T extends string>(mix: Record<T, number>): T {
  let r = Math.random()
  let cum = 0
  for (const k in mix) {
    cum += mix[k]
    if (r < cum) return k as T
  }
  return Object.keys(mix).slice(-1)[0] as T
}

function clamp(v: number, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, v))
}

// ─── Nash Equilibrium (Fictitious Play) ─────────────────────────────────────

export function solveNash(payoffs: ServePayoffMatrix): NashEquilibrium {
  const zones: Zone[] = ['wide', 'body', 'T']
  const serverCount = { wide: 1, body: 1, T: 1 }
  const returnCount = { wide: 1, body: 1, T: 1 }

  for (let i = 0; i < 5000; i++) {
    const rt = returnCount.wide + returnCount.body + returnCount.T
    const rmix = {
      wide: returnCount.wide / rt,
      body: returnCount.body / rt,
      T: returnCount.T / rt,
    }

    // Server best response
    let bestServe: Zone = 'wide'
    let bestVal = -Infinity
    zones.forEach((s) => {
      const val = zones.reduce((a, r) => a + rmix[r] * (payoffs[s]?.[r] ?? 60), 0)
      if (val > bestVal) {
        bestVal = val
        bestServe = s
      }
    })
    serverCount[bestServe]++

    const st = serverCount.wide + serverCount.body + serverCount.T
    const smix = {
      wide: serverCount.wide / st,
      body: serverCount.body / st,
      T: serverCount.T / st,
    }

    // Returner best response (minimize server win %)
    let bestRead: Zone = 'wide'
    let bestReadVal = Infinity
    zones.forEach((r) => {
      const val = zones.reduce((a, s) => a + smix[s] * (payoffs[s]?.[r] ?? 60), 0)
      if (val < bestReadVal) {
        bestReadVal = val
        bestRead = r
      }
    })
    returnCount[bestRead]++
  }

  const st = serverCount.wide + serverCount.body + serverCount.T
  const rt = returnCount.wide + returnCount.body + returnCount.T
  const serverMix = {
    wide: serverCount.wide / st,
    body: serverCount.body / st,
    T: serverCount.T / st,
  }
  const returnerMix = {
    wide: returnCount.wide / rt,
    body: returnCount.body / rt,
    T: returnCount.T / rt,
  }

  const expectedValue = zones.reduce(
    (acc, s) =>
      acc +
      serverMix[s] *
        zones.reduce((a2, r) => a2 + returnerMix[r] * (payoffs[s]?.[r] ?? 60), 0),
    0
  )

  return { serverMix, returnerMix, expectedValue }
}

// ─── Tactical Decision Logic ────────────────────────────────────────────────

interface TacticalContext {
  rally: number
  isOpen: boolean
  aggressor: PlayerStrategy
  defender: PlayerStrategy
  isServerAttacking: boolean
}

function chooseTacticalShot(ctx: TacticalContext): TacticalDecision {
  const { rally, isOpen, aggressor, defender, isServerAttacking } = ctx

  // Early rally: mostly neutral
  if (rally <= 3) {
    return 'neutral'
  }

  // Open court position: decide based on aggression level
  if (isOpen) {
    // More aggressive players go for aggressive shots earlier
    if (aggressor.rallyAggression > 0.6) {
      return Math.random() < aggressor.rallyAggression ? 'aggressive' : 'neutral'
    } else if (aggressor.rallyAggression < 0.35) {
      // Defensive players prefer lobs on open courts
      return Math.random() < 0.4 ? 'lob' : 'neutral'
    } else {
      // Mid-range aggression: balanced choice
      const r = Math.random()
      return r < 0.35 ? 'aggressive' : r < 0.65 ? 'neutral' : 'lob'
    }
  }

  // Closed court: defensive options
  if (aggressor.rallyAggression > 0.65) {
    // Aggressive players take risks
    return Math.random() < 0.4 ? 'aggressive' : 'neutral'
  } else if (aggressor.rallyAggression < 0.35) {
    // Defensive players play safe or lobby
    return Math.random() < 0.5 ? 'lob' : 'neutral'
  } else {
    // Neutral: mostly safe shots
    return 'neutral'
  }
}

function getTacticalShotOutcome(
  decision: TacticalDecision,
  aggressor: PlayerStrategy,
  defender: PlayerStrategy,
  isServerAttacking: boolean
): { winProb: number; description: string } {
  let baseProb = 0.5 + (aggressor.rallyAggression - defender.rallyAggression) * 0.15

  switch (decision) {
    case 'aggressive':
      // High risk, high reward: 65% win if lands, 35% unforced error
      return {
        winProb: baseProb + 0.15,
        description: 'Aggressive + Defensive',
      }
    case 'lob':
      // Safe defensive play: gives opponent time
      return {
        winProb: baseProb - 0.1,
        description: 'Lob + Approach attempt',
      }
    case 'dropshot':
      // Risky redirection: works if opponent is far back
      return {
        winProb: baseProb + 0.1,
        description: 'Dropshot + Tournament',
      }
    case 'neutral':
    default:
      // Standard rally shot
      return {
        winProb: baseProb,
        description: isServerAttacking ? 'Rally shot + Return' : 'Return + Rally shot',
      }
  }
}

// ─── Single Point Simulator ──────────────────────────────────────────────────

export function simulatePoint(
  server: PlayerStrategy,
  returner: PlayerStrategy,
  payoffs: ServePayoffMatrix,
  isBreakPoint: boolean
): { outcome: PointOutcome; events: PointEvent[]; serveZone: Zone; returnerRead: Zone; rallyLength: number } {
  const events: PointEvent[] = []

  // 1. Serve selection — server mixes based on strategy
  const pressureMod = isBreakPoint ? 0.1 : 0 // slight tendency to go safe under pressure
  const serveMix = { ...server.serveMix }
  serveMix.body = clamp(serveMix.body + pressureMod)
  const total = serveMix.wide + serveMix.body + serveMix.T
  serveMix.wide /= total
  serveMix.body /= total
  serveMix.T /= total

  const serveZone = weightedSample(serveMix)

  // 2. Returner read — based on bias and opponent history
  const neutralRead: Record<Zone, number> = { wide: 0.333, body: 0.333, T: 0.334 }
  const committedRead: Record<Zone, number> = { ...server.serveMix }
  const bias = clamp(returner.returnBias)
  const returnerReadMix: Record<Zone, number> = {
    wide: neutralRead.wide * (1 - bias) + committedRead.wide * bias,
    body: neutralRead.body * (1 - bias) + committedRead.body * bias,
    T: neutralRead.T * (1 - bias) + committedRead.T * bias,
  }
  const returnerRead = weightedSample(returnerReadMix)

  // 3. Serve outcome
  const serveWinPct = (payoffs[serveZone]?.[returnerRead] ?? 60) / 100
  let serverWins = Math.random() < serveWinPct

  events.push({
    stage: 'serve',
    serverAction: `Serve ${serveZone}`,
    returnerAction: `Read ${returnerRead}`,
    rally: 1,
    outcome: serverWins ? 'server_win' : 'returner_win',
    winProbability: serveWinPct,
  })

  // 4. If point goes to rally
  let rallyLength = 1
  if (!serverWins && Math.random() > 0.35) {
    // Point continues into rally
    let serverWinProb = 0.52 + (server.rallyAggression - returner.rallyAggression) * 0.15

    // Net approach opportunity
    if (Math.random() < server.netApproachFreq) {
      const approachWin = Math.random() < 0.65
      serverWins = approachWin
      rallyLength = 3
      events.push({
        stage: 'approach',
        serverAction: 'Approach volley',
        returnerAction: 'Pass/lob',
        rally: 2,
        outcome: approachWin ? 'server_win' : 'returner_win',
        winProbability: 0.65,
      })
    } else {
      // Baseline rally with tactical decisions
      const rallies = Math.floor(Math.random() * 5) + 3 // longer rallies possible
      for (let r = 2; r <= rallies; r++) {
        const isServerAttacking = r % 2 === 0
        const aggressor = isServerAttacking ? server : returner
        const defender = isServerAttacking ? returner : server

        // Determine if court is open (opponent is out of position)
        const isOpen = Math.random() < 0.3 + Math.abs(aggressor.rallyAggression - 0.5) * 0.2

        // Choose tactical approach
        const tacticalDecision = chooseTacticalShot({
          rally: r,
          isOpen,
          aggressor,
          defender,
          isServerAttacking,
        })

        // Calculate win probability based on tactic
        const { winProb, description } = getTacticalShotOutcome(
          tacticalDecision,
          aggressor,
          defender,
          isServerAttacking
        )

        const aggWin = Math.random() < winProb

        events.push({
          stage: 'rally',
          serverAction: isServerAttacking
            ? `${tacticalDecision === 'aggressive' ? 'Aggressive' : tacticalDecision === 'lob' ? 'Lob' : 'Shot'}`
            : 'Return',
          returnerAction: isServerAttacking
            ? 'Return'
            : `${tacticalDecision === 'aggressive' ? 'Aggressive' : tacticalDecision === 'lob' ? 'Lob' : 'Shot'}`,
          rally: r,
          outcome: aggWin ? 'server_win' : 'returner_win',
          winProbability: winProb,
          tacticalDecision,
        })

        if (aggWin) {
          serverWins = isServerAttacking
          rallyLength = r
          break
        }
      }
    }
  }

  return {
    outcome: serverWins ? 'server_win' : 'returner_win',
    events,
    serveZone,
    returnerRead,
    rallyLength,
  }
}

// ─── Score Logic ─────────────────────────────────────────────────────────────

const POINT_NAMES = ['0', '15', '30', '40', 'Ad']

export function advanceScore(
  score: MatchScore,
  outcome: PointOutcome,
  totalSets: number
): { score: MatchScore; gameOver: boolean; setOver: boolean; matchOver: boolean; winner?: 0 | 1 } {
  const s = JSON.parse(JSON.stringify(score)) as MatchScore
  // Winner depends on outcome AND who is currently serving
  const winner = outcome === 'server_win' ? score.server : (score.server === 0 ? 1 : 0)

  let gameOver = false
  let setOver = false
  let matchOver = false
  let matchWinner: 0 | 1 | undefined

  s.points[winner]++

  // Deuce / advantage logic
  const [p0, p1] = s.points
  if (p0 >= 3 && p1 >= 3) {
    if (p0 === p1 + 1) {
      gameOver = true
      s.games[0]++
    } else if (p1 === p0 + 1) {
      gameOver = true
      s.games[1]++
    }
  } else if (p0 >= 4 || p1 >= 4) {
    if (p0 >= 4 && p0 > p1) {
      gameOver = true
      s.games[0]++
    } else if (p1 >= 4 && p1 > p0) {
      gameOver = true
      s.games[1]++
    }
  }

  if (gameOver) {
    const [g0, g1] = s.games
    s.points = [0, 0]

    // Check for set win (first to 6, or 7 with 2-game lead, or tiebreak)
    if (g0 >= 6 || g1 >= 6) {
      if ((g0 >= 6 && g0 - g1 >= 2) || (g1 >= 6 && g1 - g0 >= 2)) {
        setOver = true
        s.sets.push([g0, g1])
        s.games = [0, 0]
      } else if (g0 === 6 && g1 === 6) {
        // Tiebreak
        const tb = Math.random() < 0.5 ? 0 : 1
        setOver = true
        s.sets.push(tb === 0 ? [7, 6] : [6, 7])
        s.games = [0, 0]
      }
    }

    if (setOver) {
      const setsWon = [s.sets.filter((set) => set[0] > set[1]).length, s.sets.filter((set) => set[1] > set[0]).length]
      const setsNeeded = Math.ceil(totalSets / 2)

      if (setsWon[0] >= setsNeeded) {
        matchOver = true
        matchWinner = 0
      } else if (setsWon[1] >= setsNeeded) {
        matchOver = true
        matchWinner = 1
      }
    }

    // Rotate server
    s.server = s.server === 0 ? 1 : 0
  }

  return { score: s, gameOver, setOver, matchOver, winner: matchWinner }
}

// ─── Full Match Simulator ────────────────────────────────────────────────────

export function simulateMatch(config: SimulationConfig): MatchResult {
  const { playerA, playerB, sets, servePayoffs } = config
  const nash = solveNash(servePayoffs)

  let score: MatchScore = { sets: [], games: [0, 0], points: [0, 0], server: 0 }
  const points: MatchPoint[] = []
  let matchOver = false
  let winner: 0 | 1 = 0
  let pointId = 0

  const zoneCounts = { wide: 0, body: 0, T: 0 }
  let totalServerWins = [0, 0]
  let totalPoints = [0, 0]
  let rallyTotal = 0
  let breakPoints = 0
  let bpConverted = 0

  while (!matchOver) {
    const server = score.server === 0 ? playerA : playerB
    const returner = score.server === 0 ? playerB : playerA

    const [g0, g1] = score.games
    const [p0, p1] = score.points
    const isBreakPoint =
      score.server === 0 ? p1 >= 3 && p1 > p0 : p0 >= 3 && p0 > p1

    if (isBreakPoint) breakPoints++

    const result = simulatePoint(server, returner, servePayoffs, isBreakPoint)

    zoneCounts[result.serveZone]++
    rallyTotal += result.rallyLength
    totalPoints[score.server]++
    if (result.outcome === 'server_win') totalServerWins[score.server]++
    if (isBreakPoint && result.outcome === 'returner_win') bpConverted++

    const courtSide: 'deuce' | 'ad' = (p0 + p1) % 2 === 0 ? 'deuce' : 'ad'

    points.push({
      id: pointId++,
      courtSide,
      isBreakPoint,
      isSetPoint: false,
      events: result.events,
      outcome: result.outcome,
      rallyLength: result.rallyLength,
      serveZone: result.serveZone,
      returnerRead: result.returnerRead,
      serverId: score.server as 0 | 1,
    })

    const advanced = advanceScore(score, result.outcome, sets)
    score = advanced.score

    if (advanced.matchOver && advanced.winner !== undefined) {
      matchOver = true
      winner = advanced.winner
    }

    if (pointId > 1000) break
  }

  // Nash deviation
  const tp = zoneCounts.wide + zoneCounts.body + zoneCounts.T || 1
  const actualMix = {
    wide: zoneCounts.wide / tp,
    body: zoneCounts.body / tp,
    T: zoneCounts.T / tp,
  }
  const nashDeviation = Math.sqrt(
    Math.pow(actualMix.wide - nash.serverMix.wide, 2) +
    Math.pow(actualMix.body - nash.serverMix.body, 2) +
    Math.pow(actualMix.T - nash.serverMix.T, 2)
  )

  return {
    points,
    finalScore: score,
    winner,
    stats: {
      totalPoints: pointId,
      serverWinPct: [
        totalPoints[0] ? Math.round((totalServerWins[0] / totalPoints[0]) * 100) : 0,
        totalPoints[1] ? Math.round((totalServerWins[1] / totalPoints[1]) * 100) : 0,
      ],
      avgRallyLength: Math.round((rallyTotal / pointId) * 10) / 10,
      aces: Math.floor(pointId * 0.05),
      breakPoints,
      breakPointsConverted: bpConverted,
      zoneFrequency: actualMix,
      nashDeviation: Math.round(nashDeviation * 100),
    },
  }
}

export { POINT_NAMES, type MatchPoint, type MatchResult }
