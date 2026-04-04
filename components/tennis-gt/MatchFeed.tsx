'use client'
import type { MatchPoint, MatchResult, PlayerStrategy } from '@/types'
import { ZONE_COLORS, ZONE_LABELS } from '@/lib/defaults'
import { translations, type Language } from './translations'
import CourtVisualization from './CourtVisualization'
import LiveOpponentRead from './LiveOpponentRead'

interface Props {
  result: MatchResult | null
  playerAName: string
  playerBName: string
  language: Language
  playerA?: PlayerStrategy
  playerB?: PlayerStrategy
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}

function ZoneDonut({ freq }: { freq: { wide: number; body: number; T: number } }) {
  const zones = ['wide', 'body', 'T'] as const
  let offset = 0
  const radius = 36
  const circ = 2 * Math.PI * radius
  const segments = zones.map((z) => {
    const pct = freq[z]
    const len = pct * circ
    const seg = { zone: z, pct, offset, len }
    offset += len
    return seg
  })

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 100 100" width={90} height={90}>
        <circle cx={50} cy={50} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={14} />
        {segments.map((s) => (
          <circle
            key={s.zone}
            cx={50}
            cy={50}
            r={radius}
            fill="none"
            stroke={ZONE_COLORS[s.zone]}
            strokeWidth={14}
            strokeDasharray={`${s.len} ${circ - s.len}`}
            strokeDashoffset={-s.offset}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        ))}
      </svg>
      <div className="donut-legend">
        {zones.map((z) => (
          <div key={z} className="donut-item">
            <div className="donut-dot" style={{ background: ZONE_COLORS[z] }} />
            <span>{ZONE_LABELS[z]} {Math.round(freq[z] * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PointTimelineGraph({
  points,
  playerAName,
  playerBName,
  language,
}: {
  points: MatchPoint[]
  playerAName: string
  playerBName: string
  language: Language
}) {
  const t = translations[language]
  const maxShots = Math.max(1, ...points.map((p) => p.rallyLength))

  return (
    <div className="points-timeline-wrap">
      <div className="timeline-legend-row">
        <div className="timeline-legend-item">
          <span className="timeline-winner-dot" style={{ background: '#3b82f6' }} />
          <span>{playerAName}</span>
        </div>
        <div className="timeline-legend-item">
          <span className="timeline-winner-dot" style={{ background: '#ef4444' }} />
          <span>{playerBName}</span>
        </div>
        <div className="timeline-note">{t.timelineHint}</div>
      </div>

      <div className="points-timeline" role="img" aria-label={t.lastPoints}>
        {points.map((point, idx) => {
          const winnerId = point.outcome === 'server_win' ? point.serverId : point.serverId === 0 ? 1 : 0
          const winnerColor = winnerId === 0 ? '#3b82f6' : '#ef4444'
          const height = Math.max(10, Math.round((point.rallyLength / maxShots) * 58) + 10)

          return (
            <div key={point.id} className="timeline-col">
              <div
                className="timeline-bar"
                style={{
                  height: `${height}px`,
                  background: `linear-gradient(180deg, ${winnerColor}, ${winnerColor}cc)`,
                  borderTop: point.isBreakPoint ? '2px solid #f59e0b' : '2px solid transparent',
                }}
                title={`#${idx + 1} · ${winnerId === 0 ? playerAName : playerBName} · ${point.rallyLength} ${t.shots} · ${ZONE_LABELS[point.serveZone]}${point.isBreakPoint ? ' · BP' : ''}`}
              >
                <span
                  className="timeline-zone-tag"
                  style={{ background: ZONE_COLORS[point.serveZone] }}
                  aria-hidden
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="timeline-axis-row">
        <span>1</span>
        <span>{points.length}</span>
      </div>
    </div>
  )
}

export default function MatchFeed({ result, playerAName, playerBName, language, playerA, playerB }: Props) {
  const t = translations[language]
  
  if (!result) {
    return (
      <div className="feed-empty">
        <div className="feed-empty-icon">◎</div>
        <div className="feed-empty-text">{t.configStrategies}</div>
      </div>
    )
  }

  const { stats, points, winner, finalScore } = result
  const recentPoints = points.slice(-30)

  const setsDisplay = finalScore.sets
    .map((s) => `${s[0]}–${s[1]}`)
    .join('  ')

  return (
    <div className="match-feed">
      {/* Score header */}
      <div className="score-header">
        <div className="score-player" style={{ opacity: winner === 0 ? 1 : 0.45 }}>
          <span className="score-name">{playerAName}</span>
          {winner === 0 && <span className="winner-crown">★</span>}
        </div>
        <div className="score-sets">{setsDisplay}</div>
        <div className="score-player" style={{ opacity: winner === 1 ? 1 : 0.45 }}>
          <span className="score-name">{playerBName}</span>
          {winner === 1 && <span className="winner-crown">★</span>}
        </div>
      </div>

      {/* Stats and zone section - compact */}
      <div className="match-info-row">
        <div className="stats-grid-compact">
          <StatCard label={t.totalPoints} value={stats.totalPoints} />
          <StatCard
            label={t.serveWinPct}
            value={`${stats.serverWinPct[0]}% / ${stats.serverWinPct[1]}%`}
            sub={t.aSlashB}
          />
          <StatCard label={t.avgRally} value={`${stats.avgShotsPerPoint}`} sub={t.shotsPer} />
          <StatCard
            label={t.breakPoints}
            value={`${stats.breakPointsConverted}/${stats.breakPoints}`}
            sub={t.converted}
          />
        </div>

        <div className="zone-section-compact">
          <div className="section-label">{t.serveZoneDist}</div>
          <ZoneDonut freq={stats.zoneFrequency} />
        </div>

        <div className="nash-deviation-compact">
          <span className="deviation-label">{t.nashDeviation}</span>
          <span
            className="deviation-value"
            style={{
              color: stats.nashDeviation < 10 ? '#4ade80' : stats.nashDeviation < 25 ? '#facc15' : '#f87171',
            }}
          >
            {stats.nashDeviation}
          </span>
        </div>
      </div>

      {/* Tennis court visualization - MAIN FOCUS */}
      <CourtVisualization points={points} language={language} />

      {/* Live Opponent Read - show real patterns during match */}
      {(playerA || playerB) && points.length > 5 && (
        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {playerA && (
            <LiveOpponentRead
              points={points}
              configuredStrategy={playerA}
              isOpponent={false}
              language={language}
            />
          )}
          {playerB && (
            <LiveOpponentRead
              points={points}
              configuredStrategy={playerB}
              isOpponent={true}
              language={language}
            />
          )}
        </div>
      )}

      {/* Point feed */}
      <div className="section-label" style={{ marginTop: '1.5rem', paddingLeft: '2rem' }}>
        {t.lastPoints}
      </div>
      <PointTimelineGraph points={recentPoints} playerAName={playerAName} playerBName={playerBName} language={language} />
    </div>
  )
}
