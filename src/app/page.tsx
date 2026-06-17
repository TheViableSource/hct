'use client';

import { useRouter } from 'next/navigation';
import HeroSequence from '@/components/HeroSequence';

export default function Home() {
  const router = useRouter();

  return (
    <>
      {/* Cinematic Hero Sequence */}
      <HeroSequence />

      {/* Main Page Content */}
      <div className="home-content-flow">
        
        {/* SECTION 1: OUR MISSION */}
        <section id="mission" className="section-wrapper">
          <div className="section-container">
            <div className="editorial-grid">
              <div className="editorial-text-pane">
                <span className="section-label">Our Mission</span>
                <h2 className="section-headline" style={{ marginBottom: '1.5rem' }}>
                  Great theater doesn't happen somewhere else. It happens here.
                </h2>
                <p className="section-body">
                  Hillsboro Civic Theater is building a place where creativity, collaboration, and storytelling can thrive.
                </p>
                <p className="section-body">
                  We believe every community deserves access to inspiring live performance and opportunities to participate in the arts. From large-scale musicals with full orchestras to intimate productions that bring people together, HCT is creating a home for artists, volunteers, audiences, and supporters alike.
                </p>
                <div className="cta-group" style={{ marginTop: '2.5rem' }}>
                  <button 
                    onClick={() => router.push('/about')} 
                    className="cta-button cta-button-primary"
                  >
                    Read Our Story
                  </button>
                  <button 
                    onClick={() => router.push('/community')} 
                    className="cta-button cta-button-secondary"
                  >
                    Join the Community
                  </button>
                </div>
              </div>
              
              <div className="editorial-image-pane">
                <div className="premium-image-container">
                  <img 
                    src="/rehearsal_collaboration.png" 
                    alt="Actors collaborating closely during a rehearsal session at Hillsboro Civic Theater"
                  />
                  <div className="spotlight-vignette" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BREATHING ROOM DIVIDER */}
        <div className="breathing-divider" />

        {/* SECTION 2: WHAT WE'RE BUILDING (PARALLAX BANNER) */}
        <section id="building" className="parallax-banner-section" style={{ backgroundImage: "url('/performance_moment.png')" }}>
          <div className="parallax-banner-overlay" />
          <div className="section-container" style={{ position: 'relative', zIndex: 3 }}>
            <div className="glass-overlay-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
              <span className="section-label">What We're Building</span>
              <h2 className="section-headline silver-text-glow" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '1rem 0' }}>
                Productions That Bring Our Community to Life
              </h2>
              <p className="section-body" style={{ color: 'var(--secondary-silver)', fontSize: '1rem' }}>
                From sweeping musicals to unforgettable live performances, Hillsboro Civic Theater is creating experiences that inspire, connect, and celebrate the people who call Hillsboro home.
              </p>
              <p className="section-body" style={{ color: 'var(--secondary-silver-dark)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                Our first productions are still ahead of us, but the story has already begun.
              </p>
              <div className="cta-group" style={{ marginTop: '2rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => router.push('/get-involved')} 
                  className="cta-button cta-button-primary"
                >
                  Get Notified
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
        </section>

        {/* BREATHING ROOM DIVIDER */}
        <div className="breathing-divider" />

        {/* SECTION 3: COMMUNITY */}
        <section id="community" className="section-wrapper">
          <div className="section-container">
            <div className="editorial-grid reverse">
              <div className="editorial-image-pane">
                <div className="premium-image-container">
                  <img 
                    src="/community_crew.png" 
                    alt="HCT community members and volunteers building a stage production together"
                  />
                  <div className="spotlight-vignette" />
                </div>
              </div>

              <div className="editorial-text-pane">
                <span className="section-label">Community</span>
                <h2 className="section-headline" style={{ marginBottom: '1.5rem' }}>
                  Everyone Has a Place Here
                </h2>
                <p className="section-body">
                  Whether you're a performer, musician, builder, designer, volunteer, or simply someone who loves the arts, HCT was created with you in mind.
                </p>
                <p className="section-body">
                  Every production is the result of people coming together to create something larger than themselves. This theater belongs to everyone willing to help build it.
                </p>
                <div className="cta-group" style={{ marginTop: '2.5rem' }}>
                  <button 
                    onClick={() => router.push('/get-involved')} 
                    className="cta-button cta-button-primary"
                  >
                    Get Involved
                  </button>
                  <button 
                    onClick={() => router.push('/community')} 
                    className="cta-button cta-button-secondary"
                  >
                    Meet the Community
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BREATHING ROOM DIVIDER */}
        <div className="breathing-divider" />

        {/* SECTION 4: FOUNDING SUPPORTERS (PARALLAX BANNER) */}
        <section id="supporters" className="parallax-banner-section" style={{ backgroundImage: "url('/grand_auditorium.png')" }}>
          <div className="parallax-banner-overlay" />
          <div className="section-container" style={{ position: 'relative', zIndex: 3 }}>
            <div className="glass-overlay-card" style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'center' }}>
              <span className="section-label">Founding Supporters</span>
              <h2 className="section-headline silver-text-glow" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '1rem 0 1.5rem 0' }}>
                Help Build Something Hillsboro Has Never Had
              </h2>
              <p className="section-body" style={{ color: 'var(--secondary-silver)', fontSize: '1.05rem', margin: '0 auto 1.5rem auto', maxWidth: '650px' }}>
                Hillsboro Civic Theater is in its founding phase. Every contribution today helps lay the foundation for a future filled with creativity, live performance, and community connection.
              </p>
              <p className="section-body" style={{ color: 'var(--secondary-silver-dark)', fontSize: '0.95rem', margin: '0 auto 2.5rem auto', maxWidth: '600px' }}>
                Your support isn't maintaining something that already exists. It's helping create something that doesn't exist yet.
              </p>
              <div className="cta-group" style={{ justifyContent: 'center' }}>
                <button 
                  onClick={() => router.push('/donate')} 
                  className="cta-button cta-button-primary"
                >
                  Make Your Gift
                </button>
                <button 
                  onClick={() => router.push('/about')} 
                  className="cta-button cta-button-secondary"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .home-content-flow {
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 5;
          background-color: var(--primary-dark);
        }
      `}</style>
    </>
  );
}
