'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import MenuSection from '@/components/MenuSection';
import AboutSection from '@/components/AboutSection';

import ContactSection from '@/components/ContactSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
import AdminDashboard from '@/components/AdminDashboard';
import AnimationProvider from '@/components/AnimationProvider';

interface ProductSize {
  size: string;
  price: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price?: string; // For backward compatibility
  sizes?: ProductSize[];
}

interface ContentData {
  logo: { url: string };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    video: string;
    backgroundImage?: string;
    overlayOpacity?: number;
    textPosition?: string;
    slides?: Array<{
      id: string;
      title: string;
      subtitle: string;
      cta: string;
      backgroundType: string;
      backgroundUrl: string;
      overlayOpacity: number;
      textPosition: string;
    }>;
  };
  about: {
    title: string;
    content: string;
    image: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    hours: string;
  };
  gallery: {
    title: string;
    images: string[];
  };
  footer: {
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
  settings: {
    siteTitle: string;
    favicon: string;
  };
  categories: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  products: Product[];
}

// Dynamic content loading - no hardcoded defaults
const getEmptyContent = (): ContentData => ({
  logo: { url: '' },
  hero: {
    title: 'Loading...',
    subtitle: 'Please wait while we load your content...',
    cta: 'Loading...',
    video: ''
  },
  about: {
    title: 'About Us',
    content: 'Content is loading...',
    image: ''
  },
  contact: {
    address: '',
    phone: '',
    email: '',
    hours: ''
  },
  gallery: {
    title: 'Our Gallery',
    images: []
  },
  footer: {
    brandName: 'Au Lait',
    brandDescription: 'Experience coffee that transcends the ordinary.',
    address: '123 Coffee Street',
    city: 'Metropolis, NY 10001',
    phone: '(555) 123-4567',
    email: 'contact@aulait.coffee',
    copyright: '© 2025 Au Lait Coffee Shop. All Rights Reserved.',
    socialLinks: []
  },
  settings: {
    siteTitle: 'Au Lait Coffee Shop',
    favicon: ''
  },
  categories: [],
  products: []
});

export default function Home() {
  const [content, setContent] = useState<ContentData>(getEmptyContent());
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Detect if we're on mobile and get the correct API URL
        const getApiBaseUrl = () => {
          const currentUrl = window.location.href;

          // If accessing from mobile IP, use the mobile API URL
          if (currentUrl.includes('192.168.106.129')) {
            return 'http://192.168.106.129:3001';
          }

          // For localhost access, try localhost first, then mobile IP
          return '';
        };

        // Load from API (Cloudinary data)
        const apiBaseUrl = getApiBaseUrl();
        const apiUrl = apiBaseUrl ? `${apiBaseUrl}/api/content` : '/api/content';

        console.log('🔗 Using API URL:', apiUrl);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setContent(result.data);
            console.log('✅ Content loaded from Cloudinary API');
          } else {
            throw new Error('API returned invalid data');
          }
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      } catch (error) {
        console.warn('⚠️ Server not available, falling back to localStorage:', error);

        // Fallback to localStorage
        const storedContent = localStorage.getItem('auLaitContent');
        if (storedContent) {
          try {
            const parsedContent = JSON.parse(storedContent);
            // Merge with empty content to ensure all required fields exist
            const mergedContent = { ...getEmptyContent(), ...parsedContent };
            setContent(mergedContent);
            console.log('✅ Content loaded from localStorage');
          } catch (parseError) {
            console.error('❌ Error parsing localStorage content:', parseError);
            setContent(getEmptyContent());
          }
        } else {
          console.log('📝 Using empty content structure');
          setContent(getEmptyContent());
        }
      } finally {
        // Hide loader after content loads - give more time for API
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 4000); // Increased to 4 seconds to allow proper loading

        return () => clearTimeout(timer);
      }
    };

    loadContent();
  }, []);

  // Listen for keyboard shortcut to open admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen for content updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auLaitContent' && e.newValue) {
        try {
          setContent(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing updated content:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isLoading) {
    return <Loader logo={content.logo} />;
  }

  return (
    <div className="min-h-screen bg-coffee-dark text-coffee-light">
      <AnimationProvider />
      <Header logo={content.logo} />
      <main>
        <div id="home" style={{ position: 'relative', top: '-80px' }}></div>
        <HeroSection hero={content.hero} />
        <MenuSection products={content.products} categories={content.categories} />
        <AboutSection about={content.about} />
        <ContactSection contact={content.contact} />
      </main>
      <Footer footer={content.footer} />

      {/* Hidden Admin Access Notice */}
      <div className="fixed bottom-4 right-4 text-xs opacity-0 hover:opacity-100 transition-opacity pointer-events-none text-gray-400">
        Press Ctrl+Shift+A for Admin
      </div>

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentContent={content}
        onContentUpdate={setContent}
      />
    </div>
  );
}
