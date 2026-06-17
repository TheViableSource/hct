'use client';

import { useState } from 'react';

type FormType = 'sponsor' | 'volunteer' | 'performer' | null;

export default function GetInvolvedPage() {
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    details: '',
    roleSpecific: '',
  });

  const handleOpenForm = (type: FormType) => {
    setActiveForm(type);
    setSubmitted(false);
    setFormData({ name: '', email: '', phone: '', details: '', roleSpecific: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setActiveForm(null);
      setSubmitted(false);
      alert('Thank you! Your information has been received. Our founding team will contact you shortly.');
    }, 1500);
  };

  return (
    <>
      {/* Subpage Hero */}
      <section className="subpage-hero" style={{ backgroundImage: "url('/stage_lighting_detail.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="subpage-hero-container">
          <h1 className="subpage-hero-title silver-text-glow">The Curtain Hasn't Risen Yet. Join Us Before It Does.</h1>
          <p className="subpage-hero-subtitle" style={{ color: 'var(--accent-white)' }}>
            Every great theater begins with a community willing to dream bigger. Whether you're a sponsor, volunteer, performer, musician, or supporter, there is a place for you in HCT's story.
          </p>
        </div>
      </section>

      {/* Page Content */}
      <div className="get-involved-content-flow">
        
        {/* SPONSORS SECTION */}
        <section className="section-wrapper">
          <div className="section-container">
            <div className="editorial-grid">
              <div className="editorial-text-pane">
                <span className="section-label">Sponsors</span>
                <h2 className="section-headline" style={{ marginBottom: '1.5rem' }}>Become a Founding Sponsor</h2>
                <p className="section-body">
                  Help bring world-class community theater to Hillsboro while aligning your organization with creativity, education, and cultural growth.
                </p>
                <p className="section-body">
                  Founding sponsors will receive premier recognition inside our publications, VIP event access, and a key page in Hillsboro's cultural history book.
                </p>
                <button 
                  onClick={() => handleOpenForm('sponsor')} 
                  className="cta-button cta-button-primary"
                  style={{ marginTop: '2rem' }}
                >
                  Request Sponsorship Info
                </button>
              </div>

              <div className="editorial-image-pane">
                <div className="premium-image-container">
                  <img src="/performance_moment.png" alt="Sponsors attending a premium theatrical performance under professional spotlights" />
                  <div className="spotlight-vignette" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BREATHING ROOM DIVIDER */}
        <div className="breathing-divider" />

        {/* VOLUNTEERS SECTION */}
        <section className="section-wrapper">
          <div className="section-container">
            <div className="editorial-grid reverse">
              <div className="editorial-image-pane">
                <div className="premium-image-container">
                  <img src="/backstage_craft.png" alt="A stage volunteer sorting craft materials and props behind the scenes" />
                  <div className="spotlight-vignette" />
                </div>
              </div>

              <div className="editorial-text-pane">
                <span className="section-label">Volunteers</span>
                <h2 className="section-headline" style={{ marginBottom: '1.5rem' }}>Be Part of Building It</h2>
                <p className="section-body">
                  No experience required. Just a willingness to contribute your time, energy, and passion toward building something meaningful for our community.
                </p>
                <p className="section-body">
                  From set painting and construction to ushering, box office, and sewing costumes, there are countless ways to leave your mark.
                </p>
                <button 
                  onClick={() => handleOpenForm('volunteer')} 
                  className="cta-button cta-button-primary"
                  style={{ marginTop: '2rem' }}
                >
                  Sign Up to Volunteer
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* BREATHING ROOM DIVIDER */}
        <div className="breathing-divider" />

        {/* PERFORMERS SECTION */}
        <section className="section-wrapper" style={{ borderBottom: 'none' }}>
          <div className="section-container">
            <div className="editorial-grid">
              <div className="editorial-text-pane">
                <span className="section-label">Performers</span>
                <h2 className="section-headline" style={{ marginBottom: '1.5rem' }}>The Stage Is Open</h2>
                <p className="section-body">
                  We're building our founding company of performers, musicians, and artists. Whether you're experienced or just starting, we'd love to hear from you.
                </p>
                <p className="section-body">
                  Join our artistic directory to receive audition notices, orchestra callouts, and notifications about workshops.
                </p>
                <button 
                  onClick={() => handleOpenForm('performer')} 
                  className="cta-button cta-button-primary"
                  style={{ marginTop: '2rem' }}
                >
                  Join the Performer List
                </button>
              </div>

              <div className="editorial-image-pane">
                <div className="premium-image-container">
                  <img src="/rehearsal_collaboration.png" alt="Actors and musicians collaborating during a lively script reading rehearsal" />
                  <div className="spotlight-vignette" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MODAL FORM OVERLAY */}
        {activeForm && (
          <div className="form-modal-overlay">
            <div className="form-modal-card">
              <button className="close-modal-btn" onClick={() => setActiveForm(null)}>&times;</button>
              
              <h3 className="modal-title">
                {activeForm === 'sponsor' && 'Founding Sponsor Inquiry'}
                {activeForm === 'volunteer' && 'Volunteer Registration'}
                {activeForm === 'performer' && 'Performer & Musician Interest'}
              </h3>
              
              {submitted ? (
                <div className="form-success-message">
                  <p>Submitting your information to HCT...</p>
                </div>
              ) : (
                <form className="modal-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      value={formData.name} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        value={formData.email} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        required 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>

                  {activeForm === 'sponsor' && (
                    <div className="form-group">
                      <label htmlFor="roleSpecific">Company / Organization Name</label>
                      <input 
                        type="text" 
                        id="roleSpecific" 
                        name="roleSpecific" 
                        required 
                        placeholder="Company name"
                        value={formData.roleSpecific} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  )}

                  {activeForm === 'volunteer' && (
                    <div className="form-group">
                      <label htmlFor="roleSpecific">Primary Area of Interest</label>
                      <select 
                        id="roleSpecific" 
                        name="roleSpecific" 
                        required 
                        value={formData.roleSpecific} 
                        onChange={handleInputChange}
                      >
                        <option value="">Select interest area...</option>
                        <option value="set-construction">Set Construction & Painting</option>
                        <option value="costumes-makeup">Costumes, Wardrobe & Makeup</option>
                        <option value="lighting-sound">Lighting & Sound Operations</option>
                        <option value="front-of-house">Front of House (Usher, Box Office)</option>
                        <option value="marketing-admin">Marketing & Administration</option>
                      </select>
                    </div>
                  )}

                  {activeForm === 'performer' && (
                    <div className="form-group">
                      <label htmlFor="roleSpecific">Primary Artistic Focus</label>
                      <select 
                        id="roleSpecific" 
                        name="roleSpecific" 
                        required 
                        value={formData.roleSpecific} 
                        onChange={handleInputChange}
                      >
                        <option value="">Select focus area...</option>
                        <option value="actor">Actor / Stage Performer</option>
                        <option value="singer">Vocalist / Musical Theater Performer</option>
                        <option value="musician">Instrumentalist / Orchestra Musician</option>
                        <option value="dancer">Dancer / Choreographer</option>
                        <option value="creative-director">Director / Stage Manager / Designer</option>
                      </select>
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="details">
                      {activeForm === 'sponsor' && 'Sponsorship Goals / Comments'}
                      {activeForm === 'volunteer' && 'Skills, Experience, or General Availability'}
                      {activeForm === 'performer' && 'Theatrical / Musical Experience & Background'}
                    </label>
                    <textarea 
                      id="details" 
                      name="details" 
                      rows={4}
                      value={formData.details} 
                      onChange={handleInputChange}
                    />
                  </div>

                  <button type="submit" className="cta-button cta-button-primary modal-submit-btn">
                    Submit Information
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .get-involved-content-flow {
          display: flex;
          flex-direction: column;
        }

        /* Modal styling */
        .form-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(11, 19, 36, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 2rem;
        }
        .form-modal-card {
          background-color: var(--primary-velvet);
          border: 1px solid rgba(192, 198, 206, 0.15);
          max-width: 600px;
          width: 100%;
          border-radius: 4px;
          padding: 3rem;
          position: relative;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
          animation: modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .close-modal-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: none;
          border: none;
          color: var(--secondary-silver);
          font-size: 2rem;
          cursor: pointer;
          line-height: 1;
          transition: var(--transition-smooth);
        }
        .close-modal-btn:hover {
          color: var(--accent-white);
        }
        .modal-title {
          font-size: 2rem;
          color: var(--accent-white);
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(192, 198, 206, 0.1);
          padding-bottom: 0.75rem;
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-group-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--secondary-silver);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-group input, 
        .form-group select, 
        .form-group textarea {
          background-color: var(--primary-dark);
          border: 1px solid rgba(192, 198, 206, 0.2);
          color: var(--accent-white);
          padding: 0.75rem;
          border-radius: 2px;
          outline: none;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          transition: var(--transition-smooth);
        }
        .form-group input:focus, 
        .form-group select:focus, 
        .form-group textarea:focus {
          border-color: var(--accent-white);
        }
        .form-group select option {
          background-color: var(--primary-dark);
          color: var(--accent-white);
        }
        .modal-submit-btn {
          width: 100%;
          margin-top: 1rem;
          padding: 1rem;
        }
        .form-success-message {
          text-align: center;
          padding: 3rem 0;
          font-size: 1.2rem;
          color: var(--secondary-silver);
        }

        @media (max-width: 900px) {
          .form-group-row {
            grid-template-columns: 1fr;
          }
          .form-modal-card {
            padding: 2rem;
          }
        }
      `}</style>
    </>
  );
}
