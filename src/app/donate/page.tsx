'use client';

import { useState } from 'react';

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(250);
  const [customAmount, setCustomAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const fundingAreas = [
    { title: 'Productions', desc: 'Bringing world-class scripts and theatrical direction to Hillsboro.', img: '/performance_moment.png' },
    { title: 'Orchestra Programs', desc: 'Hiring local musicians and conductors to fill the auditorium with live music.', img: '/orchestra_musicians.png' },
    { title: 'Costumes, Sets, & Lighting', desc: 'Creating breathtaking visual worlds on stage with local designers.', img: '/stage_lighting_detail.png' },
    { title: 'Educational Programs', desc: 'Providing scholarships and theater training for Hillsboro\'s youth.', img: '/youth_education.png' },
    { title: 'Community Outreach', desc: 'Making theater accessible to underrepresented and underserved audiences.', img: '/community_crew.png' },
    { title: 'Future Permanent Venue', desc: 'Laying the literal and financial foundation for HCT\'s permanent venue.', img: '/theater_architecture.png' },
  ];

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = selectedAmount === 'custom' ? customAmount : selectedAmount;
    alert(`Thank you for support! You chose to contribute $${finalAmount}${isRecurring ? ' monthly' : ''} to Hillsboro Civic Theater's founding phase.`);
  };

  return (
    <>
      {/* Subpage Hero */}
      <section className="subpage-hero" style={{ backgroundImage: "url('/audience_emotion.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="subpage-hero-container">
          <h1 className="subpage-hero-title silver-text-glow">You Are Not Donating to a Theater. You Are Building One.</h1>
          <p className="subpage-hero-subtitle" style={{ color: 'var(--accent-white)' }}>
            Every contribution helps create the foundation for a cultural institution that will serve Hillsboro for generations.
          </p>
        </div>
      </section>

      {/* Page Content */}
      <div className="donate-content-flow">
        
        {/* WHY IT MATTERS & DONATION INTERFACE */}
        <section className="section-wrapper">
          <div className="section-container donation-split-layout">
            <div className="donation-info-pane">
              <span className="section-label">Why It Matters</span>
              <h2 className="section-headline" style={{ marginBottom: '1.5rem' }}>A Moment in Time</h2>
              <p className="section-body">
                Most arts organizations are built over decades. Hillsboro Civic Theater is being built right now. The people who support it today will become part of its founding story forever.
              </p>
              <p className="section-body">
                Your financial support goes directly toward launching our first season and securing a permanent space in our community. Let's create a legacy together.
              </p>

              {/* Added a beautiful inline image of the audience emotion */}
              <div className="premium-image-container" style={{ marginTop: '2.5rem', aspectRatio: '16/9' }}>
                <img src="/audience_emotion.png" alt="An HCT audience watching a stage show with soft lighting reflecting off their faces" />
                <div className="spotlight-vignette" />
              </div>
            </div>

            <div className="donation-card-pane">
              <form className="donation-card" onSubmit={handleDonate}>
                <h3 className="donation-card-title">Founding Gift</h3>
                <p className="donation-card-subtitle">Choose your contribution level</p>
                
                <div className="amount-grid">
                  {[50, 100, 250, 500].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className={`amount-btn ${selectedAmount === amount ? 'active' : ''}`}
                      onClick={() => setSelectedAmount(amount)}
                    >
                      ${amount}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`amount-btn ${selectedAmount === 'custom' ? 'active' : ''}`}
                    onClick={() => setSelectedAmount('custom')}
                  >
                    Custom
                  </button>
                </div>

                {selectedAmount === 'custom' && (
                  <div className="custom-amount-input-container">
                    <span className="currency-symbol">$</span>
                    <input
                      type="number"
                      required
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="custom-amount-input"
                      min="5"
                    />
                  </div>
                )}

                <label className="recurring-checkbox-label">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="recurring-checkbox"
                  />
                  <span>Make this a recurring monthly gift</span>
                </label>

                <button type="submit" className="cta-button cta-button-primary donate-submit-btn">
                  Process Gift
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* BREATHING ROOM DIVIDER */}
        <div className="breathing-divider" />

        {/* WHAT DONATIONS SUPPORT */}
        <section className="section-wrapper" style={{ borderBottom: 'none' }}>
          <div className="section-container">
            <span className="section-label">Impact</span>
            <h2 className="section-headline" style={{ marginBottom: '3rem' }}>What Your Support Builds</h2>
            
            <div className="funding-grid">
              {fundingAreas.map((area, idx) => (
                <div key={idx} className="funding-card-premium">
                  <div className="funding-card-image" style={{ backgroundImage: `url('${area.img}')` }} />
                  <div className="funding-card-overlay" />
                  <div className="funding-card-content">
                    <h3 className="funding-card-title">{area.title}</h3>
                    <p className="funding-card-desc">{area.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .donate-content-flow {
          display: flex;
          flex-direction: column;
        }
        .donation-split-layout {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 5rem;
          align-items: flex-start;
        }
        
        /* Donation Card styling */
        .donation-card {
          background-color: var(--primary-dark);
          border: 1px solid rgba(192, 198, 206, 0.1);
          padding: 3rem;
          border-radius: 4px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: sticky;
          top: 100px;
        }
        .donation-card-title {
          font-size: 1.75rem;
          color: var(--accent-white);
        }
        .donation-card-subtitle {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: var(--secondary-silver-dark);
          margin-top: -1rem;
        }
        .amount-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .amount-btn {
          background: transparent;
          border: 1px solid rgba(192, 198, 206, 0.2);
          color: var(--secondary-silver);
          padding: 0.75rem 0;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          cursor: pointer;
          transition: var(--transition-smooth);
          border-radius: 2px;
        }
        .amount-btn:hover {
          border-color: var(--accent-white);
          color: var(--accent-white);
          background: rgba(192, 198, 206, 0.05);
        }
        .amount-btn.active {
          background-color: var(--accent-white);
          color: var(--primary-dark);
          border-color: var(--accent-white);
          font-weight: 500;
        }
        .custom-amount-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        .currency-symbol {
          position: absolute;
          left: 1rem;
          color: var(--secondary-silver-dark);
          font-family: var(--font-sans);
          font-size: 1.1rem;
        }
        .custom-amount-input {
          width: 100%;
          background: rgba(11, 19, 36, 0.5);
          border: 1px solid rgba(192, 198, 206, 0.2);
          color: var(--accent-white);
          padding: 0.75rem 1rem 0.75rem 2rem;
          font-family: var(--font-sans);
          font-size: 1.1rem;
          border-radius: 2px;
          outline: none;
          transition: var(--transition-smooth);
        }
        .custom-amount-input:focus {
          border-color: var(--accent-white);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.05);
        }
        .recurring-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: var(--secondary-silver);
          cursor: pointer;
          user-select: none;
        }
        .recurring-checkbox {
          width: 16px;
          height: 16px;
          accent-color: var(--primary-accent-blue);
          cursor: pointer;
        }
        .donate-submit-btn {
          width: 100%;
          margin-top: 0.5rem;
        }

        /* Funding Grid Premium */
        .funding-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .funding-card-premium {
          position: relative;
          height: 250px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid rgba(192, 198, 206, 0.06);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: var(--transition-cinematic);
        }
        .funding-card-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          filter: brightness(0.4) contrast(1.1);
          transition: transform 1.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .funding-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(0deg, var(--primary-dark) 20%, transparent 80%);
          z-index: 1;
        }
        .funding-card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 2rem;
          z-index: 2;
        }
        .funding-card-premium:hover {
          transform: translateY(-5px);
          border-color: rgba(192, 198, 206, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }
        .funding-card-premium:hover .funding-card-image {
          transform: scale(1.08);
          filter: brightness(0.5) contrast(1.1);
        }
        .funding-card-title {
          font-size: 1.35rem;
          color: var(--accent-white);
          margin-bottom: 0.5rem;
        }
        .funding-card-desc {
          font-size: 0.9rem;
          color: var(--secondary-silver-dark);
          line-height: 1.5;
        }

        @media (max-width: 1024px) {
          .funding-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 900px) {
          .donation-split-layout {
            grid-template-columns: 1fr;
            gap: 4rem;
          }
          .donation-card {
            position: relative;
            top: 0;
          }
          .funding-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
