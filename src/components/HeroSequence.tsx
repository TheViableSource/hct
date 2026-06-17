'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

export default function HeroSequence() {
  const router = useRouter();
  const [act, setAct] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isSkipped, setIsSkipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // GSAP element refs
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const logoMarkRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const enterBtnRef = useRef<HTMLButtonElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  
  const stageBgRef = useRef<HTMLDivElement>(null);
  const stageSpotRef = useRef<HTMLDivElement>(null);
  const auditoriumBgRef = useRef<HTMLDivElement>(null);
  
  const contentOverlayRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  // Particle simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create particles
    const particleCount = 60;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      opacity: number;
      fadeSpeed: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.5 - 0.2, // upward drift
        opacity: Math.random() * 0.5 + 0.1,
        fadeSpeed: Math.random() * 0.005 + 0.002,
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      // Light ambient spotlight glow from top
      const gradient = ctx.createRadialGradient(
        width / 2, 0, 10,
        width / 2, height / 2, Math.max(width, height) * 0.8
      );
      gradient.addColorStop(0, 'rgba(36, 59, 90, 0.15)');
      gradient.addColorStop(0.5, 'rgba(15, 27, 46, 0.05)');
      gradient.addColorStop(1, 'rgba(11, 19, 36, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192, 198, 206, ${p.opacity})`;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        // Reset if offscreen or faded
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) {
          p.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Handle body overflow locking
  useEffect(() => {
    const isFinished = sessionStorage.getItem('hct-hero-finished') === 'true';
    if (isFinished) {
      setAct(6);
      setIsSkipped(true);
      document.body.style.overflow = 'unset';
    } else {
      document.body.style.overflow = 'hidden';
      // Reset scroll to top
      window.scrollTo(0, 0);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleEnter = () => {
    setAct(2);
    
    const tl = gsap.timeline({
      onComplete: () => {
        setAct(6);
        sessionStorage.setItem('hct-hero-finished', 'true');
        document.body.style.overflow = 'unset';
        window.dispatchEvent(new Event('hct-hero-complete'));
      }
    });

    // Act I fade out
    tl.to([logoMarkRef.current, taglineRef.current, enterBtnRef.current], {
      opacity: 0,
      y: -20,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.inOut',
    });

    // Show Skip button
    tl.to(skipBtnRef.current, {
      opacity: 1,
      duration: 0.5,
    }, '-=0.5');

    // Act II: Curtains Open
    tl.to(curtainLeftRef.current, {
      xPercent: -100,
      duration: 2.2,
      ease: 'power2.inOut',
    }, '-=0.3');
    
    tl.to(curtainRightRef.current, {
      xPercent: 100,
      duration: 2.2,
      ease: 'power2.inOut',
    }, '-=2.2');

    // Act III: Stage & Performer Revealed
    tl.fromTo(stageBgRef.current, 
      { opacity: 0, scale: 1 },
      { opacity: 1, duration: 1.5, ease: 'power1.inOut' },
      '-=1.5'
    );

    // Increase spotlight intensity and stage spotlight glow
    tl.fromTo(stageSpotRef.current,
      { opacity: 0.2 },
      { opacity: 0.7, duration: 2.0, ease: 'power2.inOut' },
      '-=1.0'
    );

    // Act IV: Camera Push Forward (Scale performer image)
    tl.to(stageBgRef.current, {
      scale: 1.12,
      duration: 3.5,
      ease: 'power1.out',
    }, '-=0.5');

    // Act V: Camera Rotation (3D perspective sweep to reveal auditorium)
    // We rotate the stage performer image away in 3D
    tl.to(stageBgRef.current, {
      rotateY: -90,
      transformOrigin: 'center left',
      xPercent: -30,
      opacity: 0,
      scale: 0.95,
      duration: 2.2,
      ease: 'power2.inOut',
    });

    // We rotate the auditorium view in from 90deg to 0deg
    tl.fromTo(auditoriumBgRef.current,
      { rotateY: 90, transformOrigin: 'center right', xPercent: 30, opacity: 0, scale: 1.1 },
      { rotateY: 0, xPercent: 0, opacity: 1, scale: 1.0, duration: 2.2, ease: 'power2.inOut' },
      '-=2.2'
    );

    // Act VI: Content Fades In
    tl.to(skipBtnRef.current, {
      opacity: 0,
      duration: 0.4,
    }, '-=0.5');

    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.4'
    );

    tl.fromTo(headlineRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    );

    tl.fromTo(subheadlineRef.current,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    );

    tl.fromTo(ctasRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    );
  };

  const handleSkip = () => {
    setIsSkipped(true);
    setAct(6);
    sessionStorage.setItem('hct-hero-finished', 'true');
    document.body.style.overflow = 'unset';
    window.dispatchEvent(new Event('hct-hero-complete'));
  };

  const scrollToMission = () => {
    const section = document.getElementById('mission');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isSkipped || act === 6) {
    return (
      <section className="hero-section-complete">
        <div 
          className="hero-background-auditorium" 
          style={{ backgroundImage: `url('/auditorium_view.png')` }}
        />
        <div className="hero-dark-overlay" />
        <div className="hero-content-container">
          <div className="hero-text-content">
            <span className="hero-eyebrow">HILLSBORO CIVIC THEATER</span>
            <h1 className="hero-headline">Where Hillsboro Takes the Stage</h1>
            <p className="hero-subheadline">
              Hillsboro Civic Theater is creating a home for unforgettable performances, creative expression, and community connection. Join us as we build something extraordinary together.
            </p>
            <div className="cta-group">
              <button onClick={scrollToMission} className="cta-button cta-button-primary">
                Explore the Vision
              </button>
              <button onClick={() => router.push('/donate')} className="cta-button cta-button-secondary">
                Become a Founding Supporter
              </button>
            </div>
          </div>
        </div>
        <style jsx>{`
          .hero-section-complete {
            position: relative;
            height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background-color: var(--primary-dark);
          }
          .hero-background-auditorium {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            opacity: 0.65;
            z-index: 1;
            filter: brightness(0.8) contrast(1.1);
          }
          .hero-dark-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, transparent 30%, var(--primary-dark) 90%);
            z-index: 2;
            pointer-events: none;
          }
          .hero-content-container {
            position: relative;
            max-width: 900px;
            padding: 2rem;
            text-align: center;
            z-index: 3;
          }
          .hero-eyebrow {
            display: block;
            font-family: var(--font-sans);
            font-size: 0.9rem;
            font-weight: 600;
            letter-spacing: 0.3em;
            color: var(--secondary-silver);
            margin-bottom: 1.5rem;
            text-transform: uppercase;
          }
          .hero-headline {
            font-family: var(--font-serif);
            font-size: clamp(2.5rem, 6vw, 5rem);
            line-height: 1.1;
            margin-bottom: 2rem;
            color: var(--accent-white);
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
          }
          .hero-subheadline {
            font-family: var(--font-sans);
            font-size: clamp(1.1rem, 1.8vw, 1.35rem);
            line-height: 1.6;
            color: var(--secondary-silver);
            font-weight: 300;
            max-width: 750px;
            margin: 0 auto 3rem auto;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          }
          .cta-group {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
          }
          @media (max-width: 768px) {
            .cta-group {
              flex-direction: column;
              gap: 1rem;
              align-items: center;
            }
          }
        `}</style>
      </section>
    );
  }

  return (
    <div ref={containerRef} className="hero-sequence-container">
      {/* Dynamic dust particle canvas */}
      <canvas ref={canvasRef} className="hero-particle-canvas" />

      {/* Skip Intro Button */}
      <button 
        ref={skipBtnRef} 
        onClick={handleSkip} 
        className="skip-intro-btn"
        style={{ opacity: 0 }}
      >
        Skip Intro
      </button>

      {/* ACT I: Closed Curtain Cover */}
      <div className="curtain-container">
        <div 
          ref={curtainLeftRef} 
          className="curtain-half curtain-left"
          style={{ backgroundImage: `url('/curtain_background.png')` }}
        />
        <div 
          ref={curtainRightRef} 
          className="curtain-half curtain-right"
          style={{ backgroundImage: `url('/curtain_background.png')` }}
        />
      </div>

      {/* Act I UI Panel */}
      {act === 1 && (
        <div className="act-i-ui">
          <div ref={logoMarkRef} className="hct-logo-mark">
            <span className="logo-line-top"></span>
            <div className="logo-initials">HCT</div>
            <div className="logo-text">HILLSBORO CIVIC THEATER</div>
            <span className="logo-line-bottom"></span>
          </div>
          <p ref={taglineRef} className="act-i-tagline">
            Where Hillsboro Takes the Stage
          </p>
          <button 
            ref={enterBtnRef} 
            onClick={handleEnter} 
            className="enter-stage-btn"
            aria-label="Enter Hillsboro Civic Theater"
          >
            ENTER
          </button>
        </div>
      )}

      {/* Stage / Performer Element (Acts II, III, IV, V) */}
      {act >= 2 && act <= 5 && (
        <div className="stage-viewport">
          {/* Performer Stage Panel */}
          <div 
            ref={stageBgRef} 
            className="stage-background"
            style={{ backgroundImage: `url('/stage_performer.png')` }}
          >
            <div ref={stageSpotRef} className="stage-spotlight-overlay" />
            <div className="stage-darkness" />
          </div>

          {/* Auditorium Reveal Panel */}
          <div 
            ref={auditoriumBgRef} 
            className="auditorium-background"
            style={{ backgroundImage: `url('/auditorium_view.png')`, opacity: 0 }}
          >
            <div className="auditorium-darkness" />
          </div>
        </div>
      )}

      {/* Act VI content overlays for animation staging */}
      {act === 2 && (
        <div ref={contentOverlayRef} className="hero-content-animation-helper">
          <span ref={eyebrowRef} className="anim-eyebrow">HILLSBORO CIVIC THEATER</span>
          <h1 ref={headlineRef} className="anim-headline">Where Hillsboro Takes the Stage</h1>
          <p ref={subheadlineRef} className="anim-subheadline">
            Hillsboro Civic Theater is creating a home for unforgettable performances, creative expression, and community connection. Join us as we build something extraordinary together.
          </p>
          <div ref={ctasRef} className="anim-ctas">
            <button className="cta-button cta-button-primary">Explore the Vision</button>
            <button className="cta-button cta-button-secondary">Become a Founding Supporter</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .hero-sequence-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 90;
          background-color: var(--primary-dark);
          overflow: hidden;
          perspective: 1200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-particle-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }
        .skip-intro-btn {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: rgba(11, 19, 36, 0.4);
          border: 1px solid rgba(192, 198, 206, 0.2);
          color: var(--secondary-silver-dark);
          padding: 0.5rem 1.25rem;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          border-radius: 2px;
          cursor: pointer;
          z-index: 15;
          transition: var(--transition-smooth);
        }
        .skip-intro-btn:hover {
          color: var(--accent-white);
          border-color: var(--accent-white);
          background: rgba(11, 19, 36, 0.7);
        }

        /* Curtain splits */
        .curtain-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          z-index: 10;
          pointer-events: none;
        }
        .curtain-half {
          width: 50%;
          height: 100%;
          background-size: 200% 100%;
          background-repeat: no-repeat;
          position: absolute;
          top: 0;
        }
        .curtain-left {
          left: 0;
          background-position: left center;
          box-shadow: inset -30px 0 50px rgba(0, 0, 0, 0.8), 20px 0 40px rgba(0,0,0,0.5);
        }
        .curtain-right {
          right: 0;
          background-position: right center;
          box-shadow: inset 30px 0 50px rgba(0, 0, 0, 0.8), -20px 0 40px rgba(0,0,0,0.5);
        }

        /* Act I elements */
        .act-i-ui {
          position: relative;
          z-index: 12;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          max-width: 600px;
        }
        .hct-logo-mark {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
          position: relative;
          padding: 1.5rem 0;
        }
        .logo-line-top, .logo-line-bottom {
          display: block;
          width: 60px;
          height: 1px;
          background-color: var(--secondary-silver);
          opacity: 0.5;
        }
        .logo-initials {
          font-family: var(--font-serif);
          font-size: 3.5rem;
          letter-spacing: 0.15em;
          color: var(--accent-white);
          line-height: 1;
          font-weight: 500;
          text-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
        .logo-text {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 0.25em;
          color: var(--secondary-silver-dark);
          margin-top: 0.75rem;
        }
        .act-i-tagline {
          font-family: var(--font-serif);
          font-size: clamp(1.25rem, 2.5vw, 1.75rem);
          font-style: italic;
          color: var(--secondary-silver);
          margin-bottom: 3.5rem;
          font-weight: 300;
          text-shadow: 0 2px 5px rgba(0,0,0,0.5);
        }
        .enter-stage-btn {
          background: transparent;
          color: var(--accent-white);
          border: 1px solid var(--secondary-silver);
          padding: 1rem 3rem;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          cursor: pointer;
          transition: var(--transition-smooth);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.02);
        }
        .enter-stage-btn:hover {
          color: var(--primary-dark);
          background-color: var(--accent-white);
          border-color: var(--accent-white);
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
          letter-spacing: 0.3em;
        }

        /* Stages layers */
        .stage-viewport {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 4;
          transform-style: preserve-3d;
        }
        .stage-background, .auditorium-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          backface-visibility: hidden;
        }
        .stage-background {
          z-index: 5;
        }
        .stage-spotlight-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .stage-darkness {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 40%, rgba(11, 19, 36, 0.9) 100%);
          pointer-events: none;
        }
        .auditorium-background {
          z-index: 6;
        }
        .auditorium-darkness {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 35%, rgba(11, 19, 36, 0.95) 95%);
          pointer-events: none;
        }

        /* Animation helper hidden structure (needs to exist for GSAP mapping) */
        .hero-content-animation-helper {
          position: absolute;
          z-index: 8;
          max-width: 900px;
          text-align: center;
          padding: 2rem;
          opacity: 0;
          pointer-events: none;
        }
        .anim-eyebrow {
          display: block;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.3em;
          color: var(--secondary-silver);
          margin-bottom: 1.5rem;
          text-transform: uppercase;
        }
        .anim-headline {
          font-family: var(--font-serif);
          font-size: clamp(2.5rem, 6vw, 5rem);
          line-height: 1.1;
          margin-bottom: 2rem;
          color: var(--accent-white);
        }
        .anim-subheadline {
          font-family: var(--font-sans);
          font-size: clamp(1.1rem, 1.8vw, 1.35rem);
          line-height: 1.6;
          color: var(--secondary-silver);
          font-weight: 300;
          max-width: 750px;
          margin: 0 auto 3rem auto;
        }
        .anim-ctas {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
