'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [menuActive, setMenuActive] = useState(false);

  useEffect(() => {
    // If we're not on the home page, the header should be visible immediately.
    if (pathname !== '/') {
      setIsVisible(true);
    } else {
      // On the home page, check if the hero sequence has already finished
      const heroFinished = sessionStorage.getItem('hct-hero-finished') === 'true';
      if (heroFinished) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        const handleHeroComplete = () => {
          setIsVisible(true);
        };
        window.addEventListener('hct-hero-complete', handleHeroComplete);
        return () => {
          window.removeEventListener('hct-hero-complete', handleHeroComplete);
        };
      }
    }
  }, [pathname]);

  // Close menu on link navigation
  useEffect(() => {
    setMenuActive(false);
  }, [pathname]);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <header className={`main-header ${isVisible ? 'visible' : ''}`}>
      <div className="nav-container">
        <Link href="/" className="logo-link" aria-label="Hillsboro Civic Theater Home">
          HCT <span>Hillsboro</span>
        </Link>

        <nav aria-label="Main Navigation">
          <ul className={`nav-menu ${menuActive ? 'active' : ''}`}>
            <li>
              <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>
                About
              </Link>
            </li>
            <li>
              <Link href="/community" className={`nav-link ${pathname === '/community' ? 'active' : ''}`}>
                Community
              </Link>
            </li>
            <li>
              <Link href="/donate" className={`nav-link ${pathname === '/donate' ? 'active' : ''}`}>
                Donate
              </Link>
            </li>
            <li>
              <Link href="/get-involved" className={`nav-link ${pathname === '/get-involved' ? 'active' : ''}`}>
                Get Involved
              </Link>
            </li>
          </ul>
        </nav>

        <button 
          className={`menu-toggle ${menuActive ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-expanded={menuActive}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
