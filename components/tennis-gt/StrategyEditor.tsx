'use client'

import { useState } from 'react'
import type { PlayerStrategy } from '@/types'
import { PLAYER_PRESETS, ZONE_COLORS } from '@/lib/defaults'
import { translations, type Language } from './translations'

interface Props {
  player: PlayerStrategy
  label: string
  color: string
  onChange: (p: PlayerStrategy) => void
  language: Language
}

function SliderRow({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  format = (v: number) => `${Math.round(v * 100)}%`,
  accent,
  onChange,
}: {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  format?: (v: number) => string
  accent?: string
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="slider-row">
      <div className="slider-meta">
        <span className="slider-label">{label}</span>
        <span className="slider-value" style={{ color: accent ?? 'inherit' }}>
          {format(value)}
        </span>
      </div>
      <div className="slider-track-wrap">
        <div
          className="slider-fill"
          style={{ width: `${pct}%`, background: accent ?? 'var(--accent)' }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-input"
        />
      </div>
    </div>
  )
}

export default function StrategyEditor({ player, label, color, onChange, language }: Props) {
  const t = translations[language]
  const [preset, setPreset] = useState(player.id)

  function applyPreset(id: string) {
    setPreset(id)
    onChange({ ...PLAYER_PRESETS[id] })
  }

  function updateServeMix(zone: 'wide' | 'body' | 'T', raw: number) {
    const mix = { ...player.serveMix, [zone]: raw }
    // Re-normalize the other two proportionally
    const fixed = raw
    const remaining = 1 - fixed
    const others = (['wide', 'body', 'T'] as const).filter((z) => z !== zone)
    const otherSum = others.reduce((a, z) => a + player.serveMix[z], 0)
    if (otherSum > 0) {
      others.forEach((z) => {
        mix[z] = (player.serveMix[z] / otherSum) * remaining
      })
    } else {
      others.forEach((z) => {
        mix[z] = remaining / 2
      })
    }
    onChange({ ...player, serveMix: mix })
    setPreset('custom')
  }

  return (
    <div className="strategy-editor">
      <div className="editor-header">
        <div className="player-badge" style={{ borderColor: color }}>
          <span className="badge-dot" style={{ background: color }} />
          <span className="badge-label">{label}</span>
        </div>
        <select
          value={preset}
          onChange={(e) => applyPreset(e.target.value)}
          className="preset-select"
        >
          {Object.values(PLAYER_PRESETS).map((p) => {
            const presetNameMap: Record<string, string> = {
              baseline_grinder: language === 'es' ? t.baselineGrinder : 'Baseline Grinder',
              big_server: language === 'es' ? t.bigServer : 'Big Server',
              all_court: language === 'es' ? t.allCourt : 'All-Court Player',
              serve_volley: language === 'es' ? t.serveVolley : 'Serve & Volley',
              counter_puncher: language === 'es' ? t.counterPuncher : 'Counter Puncher',
            }
            return (
              <option key={p.id} value={p.id}>
                {presetNameMap[p.id] || p.name}
              </option>
            )
          })}
          {preset === 'custom' && <option value="custom">{language === 'es' ? 'Personalizado' : 'Custom'}</option>}
        </select>
      </div>

      {/* Player Name Input */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
          {language === 'es' ? 'Nombre del Jugador' : 'Player Name'}
        </label>
        <input
          type="text"
          value={player.name}
          onChange={(e) => {
            onChange({ ...player, name: e.target.value })
            setPreset('custom')
          }}
          placeholder={language === 'es' ? 'Tu nombre' : 'Your name'}
          style={{
            width: '100%',
            padding: '0.6rem 0.8rem',
            background: 'var(--bg-darker)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            borderRadius: '0.375rem',
            fontSize: '0.95rem',
            fontWeight: '500',
          }}
        />
      </div>

      <div className="section-title">{t.serveDist}</div>
      <div className="serve-mix-visual">
        {(['wide', 'body', 'T'] as const).map((z) => {
          const zoneNameMap = {
            wide: language === 'es' ? t.zoneWide : 'Wide',
            body: language === 'es' ? t.zoneBody : 'Body',
            T: language === 'es' ? t.zoneT : 'T',
          }
          return (
            <div
              key={z}
              className="mix-bar-segment"
              style={{
                flex: player.serveMix[z],
                background: ZONE_COLORS[z],
                opacity: 0.85,
              }}
            >
              <span className="mix-bar-label">
                {zoneNameMap[z]} {Math.round(player.serveMix[z] * 100)}%
              </span>
            </div>
          )
        })}
      </div>

      {(['wide', 'body', 'T'] as const).map((z) => {
        const zoneLabelMap = {
          wide: language === 'es' ? t.zoneWide : 'Wide',
          body: language === 'es' ? t.zoneBody : 'Body',
          T: language === 'es' ? t.zoneT : 'T',
        }
        return (
          <SliderRow
            key={z}
            label={zoneLabelMap[z]}
            value={player.serveMix[z]}
            accent={ZONE_COLORS[z]}
            onChange={(v) => updateServeMix(z, v)}
          />
        )
      })}

      <div className="divider" />
      <div className="section-title">{t.tactics}</div>

      <SliderRow
        label={t.returnCommitment}
        value={player.returnBias}
        accent={color}
        onChange={(v) => {
          onChange({ ...player, returnBias: v })
          setPreset('custom')
        }}
      />
      <div className="hint-text">{t.returnCommitmentHint}</div>

      <SliderRow
        label={t.rallyAggression}
        value={player.rallyAggression}
        accent={color}
        onChange={(v) => {
          onChange({ ...player, rallyAggression: v })
          setPreset('custom')
        }}
      />
      <div className="hint-text">{t.rallyAggressionHint}</div>

      <SliderRow
        label={t.netApproachFreq}
        value={player.netApproachFreq}
        accent={color}
        onChange={(v) => {
          onChange({ ...player, netApproachFreq: v })
          setPreset('custom')
        }}
      />

      <SliderRow
        label={t.adaptationRate}
        value={player.adaptationRate}
        accent={color}
        onChange={(v) => {
          onChange({ ...player, adaptationRate: v })
          setPreset('custom')
        }}
      />
      <div className="hint-text">{t.adaptationRateHint}</div>

      <SliderRow
        label={t.rallyLength}
        value={player.rallyLength}
        accent={color}
        onChange={(v) => {
          onChange({ ...player, rallyLength: v })
          setPreset('custom')
        }}
      />
      <div className="hint-text">{t.rallyLengthHint}</div>

      <SliderRow
        label={t.openCourtFreq}
        value={player.openCourtFreq}
        accent={color}
        onChange={(v) => {
          onChange({ ...player, openCourtFreq: v })
          setPreset('custom')
        }}
      />
      <div className="hint-text">{t.openCourtFreqHint}</div>

      <SliderRow
        label={t.tacticAggression}
        value={player.tacticAggression}
        accent={color}
        onChange={(v) => {
          onChange({ ...player, tacticAggression: v })
          setPreset('custom')
        }}
      />
      <div className="hint-text">{t.tacticAggressionHint}</div>

      <SliderRow
        label={t.probabilityImpact}
        value={player.probabilityImpact}
        accent={color}
        onChange={(v) => {
          onChange({ ...player, probabilityImpact: v })
          setPreset('custom')
        }}
      />
      <div className="hint-text">{t.probabilityImpactHint}</div>
    </div>
  )
}
