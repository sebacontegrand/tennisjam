'use client'

import type { ServePayoffMatrix } from '@/types'
import { translations, type Language } from './translations'

interface Props {
  payoffs: ServePayoffMatrix
  onChange: (p: ServePayoffMatrix) => void
  language: Language
}

const ZONES = ['wide', 'body', 'T'] as const

function heatColor(value: number): string {
  // 50% = neutral gray, 80% = hot green, 30% = cool red
  const norm = (value - 50) / 30 // -1 to +1
  if (norm > 0) {
    const g = Math.round(74 + norm * 100)
    const r = Math.round(74 - norm * 60)
    const b = Math.round(74 - norm * 60)
    return `rgba(${r},${g},${r}, 0.25)`
  } else {
    const intensity = Math.abs(norm)
    return `rgba(239, 68, 68, ${intensity * 0.3})`
  }
}

export default function PayoffMatrix({ payoffs, onChange, language }: Props) {
  const t = translations[language]
  
  // Dynamically create zone display labels from translations
  const ZONE_DISPLAY = {
    wide: t.zoneWide,
    body: t.zoneBody,
    T: t.zoneT,
  }
  
  function update(serve: string, read: string, val: number) {
    onChange({
      ...payoffs,
      [serve]: { ...payoffs[serve], [read]: val },
    })
  }

  return (
    <div className="payoff-matrix">
      <div className="matrix-intro">
        <p className="matrix-desc">
          {t.payoffDesc}
        </p>
      </div>

      <div className="matrix-table-wrap">
        <table className="matrix-table">
          <thead>
            <tr>
              <th className="matrix-corner">
                <span className="axis-label-serve">Serve →</span>
                <span className="axis-label-read">↓ Read</span>
              </th>
              {ZONES.map((z) => (
                <th key={z} className="matrix-col-header">
                  {ZONE_DISPLAY[z]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ZONES.map((serve) => (
              <tr key={serve}>
                <td className="matrix-row-header">{ZONE_DISPLAY[serve]}</td>
                {ZONES.map((read) => {
                  const val = payoffs[serve]?.[read] ?? 60
                  return (
                    <td
                      key={read}
                      className="matrix-cell"
                      style={{ background: heatColor(val) }}
                    >
                      <div className="cell-content">
                        <input
                          type="number"
                          min={30}
                          max={90}
                          value={val}
                          onChange={(e) =>
                            update(serve, read, Math.max(30, Math.min(90, Number(e.target.value))))
                          }
                          className="cell-input"
                        />
                        <span className="cell-pct">%</span>
                      </div>
                      <input
                        type="range"
                        min={30}
                        max={90}
                        step={1}
                        value={val}
                        onChange={(e) => update(serve, read, Number(e.target.value))}
                        className="cell-slider"
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="matrix-legend">
        <div className="legend-item">
          <div className="legend-swatch" style={{ background: 'rgba(74,222,128,0.3)' }} />
          <span>{t.serverAdvantage}</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ background: 'rgba(156,163,175,0.2)' }} />
          <span>{t.neutral}</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ background: 'rgba(239,68,68,0.25)' }} />
          <span>{t.returnerAdvantage}</span>
        </div>
      </div>
    </div>
  )
}
