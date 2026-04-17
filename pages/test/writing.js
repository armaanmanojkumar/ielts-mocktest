import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { WRITING_TEST } from '../../lib/questions';

const DURATION = WRITING_TEST.duration;

const CRITERIA = ['taskAchievement', 'coherence', 'lexical', 'grammar'];
const CRITERIA_LABELS = {
  taskAchievement: 'Task Achievement / Response',
  coherence: 'Coherence & Cohesion',
  lexical: 'Lexical Resource',
  grammar: 'Grammatical Range & Accuracy'
};

const BAND_OPTIONS = [4, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

function countWords(text) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

export default function WritingTest() {
  const router = useRouter();
  const [activeTask, setActiveTask] = useState(0);
  const [task1Text, setTask1Text] = useState('');
  const [task2Text, setTask2Text] = useState('');
  const [selfScores1, setSelfScores1] = useState({ taskAchievement: 6, coherence: 6, lexical: 6, grammar: 6 });
  const [selfScores2, setSelfScores2] = useState({ taskAchievement: 6, coherence: 6, lexical: 6, grammar: 6 });
  const [phase, setPhase] = useState('writing'); // writing | assessment
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('ielts_session');
    if (!raw) { router.replace('/'); return; }
    const session = JSON.parse(raw);
    if (session.writingData?.task1?.text) setTask1Text(session.writingData.task1.text);
    if (session.writingData?.task2?.text) setTask2Text(session.writingData.task2.text);
    if (session.writingSelfScores?.task1) setSelfScores1(session.writingSelfScores.task1);
    if (session.writingSelfScores?.task2) setSelfScores2(session.writingSelfScores.task2);
    session.sectionTimes = session.sectionTimes || {};
    session.sectionTimes.writing = { start: Date.now() };
    localStorage.setItem('ielts_session', JSON.stringify(session));
  }, []);

  // Autosave
  useEffect(() => {
    const raw = localStorage.getItem('ielts_session');
    if (!raw) return;
    const session = JSON.parse(raw);
    session.writingData = {
      task1: { text: task1Text, wordCount: countWords(task1Text) },
      task2: { text: task2Text, wordCount: countWords(task2Text) }
    };
    session.writingSelfScores = { task1: selfScores1, task2: selfScores2 };
    localStorage.setItem('ielts_session', JSON.stringify(session));
  }, [task1Text, task2Text, selfScores1, selfScores2]);

  const handleFinalSubmit = async () => {
    const raw = localStorage.getItem('ielts_session');
    if (!raw) return;
    const session = JSON.parse(raw);
    session.sectionTimes.writing.end = Date.now();
    session.writingData = {
      task1: { text: task1Text, wordCount: countWords(task1Text) },
      task2: { text: task2Text, wordCount: countWords(task2Text) }
    };
    session.writingSelfScores = { task1: selfScores1, task2: selfScores2 };
    session.testEndTime = Date.now();
    if (!session.completedSections.includes('writing')) session.completedSections.push('writing');
    localStorage.setItem('ielts_session', JSON.stringify(session));

    // Submit to backend
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          testStartTime: session.testStartTime,
          testEndTime: session.testEndTime,
          sectionTimes: session.sectionTimes,
          listeningAnswers: session.listeningAnswers,
          readingAnswers: session.readingAnswers,
          writingData: session.writingData,
          writingSelfScores: session.writingSelfScores
        })
      });
      const results = await response.json();
      localStorage.setItem('ielts_results', JSON.stringify(results));
    } catch (e) {
      console.error('Submit error', e);
    }

    router.push('/results');
  };

  const wc1 = countWords(task1Text);
  const wc2 = countWords(task2Text);
  const tasks = WRITING_TEST.tasks;

  const WordCountBadge = ({ count, min }) => (
    <div className="word-count-bar">
      <span>Word count: <span className={`count ${count >= min ? 'met' : count >= min * 0.8 ? 'warning' : ''}`}>{count}</span></span>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        {count < min ? `${min - count} more words needed` : `✓ Minimum met (${min}+)`}
      </span>
    </div>
  );

  return (
    <>
      <Head><title>Writing Test – IELTS MockTest</title></Head>
      <Navbar showTimer timerDuration={DURATION} onTimeUp={() => { setShowSubmitModal(true); }} sectionLabel="Writing" />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 80px' }}>
        {/* Section header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
          borderRadius: 16, color: 'white', padding: '20px 28px', marginBottom: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem' }}>✍️ Writing Test</h2>
              <p style={{ opacity: 0.8, fontSize: '0.875rem', marginTop: 4 }}>IELTS Academic | 2 Tasks | 60 Minutes</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Writing Phase', 'Self-Assessment'].map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setPhase(i === 0 ? 'writing' : 'assessment')}
                  style={{
                    padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: '0.85rem',
                    cursor: 'pointer', fontWeight: 500,
                    background: (phase === 'writing') === (i === 0) ? 'var(--gold)' : 'rgba(255,255,255,0.15)',
                    color: (phase === 'writing') === (i === 0) ? 'var(--navy-dark)' : 'rgba(255,255,255,0.8)'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {/* Task selector */}
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            {tasks.map((t, i) => (
              <button key={i} onClick={() => setActiveTask(i)} style={{
                padding: '6px 16px', borderRadius: 6, border: 'none', fontSize: '0.8rem', fontWeight: 500,
                cursor: 'pointer',
                background: activeTask === i ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                color: 'white', borderBottom: activeTask === i ? '2px solid var(--gold)' : '2px solid transparent'
              }}>
                {t.title}
              </button>
            ))}
          </div>
        </div>

        {phase === 'writing' ? (
          <div style={{ background: 'white', borderRadius: 16, boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            {/* Task prompt */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', background: '#fafbfc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ background: 'var(--navy)', color: 'white', padding: '4px 12px', borderRadius: 100, fontSize: '0.78rem', fontWeight: 600 }}>
                  {tasks[activeTask].type === 'task1' ? 'TASK 1' : 'TASK 2'}
                </span>
                <span style={{ background: 'var(--gold-light)', border: '1px solid var(--gold)', color: 'var(--warning)', padding: '4px 12px', borderRadius: 100, fontSize: '0.78rem' }}>
                  Recommended: {tasks[activeTask].timeRecommended} minutes
                </span>
                <span style={{ background: 'var(--navy-light)', color: 'var(--navy)', padding: '4px 12px', borderRadius: 100, fontSize: '0.78rem', border: '1px solid var(--border)' }}>
                  Min. {tasks[activeTask].wordLimit} words
                </span>
              </div>

              {activeTask === 0 && (
                <div className="chart-display">
                  <div style={{ marginBottom: 10, fontWeight: 600, color: 'var(--navy)' }}>📊 Internet Access by Country (2005–2020)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, maxWidth: 600, margin: '0 auto' }}>
                    {[
                      { label: 'Country A', start: '45%', end: '92%', color: '#003580' },
                      { label: 'Country B', start: '30%', end: '88%', color: '#c8a84b' },
                      { label: 'Country C', start: '15%', end: '71%', color: '#e63946' },
                      { label: 'Country D', start: '8%', end: '55%', color: '#2d6a4f' },
                    ].map(c => (
                      <div key={c.label} style={{ padding: 12, background: 'white', borderRadius: 8, border: `2px solid ${c.color}`, textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, color: c.color, fontSize: '0.85rem', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>2005: <strong>{c.start}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>2020: <strong>{c.end}</strong></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="writing-prompt">{tasks[activeTask].prompt}</div>
              <div className="writing-instruction"><strong>Instructions:</strong> {tasks[activeTask].instruction}</div>
            </div>

            {/* Text area */}
            <div style={{ padding: 28 }}>
              <textarea
                value={activeTask === 0 ? task1Text : task2Text}
                onChange={e => activeTask === 0 ? setTask1Text(e.target.value) : setTask2Text(e.target.value)}
                placeholder={activeTask === 0
                  ? "Begin your response here. Describe the main trends and make comparisons..."
                  : "Begin your essay here. Introduce the topic, discuss both views, and give your opinion..."}
                style={{
                  width: '100%', minHeight: activeTask === 0 ? 300 : 450,
                  padding: 16, borderRadius: 8, border: '1.5px solid var(--border)',
                  fontSize: '0.95rem', lineHeight: 1.8, resize: 'vertical',
                  fontFamily: 'DM Sans, sans-serif', outline: 'none'
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--navy)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              />
              <WordCountBadge count={activeTask === 0 ? wc1 : wc2} min={tasks[activeTask].wordLimit} />
            </div>
          </div>
        ) : (
          /* Self Assessment Phase */
          <div>
            <div style={{ background: 'var(--navy-light)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 24, fontSize: '0.9rem' }}>
              <strong>📝 Self-Assessment Guide:</strong> Rate your writing on each criterion using the official IELTS band descriptors. Be honest — this directly affects your estimated Writing band score.
            </div>

            {tasks.map((task, ti) => {
              const scores = ti === 0 ? selfScores1 : selfScores2;
              const setScores = ti === 0 ? setSelfScores1 : setSelfScores2;
              const text = ti === 0 ? task1Text : task2Text;
              const wc = ti === 0 ? wc1 : wc2;

              return (
                <div key={ti} style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', marginBottom: 24, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ background: 'var(--navy)', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: '1rem' }}>{task.title}</h3>
                    <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Word count: {wc}</span>
                  </div>

                  {/* Preview */}
                  {text ? (
                    <div style={{ padding: '16px 24px', background: '#fafbfc', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', lineHeight: 1.7, maxHeight: 120, overflowY: 'auto', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      {text.slice(0, 400)}{text.length > 400 ? '…' : ''}
                    </div>
                  ) : (
                    <div style={{ padding: '16px 24px', background: '#fafbfc', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No response written for this task.
                    </div>
                  )}

                  <div style={{ padding: 24 }}>
                    <div className="rubric-grid">
                      {CRITERIA.map(criterion => (
                        <div key={criterion} className="rubric-item">
                          <label>{CRITERIA_LABELS[criterion]}</label>
                          <select
                            value={scores[criterion]}
                            onChange={e => setScores(prev => ({ ...prev, [criterion]: parseFloat(e.target.value) }))}
                          >
                            {BAND_OPTIONS.map(b => (
                              <option key={b} value={b}>Band {b}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 16, padding: '10px 16px', background: 'var(--navy-light)', borderRadius: 8, fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Estimated Task Band</span>
                      <strong style={{ color: 'var(--navy)' }}>
                        Band {(Object.values(scores).reduce((a, b) => a + b, 0) / 4).toFixed(1)}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}

            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <button className="btn btn-gold btn-lg" onClick={() => setShowSubmitModal(true)}>
                Submit Complete Test & View Results →
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        {phase === 'writing' && (
          <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
            {activeTask === 0 ? (
              <button className="btn btn-primary" onClick={() => setActiveTask(1)}>
                Continue to Task 2 →
              </button>
            ) : (
              <button className="btn btn-gold" onClick={() => setPhase('assessment')}>
                Proceed to Self-Assessment →
              </button>
            )}
          </div>
        )}
      </div>

      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>Submit Complete Test?</h3>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 12, color: 'var(--text-secondary)' }}>
                Your complete test will be submitted to our backend for scoring.
              </p>
              <div style={{ background: 'var(--off-white)', borderRadius: 8, padding: 14, fontSize: '0.875rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <span>Task 1 words:</span><strong>{wc1}</strong>
                  <span>Task 2 words:</span><strong>{wc2}</strong>
                  <span>Task 1 band est.:</span><strong>{(Object.values(selfScores1).reduce((a, b) => a + b, 0) / 4).toFixed(1)}</strong>
                  <span>Task 2 band est.:</span><strong>{(Object.values(selfScores2).reduce((a, b) => a + b, 0) / 4).toFixed(1)}</strong>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline btn-sm" onClick={() => setShowSubmitModal(false)}>Cancel</button>
              <button className="btn btn-gold btn-sm" onClick={handleFinalSubmit}>Submit Test →</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
