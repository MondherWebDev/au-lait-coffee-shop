'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimationProvider() {
  useEffect(() => {
    // Header animation on scroll
    gsap.fromTo('header',
      {
        backgroundColor: 'rgba(26, 20, 18, 0.1)',
      },
      {
        backgroundColor: 'rgba(26, 20, 18, 0.95)',
        scrollTrigger: {
          trigger: 'header',
          start: 'top top',
          end: '100px top',
          scrub: true,
        }
      }
    );

    // Hero content animation
    const heroTimeline = gsap.timeline();

    heroTimeline
      .fromTo('.hero h1',
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        }
      )
      .fromTo('.hero p',
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.5'
      )
      .fromTo('.hero .btn-primary',
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.3'
      );

    // Menu cards animation - immediate visibility
    gsap.set('.menu-card', {
      opacity: 1,
      y: 0,
    });



    // About section animation - immediate visibility
    gsap.set('.about-content > *', {
      opacity: 1,
      x: 0,
    });

    // Contact section animation - immediate visibility
    gsap.set('.contact-content > *', {
      opacity: 1,
      y: 0,
    });

    // Parallax effect for hero video
    gsap.to('.hero video', {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });

  }, []);

  return null;
}
