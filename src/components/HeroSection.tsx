'use client';

import { useEffect, useRef } from 'react';

interface HeroSectionProps {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    video: string;
  };
}

export default function HeroSection({ hero }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && hero.video) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      const attemptPlay = async () => {
        try {
          console.log('Attempting to play video...');
          video.muted = true;
          video.playsInline = true;

          // Try to play immediately
          await video.play();
          console.log('Video started successfully');
        } catch (error) {
          console.log('Initial autoplay failed:', error);
          // Video autoplay failed, but that's okay - it will display as a static image
        }
      };

      const handleUserInteraction = async (event: Event) => {
        console.log('User interaction detected:', event.type);
        try {
          video.muted = true;
          video.playsInline = true;
          await video.play();
          console.log('Video started after user interaction');
        } catch (error) {
          console.log('User interaction autoplay failed:', error);
        }

        // Remove all listeners after successful play
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('scroll', handleUserInteraction);
        document.removeEventListener('touchend', handleUserInteraction);
        document.removeEventListener('touchmove', handleUserInteraction);
      };

      // Try immediate autoplay first (works on some mobile browsers now)
      video.addEventListener('loadedmetadata', attemptPlay);

      // Also set up user interaction listeners as backup
      if (isMobile) {
        console.log('Setting up mobile interaction listeners');
        document.addEventListener('touchstart', handleUserInteraction, { passive: true });
        document.addEventListener('click', handleUserInteraction, { passive: true });
        document.addEventListener('scroll', handleUserInteraction, { passive: true });
        document.addEventListener('touchend', handleUserInteraction, { passive: true });
        document.addEventListener('touchmove', handleUserInteraction, { passive: true });
      }

      return () => {
        video.removeEventListener('loadedmetadata', attemptPlay);
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('scroll', handleUserInteraction);
        document.removeEventListener('touchend', handleUserInteraction);
        document.removeEventListener('touchmove', handleUserInteraction);
      };
    }
  }, [hero.video]);
  return (
    <section className="hero" style={{
      position: 'relative',
      height: 'calc(100vh - 80px)',
      width: 'calc(100vw - 100px)',
      maxHeight: '600px',
      minHeight: '500px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      margin: '50px',
      marginTop: '120px',
      padding: 0
    }}>
      {/* Hero Video Container */}
      <div style={{
        borderRadius: '30px',
        height: '100%',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        border: '2px solid rgba(210, 105, 30, 0.2)'
      }}>



        {/* Video Background inside Card */}
        {hero.video && (
          <video
            ref={videoRef}
            className="hero-video"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              borderRadius: '30px'
            }}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            controls={false}
            disablePictureInPicture
            webkit-playsinline="true"
          >
            <source src={hero.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}



        {/* Card Content */}
        <div className="hero-content-entrance" style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          height: '100%',
          width: '100%',
          padding: '20px',
          animation: 'heroSlideFromBottom 1.5s ease-out 1.2s both'
        }}>


          <h1 className="hero-title" style={{
            fontSize: '4rem',
            fontWeight: '800',
            lineHeight: '1.1',
            color: 'white',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontFamily: "'Ubuntu', sans-serif"
          }}>
            {hero.title}
          </h1>

          <p className="hero-subtitle" style={{
            fontSize: '1.2rem',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '30px',
            maxWidth: '600px',
            fontFamily: "'Ubuntu', sans-serif"
          }}>
            {hero.subtitle}
          </p>

          <a href="#menu" className="btn-primary hero-cta" style={{
            fontSize: '16px',
            padding: '14px 28px',
            backgroundColor: 'rgba(26, 20, 18, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#FAD45B',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '6px',
            fontWeight: '600',
            textDecoration: 'none',
            display: 'inline-block',

            transition: 'all 0.3s ease',
            fontFamily: "'Ubuntu', sans-serif"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(250, 212, 91, 0.9)';
            e.currentTarget.style.color = '#1a1412';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(26, 20, 18, 0.3)';
            e.currentTarget.style.color = '#FAD45B';
          }}>
            {hero.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
