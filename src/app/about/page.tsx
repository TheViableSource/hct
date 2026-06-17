'use client';

import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  return (
    <>
      {/* Subpage Hero */}
      <section className="subpage-hero" style={{ backgroundImage: "url('/theater_architecture.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="subpage-hero-container">
          <h1 className="subpage-hero-title silver-text-glow">Building a Theater. Building a Community.</h1>
          <p className="subpage-hero-subtitle" style={{ color: 'var(--accent-white)' }}>
            Hillsboro Civic Theater began with a simple idea: A growing community deserves a place where people can create, perform, connect, and be inspired together.
          </p>
        </div>
      </section>

      {/* Page Content */}
      <div className="about-content-flow">
        
        {/* OUR STORY */}
        <section className="section-wrapper">
          <div className="section-container">
            <div className="editorial-grid">
              <div className="editorial-text-pane">
                <span className="section-label">Our Story</span>
                <h2 className="section-headline" style={{ marginBottom: '1.5rem' }}>How HCT Began</h2>
                <p className="section-body">
                  HCT was founded by people who believe that world-class storytelling shouldn't only exist in major cities. We believe Hillsboro deserves a place where creativity, performance, and community can thrive together.
                </p>
                <p className="section-body">
                  We're at the beginning of that journey. The stage is still being built. The story is just beginning.
                </p>
              </div>

              <div className="editorial-image-pane">
                <div className="premium-image-container">
                  <img 
                    src="/backstage_craft.png" 
                    alt="Artistic closeup of production materials, sketches and crafts backstage at HCT" 
                  />
                  <div className="spotlight-vignette" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BREATHING ROOM DIVIDER */}
        <div className="breathing-divider" />

        {/* OUR MISSION (CINEMATIC FOCUS OVERLAY BANNER) */}
        <section className="parallax-banner-section" style={{ backgroundImage: "url('/performance_moment.png')", height: '65vh' }}>
          <div className="parallax-banner-overlay" />
          <div className="section-container" style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
            <div className="glass-overlay-card" style={{ maxWidth: '850px', margin: '0 auto' }}>
              <span className="section-label" style={{ marginBottom: '1.5rem' }}>Our Mission</span>
              <h2 className="section-headline silver-text-glow" style={{ 
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', 
                fontStyle: 'italic', 
                lineHeight: '1.35',
                margin: '0 auto',
                fontWeight: 300,
                color: 'var(--accent-white)'
              }}>
                "To create a permanent home for creativity, storytelling, and artistic participation that is professional in quality, community-powered in spirit, and accessible to all."
              </h2>
            </div>
          </div>
        </section>

        {/* BREATHING ROOM DIVIDER */}
        <div className="breathing-divider" />

        {/* OUR VISION */}
        <section className="section-wrapper" style={{ borderBottom: 'none' }}>
          <div className="section-container">
            <div className="editorial-grid reverse">
              <div className="editorial-image-pane">
                <div className="premium-image-container">
                  <img 
                    src="/theater_architecture.png" 
                    alt="Looking out into the architectural curves and balcony layout of the theater venue" 
                  />
                  <div className="spotlight-vignette" />
                </div>
              </div>

              <div className="editorial-text-pane">
                <span className="section-label">Our Vision</span>
                <h2 className="section-headline" style={{ marginBottom: '1.5rem' }}>What We're Building Together</h2>
                <p className="section-body">
                  We envision a future where Hillsboro Civic Theater becomes a cornerstone of community life. A place where audiences gather, artists grow, stories are shared, and generations create memories together.
                </p>
                <div className="cta-group" style={{ marginTop: '2.5rem' }}>
                  <button 
                    onClick={() => router.push('/get-involved')} 
                    className="cta-button cta-button-primary"
                  >
                    Join the Founding Team
                  </button>
                  <button 
                    onClick={() => router.push('/donate')} 
                    className="cta-button cta-button-secondary"
                  >
                    Support the Vision
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .about-content-flow {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </>
  );
}
