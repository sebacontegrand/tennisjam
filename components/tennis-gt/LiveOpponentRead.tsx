'use client'

import type { MatchPoint, PlayerStrategy } from '@/types'
import { ZONE_COLORS } from '@/lib/defaults'
import { translations, type Language } from './translations'

interface Props {
  points: MatchPoint[]
  configuredStrategy: PlayerStrategy
  isOpponent: boolean // true for analyzing opponent (Player B), false for analyzing own player (Player A)
  language: Language
}

export default function LiveOpponentRead({ points, configuredStrategy, isOpponent, language }: Props) {
  const t = translations[language]

  if (points.length === 0) {
    return (
      <div style={{
        background: 'var(--bg-dark)',
        border: '1px solid var(--border)',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
      }}>
        {language === 'en' ? 'Match starting...' : 'Iniciando partido...'}
      </div>
    )
  }

  // Analyze last 10-15 points for real playing patterns
  const recentPoints = points.slice(-15)
  
  // Calculate real serve distribution from recent points
  // We need to figure out from match context which player is serving
  // Since we're analyzing, we can determine server from match progression
  const realServeCount = { wide: 0, body: 0, T: 0 }
  
  recentPoints.forEach((p, idx) => {
    // Determine if this is the player we're analyzing
    // In tennis, players alternate serves. We can track based on game progression
    // For now, count serves from all points where this player would be serving
    const pointIndex = points.indexOf(p)
    const isPlayerServing = pointIndex % 2 === (isOpponent ? 1 : 0)
    
    if (isPlayerServing) {
      realServeCount[p.serveZone]++
    }
  })

  const pointsServed = Object.values(realServeCount).reduce((a, b) => a + b, 0)
  const realServeDistribution = pointsServed > 0 ? {
    wide: realServeCount.wide / pointsServed,
    body: realServeCount.body / pointsServed,
    T: realServeCount.T / pointsServed,
  } : configuredStrategy.serveMix

  // Calculate average rally length
  let rallyLengthSum = 0
  let rallyPointsCount = 0

  recentPoints.forEach((p, idx) => {
    const pointIndex = points.indexOf(p)
    const isPlayerServing = pointIndex % 2 === (isOpponent ? 1 : 0)
    
    if (isPlayerServing) {
      rallyLengthSum += p.rallyLength
      rallyPointsCount++
    }
  })

  const realRallyLength = rallyPointsCount > 0 ? rallyLengthSum / rallyPointsCount : 0
  const normalizedRallyLength = Math.min(realRallyLength / 7, 1) // normalize to 0-1

  // Deviations
  const serveDeviation = {
    wide: Math.abs(realServeDistribution.wide - configuredStrategy.serveMix.wide),
    body: Math.abs(realServeDistribution.body - configuredStrategy.serveMix.body),
    T: Math.abs(realServeDistribution.T - configuredStrategy.serveMix.T),
  }
  const maxServeDeviation = Math.max(serveDeviation.wide, serveDeviation.body, serveDeviation.T)

  const isPlayingDifferently = maxServeDeviation > 0.15

  return (
    <div style={{
      background: 'var(--bg-dark)',
      border: '1px solid var(--border)',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    }}>
      <div>
        <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--accent)' }}>
          📊 {language === 'en' ? 'Live Read' : 'Lectura en Vivo'}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {language === 'en' ? `Based on last ${recentPoints.length} points` : `Basado en últimos ${recentPoints.length} puntos`}
        </div>
      </div>

      {/* Deviation Alert */}
      {isPlayingDifferently && (
        <div style={{
          background: 'rgba(250, 204, 21, 0.1)',
          border: '1px solid rgba(250, 204, 21, 0.3)',
          borderRadius: '0.375rem',
          padding: '0.75rem',
          color: 'var(--warning)',
          fontSize: '0.9rem',
          fontWeight: '500',
        }}>
          ⚠️ {language === 'en' ? 'Playing differently than configured!' : '¡Jugando diferente a lo configurado!'}
        </div>
      )}

      {/* Serve Pattern - Real vs Configured */}
      <div>
        <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text)' }}>
          {language === 'en' ? 'Serve Pattern (Real)' : 'Patrón de Saques (Real)'}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', height: '40px', marginBottom: '1rem' }}>
          {(['wide', 'body', 'T'] as const).map((z) => (
            <div
              key={z}
              style={{
                flex: realServeDistribution[z],
                background: ZONE_COLORS[z],
                borderRadius: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#000',
                opacity: 0.9,
              }}
            >
              {Math.round(realServeDistribution[z] * 100)}%
            </div>
          ))}
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          {language === 'en' ? 'Configured vs Real' : 'Configurado vs Real'}
        </div>
        
        {(['wide', 'body', 'T'] as const).map((z) => {
          const configured = Math.round(configuredStrategy.serveMix[z] * 100)
          const real = Math.round(realServeDistribution[z] * 100)
          const diff = real - configured
          const diffColor = diff > 0 ? 'var(--warning)' : diff < 0 ? 'var(--error)' : 'var(--text-muted)'
          const zoneLabel = z === 'wide' ? (language === 'es' ? 'Lateral' : 'Wide') : z === 'body' ? (language === 'es' ? 'Cuerpo' : 'Body') : (language === 'es' ? 'Centro' : 'T')
          
          return (
            <div key={z} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              <span>{zoneLabel}</span>
              <span>
                {real}% {' '}
                <span style={{ color: diffColor, fontWeight: '600' }}>
                  {diff > 0 ? '+' : ''}{diff}%
                </span>
              </span>
            </div>
          )
        })}
      </div>

      {/* Rally Length */}
      <div>
        <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text)' }}>
          {language === 'en' ? 'Avg Rally Length' : 'Rally Promedio'}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${normalizedRallyLength * 100}%`,
                  background: 'var(--accent)',
                }}
              />
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--accent)', minWidth: '40px' }}>
            {Math.round(realRallyLength)} shots
          </div>
        </div>
      </div>

      {/* Rally Length */}
      <div>
        <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text)' }}>
          {language === 'en' ? 'Avg Rally Length' : 'Rally Promedio'}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${normalizedRallyLength * 100}%`,
                  background: 'var(--accent)',
                }}
              />
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--accent)', minWidth: '40px' }}>
            {Math.round(realRallyLength)} shots
          </div>
        </div>
      </div>

      {/* Trend Summary */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '0.375rem',
        padding: '0.75rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
      }}>
        {getTrendSummary(realServeDistribution, configuredStrategy.serveMix, language)}
      </div>
    </div>
  )
}

function getTrendSummary(real: Record<string, number>, configured: Record<string, number>, language: string): string {
  const wideReal = real.wide
  const wideCfg = configured.wide
  
  const wideDiff = wideReal - wideCfg
  
  if (Math.abs(wideDiff) < 0.1) {
    return language === 'en' 
      ? '➡️ Playing according to configured strategy' 
      : '➡️ Jugando según la estrategia configurada'
  } else if (wideDiff > 0.1) {
    return language === 'en'
      ? '🔄 Serving wider than configured - consider staying closer'
      : '🔄 Sacando más lateral de lo configurado - considera quedarte más cerca'
  } else {
    return language === 'en'
      ? '🎯 Serving more to body/center than configured - prepared to cover inside'
      : '🎯 Sacando más al cuerpo/centro de lo configurado - preparado para cubrir adentro'
  }
}
