export default function CSSTestPage() {
  return (
    <div className="test-page">
      <div className="test-card">
        <h1 className="test-title">🎉 CSS is Working!</h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          If you can see this styled properly, CSS is loading correctly!
        </p>
        <button className="test-button">
          Test Button
        </button>
      </div>
    </div>
  )
}
