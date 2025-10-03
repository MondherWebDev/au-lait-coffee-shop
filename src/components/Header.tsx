'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeaderProps {
  logo: { url: string };
}

export default function Header({ logo }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const mobile = window.innerWidth <= 768;
      // Enable glassmorphism on all devices for testing - can be changed back later
      const shouldShowGlassmorphism = scrollTop > 20;
      setIsScrolled(shouldShowGlassmorphism);

      // Debug logging
      console.log('Scroll Debug:', {
        scrollTop,
        mobile,
        shouldShowGlassmorphism,
        isScrolled: shouldShowGlassmorphism
      });
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Also update scroll state when resizing
      setTimeout(handleScroll, 100);
    };

    // Check on mount
    handleResize();
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: isScrolled
          ? 'rgba(26, 20, 18, 0.3)'
          : 'transparent',
        backdropFilter: isScrolled
          ? 'blur(10px)'
          : 'none',
        WebkitBackdropFilter: isScrolled
          ? 'blur(10px)'
          : 'none',
        border: isScrolled
          ? '2px solid rgba(255, 255, 255, 0.8)'
          : 'none',
        zIndex: 1000,
        padding: '25px 0 15px 0',
        transition: 'all 0.3s ease',
        height: 'auto',
        display: 'flex',
        alignItems: 'center'
      }}>
        <nav style={{
          display: isMobile ? 'flex' : 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          justifyContent: isMobile ? 'space-between' : 'initial',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '0 10px' : '0 20px',
          backgroundColor: 'transparent'
        }}>
          {/* Left Column - Logo */}
          <div className="logo-entrance" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'flex-start' : 'flex-start',
            marginTop: '10px',
            marginLeft: isMobile ? '0' : '0'
          }}>
            {logo.url && logo.url.trim() !== '' ? (
              <div style={{
                borderRadius: '16px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                animation: 'logoSlideFromLeft 1.2s ease-out 0.5s both'
              }}
              onClick={(e) => {
                e.preventDefault();
                console.log('Logo clicked - scrolling to top');

                // Multiple methods to ensure scroll works
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
                document.body.scrollTo({ top: 0, behavior: 'smooth' });

                // Force scroll multiple times for reliability
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                  // Force update of glassmorphism state after scroll
                  setIsScrolled(false);
                  console.log('Logo scroll executed');
                }, 100);

                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                }, 300);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(2deg)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(250, 212, 91, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
              }}>
                <Image
                  src={logo.url}
                  alt="Au Lait"
                  width={isMobile ? 60 : 70}
                  height={isMobile ? 60 : 70}
                  style={{
                    borderRadius: '16px'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : null}
          </div>

          {/* Center Column - Navigation */}
          <div className="nav-entrance" style={{
            display: 'flex',
            justifyContent: 'center',
            animation: 'navSlideFromTop 1s ease-out 0.8s both'
          }}>
            <ul className="nav-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); console.log('Home clicked'); window.scrollTo({ top: 0, behavior: 'smooth' }); document.documentElement.scrollTo({ top: 0, behavior: 'smooth' }); document.body.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; setIsScrolled(false); console.log('Home nav scroll executed'); }, 100); setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; }, 300); setIsMenuOpen(false); }}>Home</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); console.log('Menu clicked, element:', document.getElementById('menu')); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); }}>Menu</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); console.log('About clicked, element:', document.getElementById('about')); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>About</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); console.log('Contact clicked, element:', document.getElementById('contact')); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact</a></li>
            </ul>
          </div>

          {/* Right Column - Hamburger Menu */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginLeft: 'auto',
            marginRight: isMobile ? '20px' : '0'
          }}>
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              style={{
                display: 'none',
                flexDirection: 'column',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '12px'
              }}
              className="mobile-menu-button"
            >
              <div style={{
                width: '24px',
                height: '2px',
                backgroundColor: '#f0e9e1',
                margin: '2px 0',
                transition: '0.3s',
                transform: isMenuOpen ? 'rotate(-45deg) translate(-5px, 6px)' : 'rotate(0)'
              }} />
              <div style={{
                width: '24px',
                height: '2px',
                backgroundColor: '#f0e9e1',
                margin: '2px 0',
                transition: '0.3s',
                opacity: isMenuOpen ? 0 : 1
              }} />
              <div style={{
                width: '24px',
                height: '2px',
                backgroundColor: '#f0e9e1',
                margin: '2px 0',
                transition: '0.3s',
                transform: isMenuOpen ? 'rotate(45deg) translate(-5px, -6px)' : 'rotate(0)'
              }} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          paddingTop: '140px'
        }}>
          <div style={{
            backgroundColor: '#1a1412',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '16px',
            border: '1px solid #FAD45B',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            textAlign: 'center'
          }}>


            <a href="#" onClick={(e) => { e.preventDefault(); closeMenu(); console.log('Mobile Home clicked'); window.scrollTo({ top: 0, behavior: 'smooth' }); document.documentElement.scrollTo({ top: 0, behavior: 'smooth' }); document.body.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; setIsScrolled(false); console.log('Mobile Home scroll executed'); }, 100); setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; }, 300); }} style={{
              color: '#FAD45B',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: '600',
              padding: '16px',
              borderBottom: '1px solid rgba(250, 212, 91, 0.2)'
            }}>
              Home
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); closeMenu(); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); }} style={{
              color: '#FAD45B',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: '600',
              padding: '16px',
              borderBottom: '1px solid rgba(250, 212, 91, 0.2)'
            }}>
              Menu
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); closeMenu(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} style={{
              color: '#FAD45B',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: '600',
              padding: '16px',
              borderBottom: '1px solid rgba(250, 212, 91, 0.2)'
            }}>
              About
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); closeMenu(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} style={{
              color: '#FAD45B',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: '600',
              padding: '16px',
              borderBottom: '1px solid rgba(250, 212, 91, 0.2)'
            }}>
              Contact
            </a>
            <a href="#menu" onClick={closeMenu} className="btn-primary" style={{
              textAlign: 'center',
              marginTop: '16px',
              padding: '16px 32px',
              fontSize: '18px'
            }}>
              Order Now
            </a>
          </div>
        </div>
      )}
    </>
  );
}
