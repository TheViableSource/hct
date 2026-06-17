import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">Hillsboro Civic Theater</div>
          <p className="footer-description">
            Building a permanent home for creativity, storytelling, live performance, and community participation in Hillsboro.
          </p>
        </div>

        <div className="footer-links-column">
          <div className="footer-links-title">Explore HCT</div>
          <ul className="footer-links-list">
            <li className="footer-link-item">
              <Link href="/">Home</Link>
            </li>
            <li className="footer-link-item">
              <Link href="/about">About Our Vision</Link>
            </li>
            <li className="footer-link-item">
              <Link href="/community">Our Community</Link>
            </li>
            <li className="footer-link-item">
              <Link href="/donate">Support HCT</Link>
            </li>
            <li className="footer-link-item">
              <Link href="/get-involved">Get Involved</Link>
            </li>
          </ul>
        </div>

        <div className="footer-links-column">
          <div className="footer-links-title">Contact & Connect</div>
          <ul className="footer-links-list" style={{ color: 'var(--secondary-silver-dark)', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 300 }}>
            <li>Hillsboro, Oregon</li>
            <li>info@hillsborocivictheater.org</li>
            <li style={{ marginTop: '1rem', color: 'var(--accent-white)', fontWeight: 500 }}>Join Our List</li>
            <li style={{ fontSize: '0.85rem' }}>Be the first to hear about upcoming productions and events.</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">
          &copy; {currentYear} Hillsboro Civic Theater. All rights reserved.
        </div>
        <div className="footer-socials">
          <a href="#" className="footer-social-link">Instagram</a>
          <a href="#" className="footer-social-link">Facebook</a>
          <a href="#" className="footer-social-link">Twitter</a>
        </div>
      </div>
    </footer>
  );
}
