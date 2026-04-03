'use client'

import type { PlayerStrategy } from '@/types'
import { ZONE_COLORS } from '@/lib/defaults'
import { translations, type Language } from './translations'

interface Props {
  player: PlayerStrategy
  language: Language
}

export default function OpponentAnalysis({ player, language }: Props) {
  const t = translations[language]

  // Analyze strengths and weaknesses
  const servePattern = Object.entries(player.serveMix)
    .map(([zone, value]) => ({ zone, value }))
    .sort((a, b) => b.value - a.value)

  const isAggressive = player.rallyAggression > 0.6
  const isDefensive = player.rallyAggression < 0.4
  const frequentNetPlayer = player.netApproachFreq > 0.65
  const baselinePlayer = player.netApproachFreq < 0.35
  const prefersShortRallies = player.rallyLength < 0.4
  const prefersLongRallies = player.rallyLength > 0.65
  const highAdaptation = player.adaptationRate > 0.65

  const strengths: string[] = []
  const weaknesses: string[] = []

  // Strengths
  if (isAggressive) strengths.push(t.veryAggressive)
  if (frequentNetPlayer) strengths.push(t.rushesNet)
  if (prefersShortRallies) strengths.push(t.preferShortRallies)
  if (highAdaptation) strengths.push('Reads and adapts quickly')

  // Weaknesses
  if (isDefensive) weaknesses.push(t.conservative)
  if (baselinePlayer) weaknesses.push(t.playsSlow)
  if (prefersLongRallies) weaknesses.push(t.preferLongRallies)
  if (player.returnBias < 0.3) weaknesses.push('Will break easily under pressure on return')
  if (player.tacticAggression < 0.3) weaknesses.push('Becomes passive in long rallies')

  return (
    <div style={{
      background: 'var(--bg-dark)',
      border: '1px solid var(--border)',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    }}>
      <div>
        <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--accent)' }}>
          {t.opponentAnalysis}
        </div>
      </div>

      {/* Serve Pattern */}
      <div>
        <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text)' }}>
          {t.opponentServePattern}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', height: '40px' }}>
          {(['wide', 'body', 'T'] as const).map((z) => (
            <div
              key={z}
              style={{
                flex: player.serveMix[z],
                background: ZONE_COLORS[z],
                borderRadius: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#000',
                opacity: 0.9,
              }}
            >
              {Math.round(player.serveMix[z] * 100)}%
            </div>
          ))}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          {t.servesMostly} <strong>{language === 'es' ? 
            (servePattern[0].zone === 'wide' ? 'Lateral' : servePattern[0].zone === 'body' ? 'Cuerpo' : 'Centro') :
            (servePattern[0].zone === 'wide' ? 'Wide' : servePattern[0].zone === 'body' ? 'Body' : 'T')
          }</strong>
        </div>
      </div>

      {/* Tactical Profile */}
      <div>
        <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text)' }}>
          {t.opponentTactics}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <TacticRow
            label={language === 'es' ? 'Agresión' : 'Aggression'}
            value={player.rallyAggression}
          />
          <TacticRow
            label={language === 'es' ? 'Aproximación a la Red' : 'Net Approach'}
            value={player.netApproachFreq}
          />
          <TacticRow
            label={language === 'es' ? 'Largos Rallies' : 'Rally Length'}
            value={player.rallyLength}
          />
          <TacticRow
            label={language === 'es' ? 'Adaptación' : 'Adaptation'}
            value={player.adaptationRate}
          />
        </div>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--success)' }}>
            💪 {t.strengths}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {strengths.map((s, i) => (
              <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                • {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {weaknesses.length > 0 && (
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--warning)' }}>
            🎯 {t.weaknesses}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {weaknesses.map((w, i) => (
              <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                • {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function TacticRow({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', flex: 1 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
        <div
          style={{
            flex: 1,
            height: '6px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: 'var(--accent)',
              transition: 'width 0.2s',
            }}
          />
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent)', minWidth: '30px' }}>
          {pct}%
        </span>
      </div>
    </div>
  )
}
