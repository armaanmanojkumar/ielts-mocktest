import Timer from './Timer';

export default function Navbar({ showTimer, timerDuration, onTimeUp, onTick, sectionLabel }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="logo-icon">I</div>
        <div>
          <h1>IELTS MockTest</h1>
          <span>Powered by IDP-style Assessment</span>
        </div>
      </div>
      {showTimer && (
        <Timer
          durationSeconds={timerDuration}
          onTimeUp={onTimeUp}
          onTick={onTick}
          label={sectionLabel || "Time Remaining"}
        />
      )}
    </nav>
  );
}
