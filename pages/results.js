import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { getBandDescriptor } from '../lib/scoring';

export default function Results() {
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('ielts_results');
    if (stored) {
      try {
        setResults(JSON.parse(stored));
        setLoading(false);
      } catch (e) {
        setError('Failed to load results.');
        setLoading(false);
      }
      return;
    }

    // If no results, try submitting from session
    const session = localStorage.getItem('ielts_session');
    if (!session) { router.replace('/'); return; }

    const s = JSON.parse(session);
    fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: s.sessionId,
        testStartTime: s.testStartTime,
        testEndTime: s.testEndTime || Date.now(),
        sectionTimes: s.sectionTimes || {},
        listeningAnswers: s.listeningAnswers || {},
        readingAnswers: s.readingAnswers || {},
        writingData: s.writingData || {},
        writingSelfScores: s.writingSelfScores || {}
      })
    })
      .then(r => r.json())
      .then(data => {
        localStorage.setItem('ielts_results', JSON.stringify(data));
        setResults(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not retrieve results. Please check your connection.');
        setLoading(false);
      });
  }, []);

  const retry = () => {
    localStorage.removeItem('ielts_results');
    router.replace('/results');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '120px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>⏳</div>
          <h2 style={{ color: 'var(--navy)', marginBottom: 8 }}>Calculating Your Results</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Sending answers to server and computing band scores...</p>
        </div>
      </>
    );
  }

  if (error || !results) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '120px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
          <h2 style={{ color: 'var(--navy)', marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{error}</p>
          <button className="btn btn-primary" onClick={retry}>Try Again</button>
        </div>
      </>
    );
  }

  const { scores, timing, listeningByPart, readingByPassage } = results;
  const overallDescriptor = getBandDescriptor(scores.overall.band);

  return (
    <>
      <Head><title>Your IELTS Results – MockTest</title></Head>
      <Navbar />

      {/* Hero */}
      <div className="results-hero">
        <div className="badge" style={{ background: 'rgba(200,168,75,0.2)', border: '1px solid var(--gold)', color: 'var(--gold)' }}>
          Test Complete
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginTop: 16 }}>Your IELTS Results</h1>
        <p style={{ opacity: 0.8, marginTop: 8, marginBottom: 0 }}>
          Submitted {new Date(results.submittedAt).toLocaleString()}
        </p>

        <div className="band-score-display">
          <div className="band-score-number">{scores.overall.band}</div>
          <div className="band-score-label">Overall Band Score</div>
          <div style={{ marginTop: 8, padding: '4px 14px', borderRadius: 100, fontSize: '0.85rem', fontWeight: 600, background: 'rgba(200,168,75,0.2)', border: '1px solid rgba(200,168,75,0.4)', color: 'var(--gold)' }}>
            {scores.overall.descriptor.label}
          </div>
        </div>
        <p style={{ fontSize: '0.8rem', opacity: 0.6, maxWidth: 500, margin: '0 auto' }}>{scores.overall.note}</p>
      </div>

      {/* Timing Card */}
      <div style={{ maxWidth: 1100, margin: '-30px auto 24px', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div className="timing-card">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)', marginBottom: 4 }}>⏱ Time Analytics</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
            How long you spent on each section vs. the recommended time
          </p>
          <div className="timing-grid">
            <div className="timing-item">
              <div className="timing-value">{timing.totalTimeFormatted}</div>
              <div className="timing-label">Total Test Duration</div>
            </div>
            {[
              { key: 'listening', label: 'Listening', rec: '30 min', recSec: 1800 },
              { key: 'reading', label: 'Reading', rec: '60 min', recSec: 3600 },
              { key: 'writing', label: 'Writing', rec: '60 min', recSec: 3600 },
            ].map(s => {
              const sec = timing.sections[s.key];
              const diff = sec ? sec.seconds - s.recSec : null;
              return (
                <div key={s.key} className="timing-item">
                  <div className="timing-value" style={{ color: 'var(--navy)' }}>
                    {sec ? sec.formatted : 'N/A'}
                  </div>
                  <div className="timing-label">{s.label}</div>
                  {diff !== null && (
                    <div style={{ fontSize: '0.75rem', marginTop: 4, color: diff > 300 ? 'var(--error)' : diff < -300 ? 'var(--warning)' : 'var(--success)' }}>
                      {diff > 300 ? `+${Math.floor(diff / 60)}m over` : diff < -300 ? `${Math.floor(Math.abs(diff) / 60)}m under` : 'On time'}
                      <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>(rec. {s.rec})</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Score Cards */}
      <div className="results-grid">
        {/* Listening */}
        <div className="result-card">
          <div className="result-card-header">
            <h3>🎧 Listening</h3>
            <span className="section-band">{scores.listening.band}</span>
          </div>
          <div className="result-card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Raw Score</span>
              <strong>{scores.listening.raw} / {scores.listening.total}</strong>
            </div>
            <div className="score-bar">
              <div className="score-bar-fill" style={{ width: `${scores.listening.percentage}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14 }}>
              <span>{scores.listening.percentage}% correct</span>
              <span style={{ padding: '2px 8px', borderRadius: 4, background: scores.listening.descriptor.bg, color: scores.listening.descriptor.color, fontWeight: 600 }}>
                {scores.listening.descriptor.label}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>{scores.listening.feedback}</p>

            {/* Part breakdown */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>By Part</p>
              {listeningByPart.map(p => (
                <div key={p.part} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: '0.78rem', width: 50, color: 'var(--text-muted)' }}>Part {p.part}</span>
                  <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: p.correct === p.total ? 'var(--success)' : 'var(--navy)', width: `${(p.correct / p.total) * 100}%`, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', width: 36, textAlign: 'right' }}>{p.correct}/{p.total}</span>
                </div>
              ))}
            </div>

            <button className="detail-toggle" onClick={() => setExpandedSection(expandedSection === 'listening' ? null : 'listening')}>
              {expandedSection === 'listening' ? '▲ Hide Answer Review' : '▼ View Answer Review'}
            </button>

            {expandedSection === 'listening' && (
              <div style={{ marginTop: 12, overflowX: 'auto' }}>
                <table className="answer-detail-table">
                  <thead>
                    <tr>
                      <th>Q#</th>
                      <th>Your Answer</th>
                      <th>Correct</th>
                      <th>✓/✗</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.listening.details.map(d => (
                      <tr key={d.id} className={d.isCorrect ? 'correct' : 'incorrect'}>
                        <td>{d.id}</td>
                        <td>{d.userAnswer}</td>
                        <td>{d.correctAnswer}</td>
                        <td>{d.isCorrect ? '✅' : '❌'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Reading */}
        <div className="result-card">
          <div className="result-card-header">
            <h3>📖 Reading</h3>
            <span className="section-band">{scores.reading.band}</span>
          </div>
          <div className="result-card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Raw Score</span>
              <strong>{scores.reading.raw} / {scores.reading.total}</strong>
            </div>
            <div className="score-bar">
              <div className="score-bar-fill" style={{ width: `${scores.reading.percentage}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14 }}>
              <span>{scores.reading.percentage}% correct</span>
              <span style={{ padding: '2px 8px', borderRadius: 4, background: scores.reading.descriptor.bg, color: scores.reading.descriptor.color, fontWeight: 600 }}>
                {scores.reading.descriptor.label}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>{scores.reading.feedback}</p>

            {/* Passage breakdown */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>By Passage</p>
              {readingByPassage.map(p => (
                <div key={p.passage} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.78rem', width: 60, color: 'var(--text-muted)' }}>P{p.passage}</span>
                    <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: p.correct === p.total ? 'var(--success)' : 'var(--navy)', width: `${(p.correct / p.total) * 100}%`, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', width: 36, textAlign: 'right' }}>{p.correct}/{p.total}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="detail-toggle" onClick={() => setExpandedSection(expandedSection === 'reading' ? null : 'reading')}>
              {expandedSection === 'reading' ? '▲ Hide Answer Review' : '▼ View Answer Review'}
            </button>

            {expandedSection === 'reading' && (
              <div style={{ marginTop: 12, overflowX: 'auto' }}>
                <table className="answer-detail-table">
                  <thead>
                    <tr>
                      <th>Q#</th>
                      <th>Your Answer</th>
                      <th>Correct</th>
                      <th>✓/✗</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.reading.details.map(d => (
                      <tr key={d.id} className={d.isCorrect ? 'correct' : 'incorrect'}>
                        <td>{d.id}</td>
                        <td>{d.userAnswer}</td>
                        <td>{d.correctAnswer}</td>
                        <td>{d.isCorrect ? '✅' : '❌'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Writing */}
        <div className="result-card">
          <div className="result-card-header">
            <h3>✍️ Writing</h3>
            <span className="section-band">{scores.writing.band}</span>
          </div>
          <div className="result-card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 14 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Estimated Band</span>
              <span style={{ padding: '2px 8px', borderRadius: 4, background: scores.writing.descriptor.bg, color: scores.writing.descriptor.color, fontWeight: 600 }}>
                {scores.writing.descriptor.label}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>{scores.writing.feedback}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ padding: '10px 14px', background: 'var(--off-white)', borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Task 1 Words</div>
                <div style={{ fontWeight: 700, color: scores.writing.wordCounts.task1 >= 150 ? 'var(--success)' : 'var(--error)', fontSize: '1.1rem' }}>
                  {scores.writing.wordCounts.task1}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{scores.writing.wordCounts.task1 >= 150 ? '✓ Met' : '✗ Under 150'}</div>
              </div>
              <div style={{ padding: '10px 14px', background: 'var(--off-white)', borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Task 2 Words</div>
                <div style={{ fontWeight: 700, color: scores.writing.wordCounts.task2 >= 250 ? 'var(--success)' : 'var(--error)', fontSize: '1.1rem' }}>
                  {scores.writing.wordCounts.task2}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{scores.writing.wordCounts.task2 >= 250 ? '✓ Met' : '✗ Under 250'}</div>
              </div>
            </div>

            {scores.writing.details && (
              <div>
                {[
                  { label: 'Task 1', data: scores.writing.details.task1 },
                  { label: 'Task 2', data: scores.writing.details.task2 }
                ].map(({ label, data }) => (
                  <div key={label} style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: 8 }}>{label} Criteria</p>
                    {Object.entries(data.scores).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <strong>Band {v}</strong>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Band Score Guide */}
      <div style={{ maxWidth: 1100, margin: '0 auto 40px', padding: '0 24px' }}>
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', padding: 28, boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)', marginBottom: 20 }}>📊 IELTS Band Score Reference</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {[
              { band: '9', label: 'Expert User' },
              { band: '8–8.5', label: 'Very Good User' },
              { band: '7–7.5', label: 'Good User' },
              { band: '6–6.5', label: 'Competent User' },
              { band: '5–5.5', label: 'Modest User' },
              { band: '4–4.5', label: 'Limited User' },
            ].map(b => {
              const desc = getBandDescriptor(parseFloat(b.band));
              return (
                <div key={b.band} style={{ padding: '10px 14px', borderRadius: 8, background: desc.bg, border: `1px solid ${desc.color}20` }}>
                  <div style={{ fontWeight: 700, color: desc.color, fontSize: '1.1rem' }}>{b.band}</div>
                  <div style={{ fontSize: '0.78rem', color: desc.color }}>{b.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '0 24px 80px' }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            localStorage.removeItem('ielts_session');
            localStorage.removeItem('ielts_results');
            router.push('/');
          }}
        >
          Take Another Test
        </button>
        <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          This will reset your session and start a fresh test.
        </p>
      </div>
    </>
  );
}
