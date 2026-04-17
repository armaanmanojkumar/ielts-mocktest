import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Instructions() {
  const router = useRouter();

  return (
    <>
      <Head><title>Test Instructions – IELTS MockTest</title></Head>
      <Navbar />

      <div style={{ maxWidth: 760, margin: '40px auto', padding: '0 24px 80px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="badge" style={{ background: 'var(--navy-light)', border: '1px solid var(--navy)', color: 'var(--navy)' }}>
            IMPORTANT INFORMATION
          </div>
          <h1 style={{ fontSize: '2rem', color: 'var(--navy)', marginTop: 16, marginBottom: 12 }}>
            Before You Begin
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Read these instructions carefully. This test simulates real IELTS exam conditions.
          </p>
        </div>

        {/* Test Overview */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h2 style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: '1rem' }}>📋 Test Structure</h2>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--off-white)' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Section</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Time</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Questions</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Format</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { sec: '🎧 Listening', time: '30 min', qs: '40', fmt: '4 parts, multiple formats' },
                  { sec: '📖 Reading', time: '60 min', qs: '40', fmt: '3 passages, mixed types' },
                  { sec: '✍️ Writing', time: '60 min', qs: '2 tasks', fmt: 'Graph + Essay' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 500 }}>{row.sec}</td>
                    <td style={{ padding: '14px 20px' }}>{row.time}</td>
                    <td style={{ padding: '14px 20px' }}>{row.qs}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{row.fmt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rules */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--navy)', marginBottom: 20 }}>Exam Rules</h2>
          <div className="instruction-steps">
            {[
              { n: 1, title: "Timer is strictly enforced", body: "Each section has its own countdown timer. When time expires, you will be automatically moved to the next section. The total time for each section matches the real IELTS exam." },
              { n: 2, title: "Listening uses browser speech", body: "The listening section uses your browser's text-to-speech feature. Ensure your volume is turned up. You will hear each part once — just like the real test. You can play each part once only." },
              { n: 3, title: "Do not refresh the page", body: "Your answers are saved automatically in your session. However, refreshing or closing the browser mid-test may cause data loss. Complete each section in one sitting." },
              { n: 4, title: "Answer all questions", body: "There is no penalty for incorrect answers. Attempt every question — even an educated guess is better than leaving a blank." },
              { n: 5, title: "Writing is self-assessed", body: "Your written responses are recorded, and you will rate yourself on the four official IELTS writing criteria. This contributes to your overall band score estimate." },
              { n: 6, title: "Results are calculated server-side", body: "When you submit, your answers and timing data are sent to our backend which calculates official band scores, time analytics, and generates your personalised feedback report." },
            ].map(s => (
              <div key={s.n} className="instruction-step">
                <div className="step-number">{s.n}</div>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>{s.title}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System check */}
        <div style={{ background: 'var(--gold-light)', border: '1px solid var(--gold)', borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <h3 style={{ fontSize: '1rem', fontFamily: 'DM Sans', fontWeight: 600, marginBottom: 12, color: 'var(--navy)' }}>
            ⚙️ System Requirements
          </h3>
          <ul style={{ paddingLeft: 20, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li>Modern browser (Chrome, Firefox, Safari, or Edge)</li>
            <li>Speech synthesis enabled for Listening section (check browser settings)</li>
            <li>Stable internet connection (for submitting answers)</li>
            <li>Recommended: use a laptop or desktop for best experience</li>
          </ul>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => router.push('/test/listening')}
          >
            I Understand – Begin Listening Test →
          </button>
          <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            The timer starts immediately when you enter the first section.
          </p>
        </div>
      </div>
    </>
  );
}
