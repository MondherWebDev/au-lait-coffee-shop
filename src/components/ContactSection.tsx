'use client';

import { useState } from 'react';

interface ContactSectionProps {
  contact: {
    address: string;
    phone: string;
    email: string;
    hours: string;
  };
}

export default function ContactSection({ contact }: ContactSectionProps) {
  // Add fallback for undefined contact prop
  const safeContact = contact || {
    address: '123 Coffee Street, Metropolis, NY 10001',
    phone: '(555) 123-4567',
    email: 'contact@aulait.coffee',
    hours: 'Mon - Fri: 6 AM - 8 PM, Sat - Sun: 7 AM - 7 PM'
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" style={{ padding: '80px 0' }}>
      {/* Debug info */}
      <div style={{ position: 'absolute', top: '-1000px', left: '-1000px', width: '1px', height: '1px', background: 'green' }} id="contact-debug"></div>
      <div className="contact-content" style={{ opacity: 1, transform: 'translateY(0)' }}>
        {/* Contact Information */}
        <div className="contact-info">
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#FAD45B',
            marginBottom: '24px'
          }}>
            Visit Us
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="contact-info-item">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#FAD45B', marginTop: '2px' }}>
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span style={{ color: '#f0e9e1', opacity: '0.9' }}>{safeContact.address}</span>
            </div>
            <div className="contact-info-item">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#FAD45B' }}>
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span style={{ color: '#f0e9e1', opacity: '0.9' }}>{safeContact.phone}</span>
            </div>
            <div className="contact-info-item">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#FAD45B' }}>
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span style={{ color: '#f0e9e1', opacity: '0.9' }}>{safeContact.email}</span>
            </div>
            <div className="contact-info-item">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#FAD45B', marginTop: '2px' }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span style={{ color: '#f0e9e1', opacity: '0.9' }}>{safeContact.hours}</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form">
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#FAD45B',
            marginBottom: '24px'
          }}>
            Send us a Message
          </h3>

          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <svg width="32" height="32" fill="white" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#FAD45B', marginBottom: '8px' }}>
                Message Sent!
              </p>
              <p style={{ color: '#f0e9e1', opacity: '0.7' }}>
                We will get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label htmlFor="name" style={{
                  display: 'block',
                  color: '#FAD45B',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(26, 20, 18, 0.8)',
                    border: '1px solid rgba(250, 212, 91, 0.3)',
                    borderRadius: '8px',
                    color: '#f0e9e1',
                    fontSize: '16px'
                  }}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="email" style={{
                  display: 'block',
                  color: '#FAD45B',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(26, 20, 18, 0.8)',
                    border: '1px solid rgba(250, 212, 91, 0.3)',
                    borderRadius: '8px',
                    color: '#f0e9e1',
                    fontSize: '16px'
                  }}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" style={{
                  display: 'block',
                  color: '#FAD45B',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(26, 20, 18, 0.8)',
                    border: '1px solid rgba(250, 212, 91, 0.3)',
                    borderRadius: '8px',
                    color: '#f0e9e1',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                  placeholder="Enter your message..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#FAD45B',
                  color: '#1a1412',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? '0.5' : '1',
                  border: 'none',
                  fontSize: '16px'
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
