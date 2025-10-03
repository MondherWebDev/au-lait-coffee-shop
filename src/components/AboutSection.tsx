'use client';

import Image from 'next/image';

interface AboutSectionProps {
  about: {
    title: string;
    content: string;
    image: string;
  };
}

export default function AboutSection({ about }: AboutSectionProps) {
  // Add fallback for undefined about prop
  const safeAbout = about || {
    title: 'Our Philosophy',
    content: 'At Au Lait, we see coffee as an art form. We meticulously source the world\'s finest beans from sustainable, high-altitude farms. Each batch is roasted with precision to unlock a complex symphony of flavors. Our mission is to deliver not just a beverage, but a luxurious moment of pause and pleasure in your day.',
    image: 'https://images.unsplash.com/photo-1530798985-ca4c54a2f42a?q=80&w=1170&auto=format&fit=crop'
  };
  return (
    <section id="about" style={{ padding: '80px 0' }}>
      {/* Debug info */}
      <div style={{ position: 'absolute', top: '-1000px', left: '-1000px', width: '1px', height: '1px', background: 'blue' }} id="about-debug"></div>
      <div className="about-content" style={{ opacity: 1, transform: 'translateY(0)' }}>
        {/* Text Content */}
        <div className="about-text">
          <h2>{safeAbout.title}</h2>
          <p>
            {safeAbout.content || "At Au Lait, we see coffee as an art form. We meticulously source the world's finest beans from sustainable, high-altitude farms. Each batch is roasted with precision to unlock a complex symphony of flavors. Our mission is to deliver not just a beverage, but a luxurious moment of pause and pleasure in your day."}
          </p>
          <div className="about-features">
            <div className="about-feature">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Sustainably Sourced Beans</span>
            </div>
            <div className="about-feature">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Expertly Roasted</span>
            </div>
            <div className="about-feature">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Premium Quality</span>
            </div>
          </div>
        </div>

        {/* Image */}
        {safeAbout.image && (
          <div style={{ position: 'relative' }}>
            <div style={{
              aspectRatio: '1',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <Image
                src={safeAbout.image}
                alt="Coffee brewing process"
                width={400}
                height={400}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
