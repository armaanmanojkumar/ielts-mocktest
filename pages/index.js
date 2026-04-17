import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const router = useRouter();

  const startFullTest = () => {
    const sessionId = uuidv4();
    localStorage.setItem('ielts_session', JSON.stringify({
      sessionId,
      testStartTime: Date.now(),
      sectionTimes: {},
      listeningAnswers: {},
      readingAnswers: {},
      writingData: {},
      writingSelfScores: {},
      completedSections: []
    }));
    router.push('/instructions');
  };

  return (
    <>
      <Head>
        <title>IELTS Mock Test – IDP Style Practice</title>
        <meta name="description" content="Full IELTS Academic mock test with real exam conditions, timers, and band score results." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <nav className="navbar">
        <div className="navbar-brand">
          <div className="logo-icon">I</div>
          <div>
            <h1>IELTS MockTest</h1>
            <span>IDP-Style Academic Assessment</span>
          </div>
        </div>
        <button className="btn btn-gold btn-sm" onClick={startFullTest}>
          Start Full Test
        </button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="badge">Academic Module • Full Length</div>
        <h1>Prepare for IELTS with<br />Authentic Exam Conditions</h1>
        <p>
          Four complete sections — Listening, Reading, Writing — with real timers,
          auto-grading, and detailed band score results. Just like the real exam.
        </p>
        <button className="btn btn-gold btn-lg" onClick={startFullTest}>
          Begin Full Mock Test →
        </button>
      </section>

      {/* Test Modules */}
      <div className="test-modules">
        {[
          {
            icon: "🎧",
            title: "Listening",
            desc: "4 parts, 40 questions. Audio narrated via browser speech synthesis. Real-time transcript display.",
            time: "30 min",
            questions: "40 Qs",
            path: "/test/listening"
          },
          {
            icon: "📖",
            title: "Reading",
            desc: "3 academic passages, 40 questions. True/False/NG, MCQ, sentence completion.",
            time: "60 min",
            questions: "40 Qs",
            path: "/test/reading"
          },
          {
            icon: "✍️",
            title: "Writing",
            desc: "Task 1: Graph description. Task 2: Academic essay. Word counter and self-assessment rubric.",
            time: "60 min",
            questions: "2 Tasks",
            path: "/test/writing"
          },
          {
            icon: "📊",
            title: "Results",
            desc: "Detailed band scores, time analytics, question-by-question breakdown and improvement tips.",
            time: "Instant",
            questions: "All sections",
            path: "/results"
          }
        ].map(mod => (
          <div key={mod.title} className="module-card" onClick={() => router.push(mod.path)}>
            <div className="module-icon">{mod.icon}</div>
            <h3>{mod.title}</h3>
            <p>{mod.desc}</p>
            <div className="module-meta">
              <span className="meta-tag">⏱ {mod.time}</span>
              <span className="meta-tag">📝 {mod.questions}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section style={{ maxWidth: 1000, margin: '60px auto', padding: '0 24px 80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: 40, color: 'var(--navy)' }}>
          What Makes This Different
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[
            { icon: "⏱", title: "Real Exam Timers", desc: "Countdown timers per section with colour-coded warnings when time is running low." },
            { icon: "🎙", title: "Audio Listening", desc: "Browser speech synthesis reads the listening transcripts aloud — no audio files needed." },
            { icon: "📈", title: "Backend Scoring", desc: "Your answers are sent to our API which calculates official IELTS band scores with time tracking." },
            { icon: "📋", title: "Question Review", desc: "After submission, see every question, your answer, and the correct answer with explanations." },
            { icon: "🕐", title: "Time Analytics", desc: "See exactly how long you spent on each section vs. the recommended time allocation." },
            { icon: "🎯", title: "Band Descriptors", desc: "Results match official IELTS band descriptors from Expert User (9) to Intermittent User (2)." },
          ].map(f => (
            <div key={f.title} style={{ padding: 20, background: 'white', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{f.icon}</div>
              <h4 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, marginBottom: 6, fontSize: '0.95rem' }}>{f.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', fontSize: '0.85rem' }}>
        <p>IELTS MockTest — For practice purposes only. Not affiliated with IDP, British Council, or Cambridge Assessment English.</p>
      </footer>
    </>
  );
}
