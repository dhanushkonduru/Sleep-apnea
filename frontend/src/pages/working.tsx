export default function WorkingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #1e40af 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '200px',
          height: '200px',
          background: 'rgba(147, 51, 234, 0.3)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '100px',
          right: '50px',
          width: '150px',
          height: '150px',
          background: 'rgba(59, 130, 246, 0.3)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite 2s'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '50px',
          left: '25%',
          width: '180px',
          height: '180px',
          background: 'rgba(236, 72, 153, 0.3)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite 4s'
        }}></div>
      </div>

      {/* Header */}
      <header style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '1.5rem 0'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                color: '#f87171',
                animation: 'pulse 2s infinite'
              }}>❤️</div>
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '1rem',
                height: '1rem',
                color: '#fbbf24',
                animation: 'bounce 1s infinite'
              }}>✨</div>
            </div>
            <div>
              <h1 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #ffffff, #bfdbfe)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>SleepApnea AI</h1>
              <p style={{ fontSize: '0.875rem', color: '#bfdbfe' }}>Advanced Sleep Analysis</p>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="#features" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontWeight: '500' }}>Features</a>
            <a href="#demo" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontWeight: '500' }}>Demo</a>
            <a href="#about" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontWeight: '500' }}>About</a>
            <button style={{
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s'
            }}>Get Started</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '8rem 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1rem',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '9999px',
            padding: '0.5rem 1rem',
            marginBottom: '1.5rem'
          }}>
            <span style={{ color: '#fbbf24' }}>⚡</span>
            <span style={{ color: 'white', fontWeight: '500' }}>AI-Powered Medical Technology</span>
            <span style={{ color: '#fbbf24' }}>⭐</span>
          </div>
          
          <h1 style={{
            fontSize: '4.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            lineHeight: '1'
          }}>
            <span style={{
              background: 'linear-gradient(to right, #ffffff, #bfdbfe, #c084fc)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>Sleep Apnea</span>
            <br />
            <span style={{
              background: 'linear-gradient(to right, #60a5fa, #a855f7)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>Detection AI</span>
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            color: '#dbeafe',
            marginBottom: '2rem',
            maxWidth: '1024px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            Revolutionary machine learning technology that detects sleep apnea events 
            from audio recordings with <span style={{ color: '#fbbf24', fontWeight: '600' }}>99.2% accuracy</span>. 
            Get instant analysis and personalized health insights.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            justifyContent: 'center',
            marginBottom: '3rem'
          }}>
            <button style={{
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              color: 'white',
              padding: '1rem 2.5rem',
              borderRadius: '1rem',
              fontSize: '1.125rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              margin: '0 auto'
            }}>
              <span>▶️</span>
              <span>Try Live Demo</span>
              <span>→</span>
            </button>
            
            <button style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '1rem 2.5rem',
              borderRadius: '1rem',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              margin: '0 auto'
            }}>
              <span>🎤</span>
              <span>Record Audio</span>
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            maxWidth: '1024px',
            margin: '0 auto'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>99.2%</div>
              <div style={{ color: '#bfdbfe' }}>Accuracy Rate</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>10,000+</div>
              <div style={{ color: '#bfdbfe' }}>Analyses Completed</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>2.3s</div>
              <div style={{ color: '#bfdbfe' }}>Average Analysis Time</div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
