import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import QuestionNav from '../../components/QuestionNav';
import { READING_TEST } from '../../lib/questions';

const DURATION = READING_TEST.duration;

export default function ReadingTest() {
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [activePassage, setActivePassage] = useState(0);
  const [currentQ, setCurrentQ] = useState(1);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('ielts_session');
    if (!raw) { router.replace('/'); return; }
    const session = JSON.parse(raw);
    if (session.readingAnswers) setAnswers(session.readingAnswers);
    session.sectionTimes = session.sectionTimes || {};
    session.sectionTimes.reading = { start: Date.now() };
    localStorage.setItem('ielts_session', JSON.stringify(session));
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem('ielts_session');
    if (!raw) return;
    const session = JSON.parse(raw);
    session.readingAnswers = answers;
    localStorage.setItem('ielts_session', JSON.stringify(session));
  }, [answers]);

  const setAnswer = (qId, value) => setAnswers(prev => ({ ...prev, [qId]: value }));

  const handleSubmit = () => {
    const raw = localStorage.getItem('ielts_session');
    if (!raw) return;
    const session = JSON.parse(raw);
    session.sectionTimes.reading.end = Date.now();
    session.readingAnswers = answers;
    if (!session.completedSections.includes('reading')) session.completedSections.push('reading');
    localStorage.setItem('ielts_session', JSON.stringify(session));
    router.push('/test/writing');
  };

  const answeredCount = Object.keys(answers).filter(k => answers[k] !== '').length;
  const passage = READING_TEST.passages[activePassage];

  const renderQuestion = (q) => {
    if (q.type === 'tfng') {
      return (
        <div className="tfng-options">
          {['TRUE', 'FALSE', 'NOT GIVEN'].map(opt => (
            <button
              key={opt}
              className={`tfng-btn ${answers[q.id] === opt ? `selected-${opt === 'TRUE' ? 'true' : opt === 'FALSE' ? 'false' : 'ng'}` : ''}`}
              onClick={() => setAnswer(q.id, opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      );
    }
    if (q.type === 'multiple_choice') {
      return (
        <div className="options-grid">
          {q.options.map(opt => (
            <label key={opt} className={`option-label ${answers[q.id] === opt[0] ? 'selected' : ''}`}>
              <input
                type="radio"
                name={`q${q.id}`}
                value={opt[0]}
                checked={answers[q.id] === opt[0]}
                onChange={() => setAnswer(q.id, opt[0])}
              />
              {opt}
            </label>
          ))}
        </div>
      );
    }
    if (q.type === 'sentence_completion') {
      return (
        <input
          className="fill-input"
          type="text"
          placeholder="Complete the sentence..."
          value={answers[q.id] || ''}
          onChange={e => setAnswer(q.id, e.target.value)}
        />
      );
    }
    return null;
  };

  // Cumulative question offsets
  const passageOffsets = [1, 14, 28];

  return (
    <>
      <Head><title>Reading Test – IELTS MockTest</title></Head>
      <Navbar showTimer timerDuration={DURATION} onTimeUp={handleSubmit} sectionLabel="Reading" />

      <div className="exam-layout">
        {/* Main */}
        <div className="exam-main">
          <div className="exam-section-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2>📖 Reading Test</h2>
                <p>IELTS Academic | 3 Passages | 40 Questions | 60 Minutes</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                <div style={{ color: 'var(--gold)', fontWeight: 600 }}>{answeredCount}/40</div>
                <div style={{ opacity: 0.7 }}>Answered</div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {READING_TEST.passages.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePassage(i)}
                    style={{
                      padding: '6px 14px', borderRadius: 6, border: 'none', fontSize: '0.8rem',
                      fontWeight: 500, cursor: 'pointer',
                      background: activePassage === i ? 'var(--gold)' : 'rgba(255,255,255,0.15)',
                      color: activePassage === i ? 'var(--navy-dark)' : 'rgba(255,255,255,0.8)',
                      transition: 'all 0.15s'
                    }}
                  >
                    Passage {p.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Passage */}
          <div className="passage-container">
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 16, color: 'var(--navy)' }}>
              {passage.title}
            </h3>
            {passage.text.split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: 14 }}>{para}</p>
            ))}
          </div>

          {/* Questions */}
          <div className="questions-container">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, color: 'var(--navy)', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
              Questions {passageOffsets[activePassage]}–{passageOffsets[activePassage] + passage.questions.length - 1}
            </h3>

            {/* Type instruction */}
            {passage.questions.some(q => q.type === 'tfng') && (
              <div style={{ background: 'var(--navy-light)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <strong>TRUE/FALSE/NOT GIVEN:</strong> TRUE = the statement agrees with the passage. FALSE = it contradicts the passage. NOT GIVEN = the information is not in the passage.
              </div>
            )}

            {passage.questions.map(q => (
              <div key={q.id} className="question-item" id={`q-${q.id}`}>
                <div className="question-text">
                  <span className="question-number">{q.id}</span>
                  <span>{q.text}</span>
                </div>
                {renderQuestion(q)}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="exam-sidebar">
          <QuestionNav
            total={40}
            answered={answers}
            current={currentQ}
            onNavigate={(n) => {
              setCurrentQ(n);
              let passageIdx = 0;
              if (n >= 28) passageIdx = 2;
              else if (n >= 14) passageIdx = 1;
              setActivePassage(passageIdx);
              setTimeout(() => document.getElementById(`q-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            }}
          />

          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => {
              if (activePassage < 2) setActivePassage(a => a + 1);
              else setShowSubmitModal(true);
            }}
          >
            {activePassage < 2 ? `Next Passage →` : 'Submit Reading →'}
          </button>

          <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <p style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: 8 }}>💡 Tips</p>
            <ul style={{ paddingLeft: 16, lineHeight: 2 }}>
              <li>Skim passage first, then read questions</li>
              <li>T/F/NG: base answer ONLY on text</li>
              <li>Scan for key words from questions</li>
              <li>Watch out for qualifiers (always, never, some)</li>
            </ul>
          </div>

          {/* Passage progress per-passage */}
          <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid var(--border)', fontSize: '0.82rem' }}>
            <p style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: 12 }}>Progress by Passage</p>
            {READING_TEST.passages.map((p, i) => {
              const start = passageOffsets[i];
              const end = start + p.questions.length;
              const done = p.questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== '').length;
              return (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: 'var(--text-secondary)' }}>
                    <span>Passage {i + 1}</span>
                    <span style={{ fontWeight: 600 }}>{done}/{p.questions.length}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: done === p.questions.length ? 'var(--success)' : 'var(--navy)', width: `${(done / p.questions.length) * 100}%`, transition: 'width 0.3s', borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>Submit Reading Section?</h3>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>
                You have answered <strong>{answeredCount} of 40</strong> questions.
                {answeredCount < 40 && ` ${40 - answeredCount} unanswered.`}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                You will proceed to the Writing section. You cannot return to Reading.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline btn-sm" onClick={() => setShowSubmitModal(false)}>Review Answers</button>
              <button className="btn btn-primary btn-sm" onClick={handleSubmit}>Submit & Continue →</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
