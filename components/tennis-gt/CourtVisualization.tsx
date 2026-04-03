'use client'

import { useState, useEffect } from 'react'
import type { MatchPoint } from '@/types'
import { ZONE_COLORS, ZONE_LABELS } from '@/lib/defaults'
import { translations, type Language } from './translations'

interface Props {
  points: MatchPoint[]
  language: Language
}

export default function TennisCourtVisualization({ points, language }: Props) {
  const t = translations[language]
  const [animatedBalls, setAnimatedBalls] = useState<number[]>([])
  
  // Take last 30 points
  const recentPoints = points.slice(-30)

  // Group points by serve zone for visualization
  const pointsByZone = {
    wide: recentPoints.filter((p) => p.serveZone === 'wide'),
    body: recentPoints.filter((p) => p.serveZone === 'body'),
    T: recentPoints.filter((p) => p.serveZone === 'T'),
  }

  // Calculate win rate by zone
  const zoneStats = {
    wide: {
      wins: pointsByZone.wide.filter((p) => p.outcome === 'server_win').length,
      total: pointsByZone.wide.length,
    },
    body: {
      wins: pointsByZone.body.filter((p) => p.outcome === 'server_win').length,
      total: pointsByZone.body.length,
    },
    T: {
      wins: pointsByZone.T.filter((p) => p.outcome === 'server_win').length,
      total: pointsByZone.T.length,
    },
  }

  // Animate balls one by one
  useEffect(() => {
    recentPoints.forEach((_, idx) => {
      setTimeout(() => {
        setAnimatedBalls((prev) => [...prev, idx])
      }, idx * 300)
    })
  }, [recentPoints.length])

  // Get coordinates for serve zone based on singles tennis rules
  // In singles, court is 27 feet wide (excluding alleys - doubles feature)
  // Serves must land in service box diagonally opposite the server
  // Server alternates: Ad box (left) -> Deuce box (right) -> Ad box -> Deuce box...
  // - Ad Court box (left diagonal): x ~20-115, y ~25-75
  // - Deuce Court box (right diagonal): x ~145-240, y ~25-75
  const getZoneCoords = (zone: string, index: number) => {
    // Alternate between diagonal service boxes - SINGLES RULE
    // Odd serves go to Ad box, even serves go to Deuce box
    const isAdBox = index % 2 === 0 // 1st serve to Ad, 2nd to Deuce, 3rd to Ad...
    
    let xStart = 0
    let xEnd = 0
    
    if (isAdBox) {
      // Ad Court service box (left diagonal from server)
      xStart = 20
      xEnd = 115
    } else {
      // Deuce Court service box (right diagonal from server)
      xStart = 145
      xEnd = 240
    }
    
    // Distribute balls within the service box
    const positionInBox = ((index % 5) / 5)
    const x = xStart + positionInBox * (xEnd - xStart) + (Math.random() - 0.5) * 8
    
    // Y coordinates for service box (top of court)
    const yBase = 50
    const yVariation = (Math.sin(index * 0.4) - 0.3) * 12
    
    return { x, y: yBase + yVariation }
  }

  return (
    <div className="court-visualization">
      <div className="court-title">{t.serveSequence}</div>
      
      <div className="court-container" style={{ position: 'relative' }}>
        {/* Tennis court dimensions image */}
        <img 
          src="/tennisim.png"
          alt="Tennis Court Dimensions"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '0.375rem',
            display: 'block',
          }}
        />
        
        {/* SVG overlay for serve animations */}
        <svg 
          viewBox="0 0 260 180" 
          className="tennis-court"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >

          {/* Animated balls */}
          {recentPoints.map((point, idx) => {
            const isAnimated = animatedBalls.includes(idx)
            const coords = getZoneCoords(point.serveZone, idx)
            const isWon = point.outcome === 'server_win'
            const ballColor = isWon ? ZONE_COLORS[point.serveZone] : '#ef4444'
            
            return (
              <g key={point.id}>
                {isAnimated && (
                  <>
                    {/* Animated ball with bounce effect */}
                    <g className="ball-group">
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r="3"
                        fill={ballColor}
                        opacity="1"
                        className="ball-animate"
                        style={{
                          animation: `ballBounce 0.6s ease-out forwards`,
                        }}
                      />
                      {/* Bounce ripple */}
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r="3"
                        fill="none"
                        stroke={ballColor}
                        strokeWidth="0.8"
                        opacity="0.6"
                        className="bounce-ring"
                        style={{
                          animation: `bounceRing 0.6s ease-out forwards`,
                        }}
                      />
                    </g>
                    {/* Point number label */}
                    <text 
                      x={coords.x + 8} 
                      y={coords.y + 3} 
                      fontSize="7" 
                      fill={isWon ? '#4ade80' : '#ef4444'} 
                      fontWeight="bold"
                      opacity="0.9"
                    >
                      {idx + 1}
                    </text>
                  </>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Zone statistics */}
      <div className="zone-stats">
        <div className="stats-label">{t.winRateByZone}</div>
        <div className="stats-grid">
          {(['wide', 'body', 'T'] as const).map((zone) => (
            <div key={zone} className="zone-stat-card" style={{ borderColor: ZONE_COLORS[zone] }}>
              <div className="zone-stat-dot" style={{ background: ZONE_COLORS[zone] }} />
              <div className="zone-stat-label">{ZONE_LABELS[zone]}</div>
              <div className="zone-stat-value">
                {zoneStats[zone].wins}/{zoneStats[zone].total}
              </div>
              <div className="zone-stat-pct">
                {zoneStats[zone].total > 0
                  ? `${Math.round((zoneStats[zone].wins / zoneStats[zone].total) * 100)}%`
                  : '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ballBounce {
          0% {
            transform: translateY(-25px) scale(0.3);
            opacity: 0;
          }
          50% {
            transform: translateY(0) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes bounceRing {
          0% {
            r: 3;
            opacity: 1;
          }
          100% {
            r: 10;
            opacity: 0;
          }
        }

        .court-visualization {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: 100%;
          flex: 1;
        }

        .court-title {
          font-weight: 600;
          font-size: 1rem;
          color: var(--text);
          padding: 1rem 2rem 0.5rem 2rem;
        }

        .court-container {
          background: linear-gradient(135deg, #1e3a1f 0%, #2f4a31 100%);
          border: 1px solid rgba(74, 222, 128, 0.3);
          border-radius: 0.5rem;
          padding: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: auto;
          flex: 1;
          min-height: 0;
          margin: 0 2rem;
          position: relative;
          width: 100%;
        }

        .court-container img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          display: block;
          z-index: 1;
        }

        .tennis-court {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        .ball-animate {
          filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.4));
        }

        .zone-stats {
          background: var(--bg-dark);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 0 2rem 2rem 2rem;
        }

        .stats-label {
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 0.75rem;
          color: var(--text-muted);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .zone-stat-card {
          background: var(--bg-darker);
          border: 2px solid;
          border-radius: 0.375rem;
          padding: 0.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }

        .zone-stat-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          opacity: 0.8;
        }

        .zone-stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .zone-stat-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
        }

        .zone-stat-pct {
          font-size: 0.75rem;
          color: var(--accent);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .court-container {
            padding: 1rem;
            margin: 0 1rem;
          }

          .court-title {
            padding: 1rem 1rem 0.5rem 1rem;
            font-size: 0.9rem;
          }

          .zone-stats {
            margin: 0 1rem 1rem 1rem;
          }

          .tennis-court {
            min-width: 400px;
            min-height: 250px;
          }

          .zone-stat-value {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  )
}
