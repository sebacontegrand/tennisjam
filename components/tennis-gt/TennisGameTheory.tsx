'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import type { PlayerStrategy, ServePayoffMatrix, MatchResult } from '@/types'
import { PLAYER_PRESETS, DEFAULT_SERVE_PAYOFFS } from '@/lib/defaults'
import { simulateMatch } from '@/lib/engine'
import { translations, type Language } from './translations'
import StrategyEditor from './StrategyEditor'
import PayoffMatrix from './PayoffMatrix'
import NashDisplay from './NashDisplay'
import MatchFeed from './MatchFeed'
import GameTheoryExplanation from './GameTheoryExplanation'
import OpponentAnalysis from './OpponentAnalysis'

const TABS = ['strategy', 'payoffs', 'nash', 'simulate', 'theory'] as const
type Tab = typeof TABS[number]

export default function TennisGameTheory() {
  const [language, setLanguage] = useState<Language>('en')
  const [tab, setTab] = useState<Tab>('strategy')
  const [playerA, setPlayerA] = useState<PlayerStrategy>(() => {
    const p = { ...PLAYER_PRESETS.big_server }
    p.name = language === 'en' ? 'Player 1' : 'Jugador 1'
    return p
  })
  const [playerB, setPlayerB] = useState<PlayerStrategy>(() => {
    const p = { ...PLAYER_PRESETS.counter_puncher }
    p.name = language === 'en' ? 'Player 2' : 'Jugador 2'
    return p
  })
  const [payoffs, setPayoffs] = useState<ServePayoffMatrix>(DEFAULT_SERVE_PAYOFFS)
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [simSets, setSimSets] = useState(3)
  const [running, setRunning] = useState(false)
  
  // Multiplayer Mode
  const [mode, setMode] = useState<'practice' | 'multiplayer'>('practice')
  const [mpStage, setMpStage] = useState<'player1-setup' | 'player2-setup' | 'ready' | 'simulating'>('player1-setup')

  const t = translations[language]
  const tabLabels: Record<Tab, string> = {
    strategy: t.tabStrategy,
    payoffs: t.tabPayoffs,
    nash: t.tabNash,
    simulate: t.tabSimulate,
    theory: t.tabTheory,
  }

  const runSim = useCallback(() => {
    setRunning(true)
    setTimeout(() => {
      const result = simulateMatch({
        playerA,
        playerB,
        sets: simSets,
        servePayoffs: payoffs,
        rallyPayoffs: {},
      })
      setMatchResult(result)
      setRunning(false)
      if (mode === 'multiplayer') {
        setMpStage('simulating')
      } else {
        setTab('simulate')
      }
    }, 120)
  }, [playerA, playerB, payoffs, simSets, mode])

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --accent: #3b82f6;
          --bg-dark: #0f172a;
          --bg-darker: #020617;
          --text: #f1f5f9;
          --text-muted: #94a3b8;
          --border: #1e293b;
          --success: #4ade80;
          --warning: #facc15;
          --error: #f87171;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--bg-darker);
          color: var(--text);
          line-height: 1.6;
        }

        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          background: linear-gradient(135deg, var(--bg-dark) 0%, #1a2332 100%);
          border-bottom: 1px solid var(--border);
          padding: 2rem;
          text-align: center;
          position: relative;
        }

        .back-button {
          position: absolute;
          top: 1.5rem;
          left: 2rem;
          color: var(--accent);
          text-decoration: none;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .back-button:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.6);
          transform: translateX(-2px);
        }

        .language-toggle {
          position: absolute;
          top: 1.5rem;
          right: 2rem;
          display: flex;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.375rem;
          padding: 0.4rem;
        }

        .lang-btn {
          padding: 0.4rem 0.8rem;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: 0.25rem;
          transition: all 0.2s;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .lang-btn.active {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }

        .lang-btn:hover:not(.active) {
          border-color: rgba(255, 255, 255, 0.2);
          color: var(--text);
        }

        .header-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, var(--text) 0%, var(--text-muted) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }

        .mode-selector {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
          justify-content: center;
        }

        .mode-btn {
          padding: 0.6rem 1.2rem;
          border: 2px solid var(--border);
          background: transparent;
          color: var(--text-muted);
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          font-size: 0.95rem;
        }

        .mode-btn.active {
          border-color: var(--accent);
          background: rgba(59, 130, 246, 0.1);
          color: var(--accent);
        }

        .mode-btn:hover {
          border-color: var(--accent);
          color: var(--text);
        }

        .mp-setup-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 2rem;
          padding: 2rem;
        }

        .mp-stage-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .mp-stage-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--accent);
        }

        .mp-stage-subtitle {
          font-size: 1rem;
          color: var(--text-muted);
        }

        .mp-ready-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .mp-ready-status {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          text-align: center;
        }

        .mp-status-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .status-icon {
          font-size: 1.3rem;
        }

        .tabs {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border);
          background: var(--bg-dark);
          padding: 0 2rem;
          overflow-x: auto;
        }

        .tab-btn {
          flex-shrink: 0;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 1rem;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
          position: relative;
        }

        .tab-btn:hover {
          color: var(--text);
        }

        .tab-btn.active {
          color: var(--accent);
          border-bottom-color: var(--accent);
        }

        .content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .content-panel {
          flex: 1;
          display: none;
          flex-direction: column;
          overflow-y: auto;
        }

        .content-panel.active {
          display: flex;
        }

        .panel-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .panel-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .panel-scroll::-webkit-scrollbar-track {
          background: var(--bg-dark);
        }

        .panel-scroll::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
        }

        .panel-scroll::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }

        /* Strategy Editor */
        .strategy-editor {
          background: var(--bg-dark);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1.5rem;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          gap: 1rem;
        }

        .player-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border: 2px solid;
          border-radius: 0.375rem;
          padding: 0.5rem 1rem;
        }

        .badge-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .badge-label {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .preset-select {
          padding: 0.5rem 1rem;
          background: var(--bg-darker);
          border: 1px solid var(--border);
          color: var(--text);
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 1rem;
        }

        .preset-select:hover {
          border-color: var(--accent);
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .serve-mix-visual {
          display: flex;
          gap: 0;
          border-radius: 0.375rem;
          overflow: hidden;
          margin-bottom: 1rem;
          height: 50px;
        }

        .mix-bar-segment {
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        .slider-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .slider-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .slider-label {
          font-weight: 500;
        }

        .slider-value {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .slider-track-wrap {
          position: relative;
          height: 28px;
          background: var(--bg-darker);
          border-radius: 0.25rem;
          border: 1px solid var(--border);
          overflow: hidden;
        }

        .slider-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: 0.25rem;
          transition: width 0.1s;
          opacity: 0.3;
        }

        .slider-input {
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          z-index: 2;
          position: relative;
        }

        .slider-input::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: var(--accent);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          border: 2px solid var(--bg-dark);
        }

        .slider-input::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: var(--accent);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          border: 2px solid var(--bg-dark);
        }

        .divider {
          height: 1px;
          background: var(--border);
          margin: 1rem 0;
        }

        .hint-text {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-top: -0.5rem;
          margin-bottom: 1rem;
        }

        /* Payoff Matrix */
        .payoff-matrix {
          background: var(--bg-dark);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1.5rem;
        }

        .matrix-intro {
          margin-bottom: 1.5rem;
        }

        .matrix-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .matrix-table-wrap {
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }

        .matrix-table {
          width: 100%;
          border-collapse: collapse;
          background: var(--bg-darker);
          border: 1px solid var(--border);
          border-radius: 0.375rem;
          overflow: hidden;
        }

        .matrix-table th,
        .matrix-table td {
          padding: 0.75rem;
          text-align: center;
          border: 1px solid var(--border);
        }

        .matrix-table th {
          background: var(--bg-dark);
          font-weight: 600;
          color: var(--text);
        }

        .matrix-corner {
          position: relative;
          font-size: 0.8rem;
        }

        .axis-label-serve,
        .axis-label-read {
          display: block;
        }

        .matrix-row-header {
          font-weight: 600;
          background: var(--bg-dark);
        }

        .matrix-col-header {
          font-weight: 600;
        }

        .matrix-cell {
          position: relative;
          padding: 0;
          cursor: pointer;
          transition: transform 0.1s;
        }

        .matrix-cell:hover {
          transform: scale(1.02);
        }

        .cell-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          padding: 0.5rem;
          min-height: 60px;
        }

        .cell-input {
          width: 40px;
          text-align: center;
          background: transparent;
          border: none;
          color: var(--text);
          font-weight: 600;
          font-size: 1rem;
        }

        .cell-input:focus {
          outline: none;
        }

        .cell-pct {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .cell-slider {
          position: absolute;
          bottom: 4px;
          left: 4px;
          right: 4px;
          height: 4px;
          width: calc(100% - 8px);
          appearance: none;
          -webkit-appearance: none;
          background: transparent;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .matrix-cell:hover .cell-slider {
          opacity: 1;
        }

        .cell-slider::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 8px;
          height: 8px;
          background: var(--text);
          border-radius: 50%;
          cursor: pointer;
        }

        .cell-slider::-moz-range-thumb {
          width: 8px;
          height: 8px;
          background: var(--text);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .matrix-legend {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
        }

        .legend-swatch {
          width: 24px;
          height: 24px;
          border-radius: 0.25rem;
          border: 1px solid var(--border);
        }

        /* Nash Display */
        .nash-display {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .nash-ev-card {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 0.5rem;
          padding: 2rem;
          text-align: center;
        }

        .ev-number {
          font-size: 3rem;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }

        .ev-label {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .ev-sub {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .nash-grids {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .nash-grids {
            grid-template-columns: 1fr;
          }
        }

        .mix-section {
          background: var(--bg-dark);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1.5rem;
        }

        .mix-label {
          font-weight: 600;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .mix-bars {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .mix-bar-row {
          display: grid;
          grid-template-columns: 60px 1fr 140px;
          align-items: center;
          gap: 1rem;
        }

        .mix-zone-name {
          font-weight: 500;
          font-size: 0.9rem;
        }

        .mix-bar-bg {
          position: relative;
          height: 24px;
          background: var(--bg-darker);
          border-radius: 0.25rem;
          border: 1px solid var(--border);
          overflow: hidden;
        }

        .mix-bar-actual,
        .mix-bar-nash {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          transition: width 0.2s;
        }

        .mix-bar-nash {
          z-index: 2;
        }

        .mix-values {
          display: flex;
          gap: 0.5rem;
          font-size: 0.85rem;
        }

        .nash-pct {
          font-weight: 600;
        }

        .actual-pct {
          color: var(--text-muted);
        }

        .exploitability-row {
          background: var(--bg-dark);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1.5rem;
        }

        .exploit-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .exploit-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .exploit-bar-bg {
          height: 12px;
          background: var(--bg-darker);
          border-radius: 0.25rem;
          border: 1px solid var(--border);
          margin-bottom: 0.75rem;
          overflow: hidden;
        }

        .exploit-bar-fill {
          height: 100%;
          border-radius: 0.25rem;
          transition: width 0.3s;
        }

        .exploit-hint {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* Match Feed */
        .feed-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-muted);
          gap: 1rem;
        }

        .feed-empty-icon {
          font-size: 4rem;
          opacity: 0.3;
        }

        .feed-empty-text {
          font-size: 1.1rem;
        }

        .match-feed {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .score-header {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 2rem;
          align-items: center;
          background: var(--bg-dark);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .score-player {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: opacity 0.3s;
        }

        .score-player:nth-child(1) {
          justify-content: flex-start;
        }

        .score-player:nth-child(3) {
          justify-content: flex-end;
        }

        .score-name {
          font-size: 1.3rem;
          font-weight: 600;
        }

        .winner-crown {
          font-size: 1.5rem;
          color: #facc15;
        }

        .score-sets {
          font-size: 1.5rem;
          font-weight: 700;
          text-align: center;
          font-variant-numeric: tabular-nums;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: var(--bg-dark);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1.25rem;
          text-align: center;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 0.25rem;
        }

        .stat-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .zone-section {
          background: var(--bg-dark);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .donut-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .donut-legend {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .donut-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .donut-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .nash-deviation-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-dark);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1rem 1.5rem;
        }

        .deviation-label {
          font-weight: 500;
        }

        .deviation-value {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .points-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .points-timeline-wrap {
          margin: 0 2rem;
          padding: 1rem;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
        }

        .timeline-legend-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .timeline-legend-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 600;
          color: var(--text);
        }

        .timeline-winner-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .timeline-note {
          opacity: 0.9;
        }

        .points-timeline {
          display: grid;
          grid-template-columns: repeat(30, minmax(0, 1fr));
          gap: 0.3rem;
          align-items: end;
          height: 84px;
          padding: 0.4rem 0.35rem;
          border-radius: 0.55rem;
          background: rgba(2, 6, 23, 0.55);
          border: 1px solid rgba(148, 163, 184, 0.22);
        }

        .timeline-col {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          height: 100%;
        }

        .timeline-bar {
          width: 100%;
          min-width: 6px;
          border-radius: 4px 4px 2px 2px;
          position: relative;
          transition: transform 0.2s ease, filter 0.2s ease;
          box-shadow: 0 6px 14px rgba(2, 6, 23, 0.26);
        }

        .timeline-bar:hover {
          transform: translateY(-2px);
          filter: brightness(1.08);
        }

        .timeline-zone-tag {
          position: absolute;
          bottom: -3px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid rgba(15, 23, 42, 0.9);
        }

        .timeline-axis-row {
          margin-top: 0.45rem;
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .point-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          align-items: center;
          background: var(--bg-dark);
          border: 1px solid var(--border);
          border-radius: 0.375rem;
          padding: 0.75rem 1rem;
          transition: all 0.2s;
        }

        .point-row:hover {
          border-color: var(--accent);
        }

        .point-row.point-won {
          border-left: 3px solid var(--success);
        }

        .point-row.point-lost {
          border-left: 3px solid var(--error);
          opacity: 0.7;
        }

        .point-row-split {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
          align-items: center;
          background: var(--bg-dark);
          border: 1px solid var(--border);
          border-radius: 0.375rem;
          padding: 1rem;
          transition: all 0.2s;
          min-height: 80px;
        }

        .point-row-split:hover {
          border-color: var(--accent);
          background: rgba(59, 130, 246, 0.05);
        }

        .point-row-split.point-won {
          border-top: 3px solid var(--success);
        }

        .point-row-split.point-lost {
          border-top: 3px solid var(--error);
          opacity: 0.8;
        }

        .point-side {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: 0.375rem;
          background: rgba(255, 255, 255, 0.02);
        }

        .point-side-a {
          border-left: 3px solid #3b82f6;
          text-align: left;
        }

        .point-side-b {
          border-right: 3px solid #ef4444;
          text-align: right;
        }

        .point-side-header {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .point-side-name {
          color: var(--text);
        }

        .point-side-action {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .serve-indicator, .read-indicator {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .point-side-b .read-indicator {
          flex-direction: row-reverse;
        }

        .zone-dot-small {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .zone-label {
          color: var(--text);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .rally-info, .return-info {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .bp-badge {
          position: absolute;
          font-size: 0.65rem;
          background: rgba(239, 68, 68, 0.3);
          color: var(--error);
          padding: 0.2rem 0.4rem;
          border-radius: 0.2rem;
          font-weight: 700;
        }

        .point-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem;
        }

        .point-outcome-badge {
          font-weight: 700;
          font-size: 0.85rem;
          min-height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .outcome-win-badge {
          color: var(--success);
          background: rgba(74, 222, 128, 0.15);
          padding: 0.3rem 0.6rem;
          border-radius: 0.3rem;
        }

        .outcome-loss-badge {
          color: var(--error);
          background: rgba(239, 68, 68, 0.15);
          padding: 0.3rem 0.6rem;
          border-radius: 0.3rem;
        }

        .point-read-info {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: center;
        }

        .point-outcome {
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0.4rem 0.8rem;
          border-radius: 0.25rem;
        }

        .point-outcome.outcome-win {
          background: rgba(74, 222, 128, 0.15);
          color: var(--success);
        }

        .point-outcome.outcome-loss {
          background: rgba(239, 68, 68, 0.15);
          color: var(--error);
        }

        /* Controls */
        .controls {
          padding: 2rem;
          border-top: 1px solid var(--border);
          background: var(--bg-dark);
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .control-label {
          font-weight: 500;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--accent) 0%, #2563eb 100%);
          color: white;
          border: 1px solid rgba(59, 130, 246, 0.5);
        }

        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: var(--bg-darker);
          color: var(--text);
          border: 1px solid var(--border);
        }

        .btn-secondary:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .control-input {
          padding: 0.5rem 1rem;
          background: var(--bg-darker);
          border: 1px solid var(--border);
          color: var(--text);
          border-radius: 0.375rem;
          font-size: 1rem;
        }

        .control-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
        }

        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(59, 130, 246, 0.2);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .footer {
          padding: 1.5rem 2rem;
          text-align: center;
          border-top: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        @media (max-width: 1024px) {
          .header-title {
            font-size: 1.8rem;
          }

          .nash-grids {
            grid-template-columns: 1fr;
          }

          .mp-stage-header {
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 768px) {
          .mode-selector {
            flex-wrap: wrap;
          }

          .mode-btn {
            flex: 1;
            min-width: 150px;
          }

          .panel-scroll {
            [style*="grid-template-columns: '1fr 1fr'"] {
              grid-template-columns: 1fr !important;
            }
          }
        }

        @media (max-width: 640px) {
          .header {
            padding: 1rem;
          }

          .back-button {
            top: 1rem;
            left: 1rem;
            font-size: 0.9rem;
            padding: 0.4rem 0.8rem;
          }

          .language-toggle {
            top: 1rem;
            right: 1rem;
            gap: 0.3rem;
            padding: 0.3rem;
          }

          .lang-btn {
            padding: 0.3rem 0.6rem;
            font-size: 0.75rem;
          }

          .header-title {
            font-size: 1.5rem;
          }

          .mode-selector {
            flex-direction: column;
          }

          .mode-btn {
            width: 100%;
          }

          .tabs {
            padding: 0 1rem;
          }

          .tab-btn {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }

          .content {
            flex-direction: column;
          }

          .controls {
            padding: 1rem;
            flex-direction: column;
          }

          .control-group {
            width: 100%;
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .score-header {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .panel-scroll {
            padding: 1rem;
          }

          .points-timeline-wrap {
            margin: 0 1rem;
            padding: 0.8rem;
          }

          .points-timeline {
            gap: 0.2rem;
            height: 74px;
          }

          [style*="grid-template-columns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="app">
        {/* Header */}
        <div className="header">
          <Link href="/" className="back-button">
            {t.backButton}
          </Link>
          <div className="language-toggle">
            <button
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              English
            </button>
            <button
              className={`lang-btn ${language === 'es' ? 'active' : ''}`}
              onClick={() => setLanguage('es')}
            >
              Español
            </button>
          </div>
          <div className="header-title">🎾 {t.headerTitle}</div>
          <div className="header-subtitle">
            {t.headerSubtitle}
          </div>
          <div className="mode-selector">
            <button
              className={`mode-btn ${mode === 'practice' ? 'active' : ''}`}
              onClick={() => {
                setMode('practice')
                setTab('strategy')
              }}
            >
              {t.practiceMode}
            </button>
            <button
              className={`mode-btn ${mode === 'multiplayer' ? 'active' : ''}`}
              onClick={() => {
                setMode('multiplayer')
                setMpStage('player1-setup')
              }}
            >
              {t.multiplayerMode}
            </button>
          </div>
        </div>

        {/* Tabs - Only show in practice mode */}
        {mode === 'practice' && (
          <div className="tabs">
            {TABS.map((t) => (
              <button
                key={t}
                className={`tab-btn ${t === tab ? 'active' : ''}`}
                onClick={() => setTab(t)}
              >
                {tabLabels[t]}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="content">
          {mode === 'practice' ? (
            <>
              {/* Strategy Tab */}
              <div className={`content-panel ${tab === 'strategy' ? 'active' : ''}`}>
                <div className="panel-scroll">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <StrategyEditor
                      player={playerA}
                      label="Player A"
                      color="#3b82f6"
                      onChange={setPlayerA}
                      language={language}
                    />
                    <StrategyEditor
                      player={playerB}
                      label="Player B"
                      color="#ef4444"
                      onChange={setPlayerB}
                      language={language}
                    />
                  </div>
                </div>
              </div>

              {/* Payoff Matrix Tab */}
              <div className={`content-panel ${tab === 'payoffs' ? 'active' : ''}`}>
                <div className="panel-scroll">
                  <PayoffMatrix payoffs={payoffs} onChange={setPayoffs} language={language} />
                </div>
              </div>

              {/* Nash Tab */}
              <div className={`content-panel ${tab === 'nash' ? 'active' : ''}`}>
                <div className="panel-scroll">
                  <NashDisplay payoffs={payoffs} playerA={playerA} playerB={playerB} language={language} />
                </div>
              </div>

              {/* Simulate Tab */}
              <div className={`content-panel ${tab === 'simulate' ? 'active' : ''}`}>
                <div className="panel-scroll">
                  <MatchFeed 
                    result={matchResult} 
                    playerAName={playerA.name} 
                    playerBName={playerB.name} 
                    language={language}
                    playerA={playerA}
                    playerB={playerB}
                  />
                </div>
              </div>

              {/* Game Theory Tab */}
              <div className={`content-panel ${tab === 'theory' ? 'active' : ''}`}>
                <div className="panel-scroll">
                  <GameTheoryExplanation language={language} />
                </div>
              </div>
            </>
          ) : (
            // Multiplayer Mode
            <>
              {mpStage === 'player1-setup' && (
                <div className="content-panel active">
                  <div className="panel-scroll">
                    <div className="mp-stage-header">
                      <div className="mp-stage-title">{t.player1Setup}</div>
                      <div className="mp-stage-subtitle">{t.player1Setup}</div>
                    </div>
                    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                      <StrategyEditor
                        player={playerA}
                        label="Player 1"
                        color="#3b82f6"
                        onChange={setPlayerA}
                        language={language}
                      />
                    </div>
                  </div>
                </div>
              )}

              {mpStage === 'player2-setup' && (
                <div className="content-panel active">
                  <div className="panel-scroll">
                    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                      <div className="mp-stage-header">
                        <div className="mp-stage-title">{t.player2Setup}</div>
                        <div className="mp-stage-subtitle">{t.player2Setup}</div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                        <div>
                          <OpponentAnalysis player={playerA} language={language} />
                        </div>
                        <div>
                          <StrategyEditor
                            player={playerB}
                            label="Player 2"
                            color="#ef4444"
                            onChange={setPlayerB}
                            language={language}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {mpStage === 'ready' && (
                <div className="content-panel active">
                  <div className="panel-scroll">
                    <div className="mp-setup-container">
                      <div className="mp-ready-panel">
                        <div className="mp-stage-header">
                          <div className="mp-stage-title">{t.readyToPlay}</div>
                        </div>
                        <div className="mp-ready-status">
                          <div className="mp-status-row">
                            <span className="status-icon">🎵</span>
                            <span className="mp-stage-subtitle">{t.player1Ready}</span>
                          </div>
                          <div className="mp-status-row">
                            <span className="status-icon">🎵</span>
                            <span className="mp-stage-subtitle">{t.player2Ready}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {mpStage === 'simulating' && (
                <div className="content-panel active">
                  <div className="panel-scroll">
                    <MatchFeed 
                      result={matchResult} 
                      playerAName={playerA.name} 
                      playerBName={playerB.name} 
                      language={language}
                      playerA={playerA}
                      playerB={playerB}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="controls">
          {mode === 'practice' ? (
            <>
              <div className="control-group">
                <label className="control-label">{t.bestOf}:</label>
                <select
                  value={simSets}
                  onChange={(e) => setSimSets(Number(e.target.value))}
                  className="control-input"
                >
                  <option value={1}>1 {t.set}</option>
                  <option value={3}>3 {t.sets}</option>
                  <option value={5}>5 {t.sets}</option>
                </select>
              </div>
              <button
                className="btn btn-primary"
                onClick={runSim}
                disabled={running}
              >
                {running ? (
                  <>
                    <span className="loading-spinner" />
                    {t.simulating}
                  </>
                ) : (
                  t.simulateMatch
                )}
              </button>
            </>
          ) : (
            // Multiplayer Mode Controls
            <>
              {mpStage === 'player1-setup' && (
                <button
                  className="btn btn-primary"
                  onClick={() => setMpStage('player2-setup')}
                >
                  {t.nextPlayer}
                </button>
              )}
              {mpStage === 'player2-setup' && (
                <>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setMpStage('player1-setup')}
                  >
                    {t.backToP1}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setMpStage('ready')}
                  >
                    {t.readyToPlay}
                  </button>
                </>
              )}
              {mpStage === 'ready' && (
                <>
                  <div className="control-group">
                    <label className="control-label">{t.bestOf}:</label>
                    <select
                      value={simSets}
                      onChange={(e) => setSimSets(Number(e.target.value))}
                      className="control-input"
                    >
                      <option value={1}>1 {t.set}</option>
                      <option value={3}>3 {t.sets}</option>
                      <option value={5}>5 {t.sets}</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setMpStage('player2-setup')}
                  >
                    {t.backToP1}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={runSim}
                    disabled={running}
                  >
                    {running ? (
                      <>
                        <span className="loading-spinner" />
                        {t.simulating}
                      </>
                    ) : (
                      t.simulateMatch
                    )}
                  </button>
                </>
              )}
              {mpStage === 'simulating' && (
                <>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setMpStage('ready')
                      setMatchResult(null)
                    }}
                  >
                    {language === 'en' ? '← Back' : '← Volver'}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setMpStage('player1-setup')
                      setMatchResult(null)
                    }}
                  >
                    {language === 'en' ? 'New Match' : 'Nuevo Partido'}
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          {mode === 'multiplayer' ? (
            mpStage === 'player2-setup' ? (
              language === 'en'
                ? 'Player 2: Analyze your opponent\'s strategy and adjust your own to counter their game!'
                : '¡Jugador 2: Analiza la estrategia de tu oponente y ajusta la tuya para contrarrestar su juego!'
            ) : mpStage === 'player1-setup' ? (
              language === 'en'
                ? 'Player 1: Set your strategy. Player 2 will see this and configure their approach.'
                : 'Jugador 1: Setea tu estrategia. Jugador 2 la verá y configurará su abordaje.'
            ) : (
              language === 'en'
                ? 'Both players are ready! Your strategies will be tested in the simulation.'
                : '¡Ambos jugadores listos! Sus estrategias serán probadas en la simulación.'
            )
          ) : (
            language === 'en' 
              ? 'Adjust strategies, payoffs, and run simulations to explore Nash equilibrium in tennis.'
              : 'Ajusta estrategias, matrices de resultados y ejecuta simulaciones para explorar el equilibrio de Nash en el tenis.'
          )}
        </div>
      </div>
    </>
  )
}

