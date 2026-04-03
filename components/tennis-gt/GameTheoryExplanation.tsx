'use client'

import { translations, type Language } from './translations'

interface Props {
  language: Language
}

export default function GameTheoryExplanation({ language }: Props) {
  const t = translations[language]

  return (
    <div className="game-theory-explanation">
      <div className="gt-intro">
        <h1 className="gt-title">{t.gameTheoryTitle}</h1>
        <p className="gt-intro-text">{t.gameTheoryIntro}</p>
      </div>

      <div className="gt-sections">
        {/* Mixed Strategies */}
        <div className="gt-section">
          <div className="gt-section-header">
            <h2 className="gt-section-title">📊 {t.gtMixedStrategies}</h2>
          </div>
          <p className="gt-section-desc">{t.gtMixedStrategiesDesc}</p>
        </div>

        {/* Payoff Matrix */}
        <div className="gt-section">
          <div className="gt-section-header">
            <h2 className="gt-section-title">🎯 {t.gtPayoffMatrix}</h2>
          </div>
          <p className="gt-section-desc">{t.gtPayoffMatrixDesc}</p>
        </div>

        {/* Nash Equilibrium */}
        <div className="gt-section">
          <div className="gt-section-header">
            <h2 className="gt-section-title">⚖️ {t.gtNashEquilibrium}</h2>
          </div>
          <p className="gt-section-desc">{t.gtNashEquilibriumDesc}</p>
        </div>

        {/* Fictitious Play */}
        <div className="gt-section">
          <div className="gt-section-header">
            <h2 className="gt-section-title">🔄 {t.gtFictitousPlay}</h2>
          </div>
          <p className="gt-section-desc">{t.gtFictitousPlayDesc}</p>
        </div>

        {/* Exploitability */}
        <div className="gt-section">
          <div className="gt-section-header">
            <h2 className="gt-section-title">🎲 {t.gtExploitability}</h2>
          </div>
          <p className="gt-section-desc">{t.gtExploitabilityDesc}</p>
        </div>

        {/* Adaptation */}
        <div className="gt-section">
          <div className="gt-section-header">
            <h2 className="gt-section-title">🧠 {t.gtAdaptation}</h2>
          </div>
          <p className="gt-section-desc">{t.gtAdaptationDesc}</p>
        </div>
      </div>

      <style>{`
        .game-theory-explanation {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 0;
        }

        .gt-intro {
          padding: 2rem;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 0.75rem;
          margin-bottom: 1rem;
        }

        .gt-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gt-intro-text {
          color: var(--text-muted);
          font-size: 1.1rem;
          line-height: 1.6;
          margin: 0;
        }

        .gt-sections {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 0 2rem 2rem 2rem;
        }

        .gt-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--bg-darker);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .gt-section:hover {
          border-color: var(--accent);
          background: rgba(59, 130, 246, 0.02);
        }

        .gt-section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .gt-section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--accent);
          margin: 0;
        }

        .gt-section-desc {
          color: var(--text);
          font-size: 1rem;
          line-height: 1.7;
          margin: 0;
        }

        @media (max-width: 768px) {
          .gt-intro {
            padding: 1.5rem;
          }

          .gt-sections {
            padding: 0 1rem 1.5rem 1rem;
            gap: 1rem;
          }

          .gt-section {
            padding: 1rem;
          }

          .gt-title {
            font-size: 1.5rem;
          }

          .gt-intro-text {
            font-size: 1rem;
          }

          .gt-section-title {
            font-size: 1.1rem;
          }

          .gt-section-desc {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  )
}
