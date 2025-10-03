'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faXTwitter,
  faFacebook,
  faYoutube,
  faLinkedin,
  faTiktok
} from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

interface FooterProps {
  footer?: {
    brandName: string;
    brandDescription: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    copyright: string;
    socialLinks: Array<{
      id: string;
      platform: string;
      url: string;
      icon: string;
    }>;
  };
}

const getSocialIcon = (platform: string): React.JSX.Element => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <FontAwesomeIcon icon={faInstagram} className="w-16 h-16" />;
    case 'twitter':
    case 'x':
      return <FontAwesomeIcon icon={faXTwitter} className="w-16 h-16" />;
    case 'facebook':
      return <FontAwesomeIcon icon={faFacebook} className="w-16 h-16" />;
    case 'youtube':
      return <FontAwesomeIcon icon={faYoutube} className="w-16 h-16" />;
    case 'linkedin':
      return <FontAwesomeIcon icon={faLinkedin} className="w-16 h-16" />;
    case 'tiktok':
      return <FontAwesomeIcon icon={faTiktok} className="w-16 h-16" />;
    default:
      return <FontAwesomeIcon icon={faLink} className="w-16 h-16" />;
  }
};

export default function Footer({ footer }: FooterProps) {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-sections" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Logo and Description */}
          <div>
            <div className="footer-logo">{footer?.brandName || 'Au Lait'}</div>
            <p className="footer-text">
              {footer?.brandDescription || 'Experience coffee that transcends the ordinary. Crafted with passion, brewed to perfection. Your journey to exceptional coffee starts at Au Lait.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#FAD45B',
              marginBottom: '16px'
            }}>
              Quick Links
            </h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); console.log('Footer Home clicked'); window.scrollTo({ top: 0, behavior: 'smooth' }); document.documentElement.scrollTo({ top: 0, behavior: 'smooth' }); document.body.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; console.log('Footer Home scroll executed'); }, 100); setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; }, 300); }}>Home</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); }}>Menu</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>About</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#FAD45B',
              marginBottom: '16px'
            }}>
              Contact
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <li style={{ color: '#f0e9e1', opacity: '0.8' }}>{footer?.address || '123 Coffee Street'}</li>
              <li style={{ color: '#f0e9e1', opacity: '0.8' }}>{footer?.city || 'Metropolis, NY 10001'}</li>
              <li style={{ color: '#f0e9e1', opacity: '0.8' }}>{footer?.phone || '(555) 123-4567'}</li>
              <li style={{ color: '#f0e9e1', opacity: '0.8' }}>{footer?.email || 'contact@aulait.coffee'}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          borderTop: '1px solid rgba(250, 212, 91, 0.2)',
          paddingTop: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <p style={{
            color: '#f0e9e1',
            opacity: '0.7',
            fontSize: '14px',
            margin: 0
          }}>
            {footer?.copyright || '© 2025 Au Lait Coffee Shop. All Rights Reserved.'}
          </p>

          {/* Social Links */}
          <div className="footer-social-links" style={{
            display: 'flex',
            gap: '24px'
          }}>
            {footer?.socialLinks && footer.socialLinks.length > 0 ? (
              footer.socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#f0e9e1',
                    opacity: '0.7',
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLAnchorElement;
                    target.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLAnchorElement;
                    target.style.opacity = '0.7';
                  }}
                  aria-label={social.platform}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))
            ) : (
              // Fallback hardcoded social links if no socialLinks provided
              <>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#f0e9e1',
                    opacity: '0.7',
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLAnchorElement;
                    target.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLAnchorElement;
                    target.style.opacity = '0.7';
                  }}
                  aria-label="Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} className="w-16 h-16" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#f0e9e1',
                    opacity: '0.7',
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLAnchorElement;
                    target.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLAnchorElement;
                    target.style.opacity = '0.7';
                  }}
                  aria-label="Twitter"
                >
                  <FontAwesomeIcon icon={faXTwitter} className="w-16 h-16" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#f0e9e1',
                    opacity: '0.7',
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLAnchorElement;
                    target.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLAnchorElement;
                    target.style.opacity = '0.7';
                  }}
                  aria-label="Facebook"
                >
                  <FontAwesomeIcon icon={faFacebook} className="w-16 h-16" />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
