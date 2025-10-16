export default function InlineTestPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1e40af',
          marginBottom: '1rem'
        }}>
          🎉 Inline CSS Works!
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          If you can see this styled properly, the issue is with Tailwind CSS compilation.
        </p>
        <button style={{
          background: '#3b82f6',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer'
        }}>
          Test Button
        </button>
      </div>
    </div>
  )
}
