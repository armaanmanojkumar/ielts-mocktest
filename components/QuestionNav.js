export default function QuestionNav({ total, answered, current, onNavigate, startFrom = 1 }) {
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
          <span>Questions</span>
          <span style={{ fontWeight: 600 }}>{Object.keys(answered).length}/{total} answered</span>
        </div>
        <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--navy)', borderRadius: 2, width: `${(Object.keys(answered).length / total) * 100}%`, transition: 'width 0.3s' }} />
        </div>
      </div>
      <div className="question-nav">
        {Array.from({ length: total }, (_, i) => {
          const qNum = startFrom + i;
          const isAnswered = answered[qNum] !== undefined && answered[qNum] !== '';
          const isCurrent = current === qNum;
          return (
            <button
              key={qNum}
              className={`qnav-btn ${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''}`}
              onClick={() => onNavigate(qNum)}
            >
              {qNum}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, background: 'var(--navy)', borderRadius: 2, display: 'inline-block' }}/>
            Answered
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, background: 'var(--gold)', borderRadius: 2, display: 'inline-block' }}/>
            Current
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, background: 'var(--border)', borderRadius: 2, display: 'inline-block' }}/>
            Unanswered
          </span>
        </div>
      </div>
    </div>
  );
}
