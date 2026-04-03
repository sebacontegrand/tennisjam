'use client'

import { useMemo } from 'react'
import { solveNash } from '@/lib/engine'
import type { ServePayoffMatrix, PlayerStrategy } from '@/types'
import { ZONE_COLORS, ZONE_LABELS } from '@/lib/defaults'
import { translations, type Language } from './translations'

interface Props {
  payoffs: ServePayoffMatrix
  playerA: PlayerStrategy
  playerB: PlayerStrategy
  language: Language
}

const ZONES = ['wide', 'body', 'T'] as const

function MixBar({
  mix,
  label,
  highlight,
  language,
}: {
  mix: Record<string, number>
  label: string
  highlight?: Record<string, number>
  language: Language
}) {
  return (
    <div className="mix-section">
      <div className="mix-label">{label}</div>
      <div className="mix-bars">
        {ZONES.map((z) => (
          <div key={z} className="mix-bar-row">
            <span className="mix-zone-name">{ZONE_LABELS[z]}</span>
            <div className="mix-bar-bg">
              <div
                className="mix-bar-actual"
                style={{
                  width: `${Math.round((highlight?.[z] ?? 0) * 100)}%`,
                  background: ZONE_COLORS[z],
                  opacity: 0.5,
                }}
              />
              <div
                className="mix-bar-nash"
                style={{
                  width: `${Math.round(mix[z] * 100)}%`,
                  background: ZONE_COLORS[z],
                }}
              />
            </div>
            <div className="mix-values">
              <span className="nash-pct" style={{ color: ZONE_COLORS[z] }}>
                {Math.round(mix[z] * 100)}%
              </span>
              {highlight && (
                <span className="actual-pct">
                  {translations[language].actual}: {Math.round((highlight[z] ?? 0) * 100)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function NashDisplay({ payoffs, playerA, playerB, language }: Props) {
  const t = translations[language]
  const nash = useMemo(() => solveNash(payoffs), [payoffs])

  const deviationA = Math.sqrt(
    ZONES.reduce(
      (acc, z) => acc + Math.pow(playerA.serveMix[z] - nash.serverMix[z], 2),
      0
    )
  )
  const exploitability = Math.round(deviationA * 100)

  return (
    <div className="nash-display">
      <div className="nash-ev-card">
        <div className="ev-number">{Math.round(nash.expectedValue)}%</div>
        <div className="ev-label">{t.nashEV}</div>
        <div className="ev-sub">
          {t.nashEVSub}
        </div>
      </div>

      <div className="nash-grids">
        <MixBar
          mix={nash.serverMix}
          label={t.optimalServeMix}
          highlight={playerA.serveMix}
          language={language}
        />
        <MixBar
          mix={nash.returnerMix}
          label={t.optimalReturnMix}
          highlight={playerB.serveMix}
          language={language}
        />
      </div>

      <div className="exploitability-row">
        <div className="exploit-label">
          <span>{t.playerAExploitability}</span>
          <span
            className="exploit-badge"
            style={{
              background:
                exploitability < 10
                  ? 'rgba(74,222,128,0.2)'
                  : exploitability < 25
                  ? 'rgba(250,204,21,0.2)'
                  : 'rgba(239,68,68,0.2)',
              color:
                exploitability < 10
                  ? '#4ade80'
                  : exploitability < 25
                  ? '#facc15'
                  : '#f87171',
            }}
          >
            {exploitability < 10
              ? t.nearOptimal
              : exploitability < 25
              ? t.moderateDeviation
              : t.highlyExploitable}
          </span>
        </div>
        <div className="exploit-bar-bg">
          <div
            className="exploit-bar-fill"
            style={{
              width: `${Math.min(exploitability * 2, 100)}%`,
              background:
                exploitability < 10
                  ? '#4ade80'
                  : exploitability < 25
                  ? '#facc15'
                  : '#f87171',
            }}
          />
        </div>
        <div className="exploit-hint">
          {t.deviationScore}: {exploitability} — {exploitability < 10
            ? t.exploitabilityHint1
            : exploitability < 25
            ? t.exploitabilityHint2
            : t.exploitabilityHint3}
        </div>
      </div>
    </div>
  )
}
