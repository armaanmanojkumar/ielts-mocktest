import Head from 'next/head';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import QuestionNav from '../../components/QuestionNav';
import { LISTENING_TEST } from '../../lib/questions';

const DURATION = LISTENING_TEST.duration;

export default function ListeningTest() {
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [currentPart, setCurrentPart] = useState(0);
  const [audioState, setAudioState] = useState('idle'); // idle | playing | done
  const [audioProgress, setAudioProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentQ, setCurrentQ] = useState(1);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const utteranceRef = useRef(null);
  const startTimeRef = useRef(null);

  // Init session
  useEffect(() => {
    const raw = localStorage.getItem('ielts_session');
    if (!raw) { router.replace('/'); return; }
    const session = JSON.parse(raw);
    if (session.listeningAnswers) setAnswers(session.listeningAnswers);
    // Record section start
    session.sectionTimes = session.sectionTimes || {};
    session.sectionTimes.listening = { start: Date.now() };
    localStorage.setItem('ielts_session', JSON.stringify(session));
    startTimeRef.current = Date.now();
  }, []);

  // Save answers to session
  useEffect(() => {
    const raw = localStorage.getItem('ielts_session');
    if (!raw) return;
    const session = JSON.parse(raw);
    session.listeningAnswers = answers;
    localStorage.setItem('ielts_session', JSON.stringify(session));
  }, [answers]);

  const setAnswer = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const currentPartData = LISTENING_TEST.parts[currentPart];

  const playAudio = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setAudioState('playing');
    setAudioProgress(0);

    const text = currentPartData.transcript;
    const words = text.split(' ');
    let wordIndex = 0;

    const speak = (chunk) => {
      const utter = new SpeechSynthesisUtterance(chunk);
      utter.rate = 0.92;
      utter.pitch = 1.0;
      utter.lang = 'en-GB';

      const voices = window.speechSynthesis.getVoices();
      const gbVoice = voices.find(v => v.lang === 'en-GB') || voices[0];
      if (gbVoice) utter.voice = gbVoice;

      utter.onboundary = (e) => {
        if (e.name === 'word') {
          wordIndex++;
          setAudioProgress(Math.min(100, Math.round((wordIndex / words.length) * 100)));
        }
      };

      utter.onend = () => {
        setAudioState('done');
        setAudioProgress(100);
        setShowTranscript(true);
      };

      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
    };

    speak(text);
  }, [currentPartData]);

  const stopAudio = () => {
    window.speechSynthesis?.cancel();
    setAudioState('done');
    setShowTranscript(true);
  };

  const handleTimeUp = () => {
    setTimeUp(true);
    window.speechSynthesis?.cancel();
    handleSubmit(true);
  };

  const handleSubmit = async (auto = false) => {
    window.speechSynthesis?.cancel();
    const raw = localStorage.getItem('ielts_session');
    if (!raw) return;
    const session = JSON.parse(raw);
    session.sectionTimes.listening.end = Date.now();
    session.listeningAnswers = answers;
    if (!session.completedSections.includes('listening')) {
      session.completedSections.push('listening');
    }
    localStorage.setItem('ielts_session', JSON.stringify(session));
    router.push('/test/reading');
  };

  const allQuestions = LISTENING_TEST.parts.flatMap(p => p.questions);
  const answeredCount = Object.keys(answers).filter(k => answers[k] !== '').length;

  const renderQuestion = (q) => {
    switch (q.type) {
      case 'multiple_choice':
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
      case 'form_completion':
        return (
          <input
            className="fill-input"
            type="text"
            placeholder="Type your answer..."
            value={answers[q.id] || ''}
            onChange={e => setAnswer(q.id, e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head><title>Listening Test – IELTS MockTest</title></Head>
      <Navbar
        showTimer
        timerDuration={DURATION}
        onTimeUp={handleTimeUp}
        sectionLabel="Listening"
      />

      <div className="exam-layout">
        {/* Main Content */}
        <div className="exam-main">
          <div className="exam-section-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2>🎧 Listening Test</h2>
                <p>IELTS Academic | 4 Parts | 40 Questions | 30 Minutes</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                <div style={{ color: 'var(--gold)', fontWeight: 600 }}>{answeredCount}/40</div>
                <div style={{ opacity: 0.7 }}>Answered</div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {LISTENING_TEST.parts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPart(i)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 6,
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      background: currentPart === i ? 'var(--gold)' : 'rgba(255,255,255,0.15)',
                      color: currentPart === i ? 'var(--navy-dark)' : 'rgba(255,255,255,0.8)',
                      transition: 'all 0.15s'
                    }}
                  >
                    Part {p.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audio Panel */}
          <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)' }}>
            <div className="audio-panel">
              <div style={{ marginBottom: 12, fontSize: '0.85rem', opacity: 0.8 }}>
                <strong style={{ color: 'var(--gold)' }}>{currentPartData.title}</strong>
                <span style={{ marginLeft: 8, opacity: 0.7 }}>— {currentPartData.description}</span>
              </div>
              <div className="audio-controls">
                <button
                  className="play-btn"
                  onClick={audioState === 'playing' ? stopAudio : playAudio}
                  title={audioState === 'playing' ? 'Stop audio' : 'Play audio'}
                >
                  {audioState === 'playing' ? '■' : '▶'}
                </button>
                <div style={{ flex: 1 }}>
                  <div className="audio-progress">
                    <div className="audio-progress-fill" style={{ width: `${audioProgress}%` }} />
                  </div>
                </div>
                <div className="speaking-indicator">
                  {audioState === 'playing' ? (
                    <>
                      <span className="dot pulse"/>
                      <span className="dot pulse" style={{ animationDelay: '0.2s' }}/>
                      <span className="dot pulse" style={{ animationDelay: '0.4s' }}/>
                      <span style={{ marginLeft: 4 }}>Playing...</span>
                    </>
                  ) : audioState === 'done' ? (
                    <span style={{ color: '#4ade80' }}>✓ Complete</span>
                  ) : (
                    <span style={{ opacity: 0.6 }}>Press ▶ to listen</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.78rem', opacity: 0.6 }}>
                  🔊 Uses browser speech synthesis. Turn up your volume. Audio plays once.
                </p>
                <button
                  onClick={() => setShowTranscript(s => !s)}
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: 6, padding: '4px 12px', fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  {showTranscript ? 'Hide' : 'Show'} Transcript
                </button>
              </div>
            </div>
            {showTranscript && (
              <div style={{ marginTop: 12, padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid var(--border)', fontSize: '0.875rem', lineHeight: 1.8, maxHeight: 200, overflowY: 'auto', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                {currentPartData.transcript.split('\n').map((line, i) => (
                  <p key={i} style={{ marginBottom: 6 }}>{line}</p>
                ))}
              </div>
            )}
          </div>

          {/* Questions */}
          <div className="questions-container">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 24, color: 'var(--navy)', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
              Questions {currentPartData.questions[0].id}–{currentPartData.questions[currentPartData.questions.length - 1].id}
            </h3>
            {currentPartData.questions.map(q => (
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
              // Find which part
              let partIdx = 0;
              let cumulative = 0;
              for (let i = 0; i < LISTENING_TEST.parts.length; i++) {
                cumulative += LISTENING_TEST.parts[i].questions.length;
                if (n <= cumulative) { partIdx = i; break; }
              }
              setCurrentPart(partIdx);
              setTimeout(() => {
                document.getElementById(`q-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
            }}
          />

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-outline btn-sm"
              style={{ flex: 1 }}
              onClick={() => setCurrentPart(Math.max(0, currentPart - 1))}
              disabled={currentPart === 0}
            >
              ← Prev Part
            </button>
            <button
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
              onClick={() => {
                if (currentPart < LISTENING_TEST.parts.length - 1) {
                  setCurrentPart(currentPart + 1);
                } else {
                  setShowSubmitModal(true);
                }
              }}
            >
              {currentPart < LISTENING_TEST.parts.length - 1 ? 'Next Part →' : 'Submit →'}
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <p style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: 8 }}>💡 Tips</p>
            <ul style={{ paddingLeft: 16, lineHeight: 2 }}>
              <li>Read questions before listening</li>
              <li>Listen for exact words and numbers</li>
              <li>Spelling matters in form completion</li>
              <li>Don&apos;t leave blanks — guess if unsure</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>Submit Listening Section?</h3>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>
                You have answered <strong>{answeredCount} of 40</strong> questions.
                {answeredCount < 40 && ` You have ${40 - answeredCount} unanswered question(s).`}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Once submitted, you will move to the Reading section. You cannot return to Listening.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline btn-sm" onClick={() => setShowSubmitModal(false)}>Review Answers</button>
              <button className="btn btn-primary btn-sm" onClick={() => handleSubmit(false)}>Submit & Continue →</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
