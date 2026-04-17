import { useState, useEffect, useRef } from 'react';

export default function Timer({ durationSeconds, onTimeUp, onTick, label = "Time Remaining" }) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const newRemaining = Math.max(0, durationSeconds - elapsed);
      setRemaining(newRemaining);
      if (onTick) onTick(elapsed);
      if (newRemaining === 0) {
        clearInterval(intervalRef.current);
        if (onTimeUp) onTimeUp();
      }
    }, 500);
    return () => clearInterval(intervalRef.current);
  }, [durationSeconds]);

  const hours = Math.floor(remaining / 3600);
  const mins = Math.floor((remaining % 3600) / 60);
  const secs = remaining % 60;

  const isWarning = remaining <= 300 && remaining > 60;
  const isCritical = remaining <= 60;

  const display = hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className={`exam-timer ${isWarning ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </svg>
      <div>
        <div className="timer-label">{label}</div>
        <div className="timer-value">{display}</div>
      </div>
    </div>
  );
}
