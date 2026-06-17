'use client';

import { useRouter } from 'next/navigation';

export default function CommunityPage() {
  const router = useRouter();

  return (
    <>
      {/* Subpage Hero */}
      <section className="subpage-hero" style={{ backgroundImage: "url('/community_crew.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="subpage-hero-container">
          <h1 className="subpage-hero-title silver-text-glow">This Theater Is Powered by the People Who Build It</h1>
          <p className="subpage-hero-subtitle" style={{ color: 'var(--accent-white)' }}>
            Community isn't part of HCT. Community is HCT.
          </p>
        </div>
      </section>

      {/* Page Content */}
      <div className="community-content-flow">
        
        {/* YOU BELONG HERE */}
        <section className="section-wrapper">
          <div className="section-container">
            <div className="editorial-grid">
              <div className="editorial-text-pane">
                <span className="section-label">Belonging</span>
                <h2 className="section-headline" style={{ marginBottom: '1.5rem' }}>You Belong Here</h2>
                <p className="section-body">
                  Whether you're a performer, musician, volunteer, educator, designer, builder, or simply someone who believes in the arts, there is a place for you here.
                </p>
                <p className="section-body">
                  Every role matters. Every contribution matters. Every person matters. This is a place built for the community, by the community.
                </p>
              </div>

              <div className="editorial-image-pane">
                <div className="premium-image-container">
                  <img 
                    src="/community_crew.png" 
                    alt="Volunteers painting set backgrounds and building materials backstage at Hillsboro Civic Theater" 
                  />
                  <div className="spotlight-vignette" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BREATHING ROOM DIVIDER */}
        <div className="breathing-divider" />

        {/* EDUCATIONAL PROGRAMS */}
        <section className="section-wrapper">
          <div className="section-container">
            <div className="editorial-grid reverse">
              <div className="editorial-image-pane">
                <div className="premium-image-container">
                  <img 
                    src="/youth_education.png" 
                    alt="Young students interacting in a theatrical workshop lesson taught by professional directors" 
                  />
                  <div className="spotlight-vignette" />
                </div>
              </div>

              <div className="editorial-text-pane">
                <span className="section-label">Education</span>
                <h2 className="section-headline" style={{ marginBottom: '1.5rem' }}>Giving the Next Generation a Stage</h2>
                <p className="section-body">
                  We believe creativity changes lives. HCT is committed to developing educational opportunities that help young people discover confidence, expression, and connection through the performing arts.
                </p>
                <p className="section-body">
                  Our workshops and youth acting labs provide training in voice, movement, design, and performance, giving young artists the space to express themselves.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BREATHING ROOM DIVIDER */}
        <div className="breathing-divider" />

        {/* PARTNERSHIPS (CINEMATIC FULL-WIDTH BANNER) */}
        <section className="parallax-banner-section" style={{ backgroundImage: "url('/orchestra_musicians.png')", height: '60vh' }}>
          <div className="parallax-banner-overlay" />
          <div className="section-container" style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
            <div className="glass-overlay-card" style={{ maxWidth: '750px', margin: '0 auto' }}>
              <span className="section-label">Partnerships</span>
              <h2 className="section-headline silver-text-glow" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '1rem 0' }}>
                Building Together
              </h2>
              <p className="section-body" style={{ color: 'var(--secondary-silver)', fontSize: '1.05rem', marginBottom: '2rem' }}>
                We're seeking partnerships with local businesses, schools, organizations, and community leaders who share our vision for a thriving arts community.
              </p>
              <div className="cta-group" style={{ justifyContent: 'center' }}>
                <button 
                  onClick={() => router.push('/get-involved')} 
                  className="cta-button cta-button-primary"
                >
                  Inquire About Partnerships
                </button>
                <button 
                  onClick={() => router.push('/about')} 
                  className="cta-button cta-button-secondary"
                >
                  Read Our Story
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .community-content-flow {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </>
  );
}
