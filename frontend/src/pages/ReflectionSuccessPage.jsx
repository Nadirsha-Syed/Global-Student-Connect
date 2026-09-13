export default function ReflectionSuccessPage({ onNavigate }) {
  return (
    <section className="success-page">
      <div className="success-card">
        <div className="success-icon" aria-hidden="true">✓</div>
        <p className="eyebrow success-label">Completed</p>
        <h1>Reflection submitted successfully</h1>
        <p className="success-copy">
          Your conversation was completed and your reflection has been recorded. You can return to the dashboard to continue exploring new matches.
        </p>

        <div className="success-actions">
          <button type="button" className="primary-button" onClick={() => onNavigate('/')}>Back to Dashboard</button>
        </div>
      </div>
    </section>
  );
}
