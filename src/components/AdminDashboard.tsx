'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ProductManager from './ProductManager';
import CategoryManager from './CategoryManager';
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

// Security wrapper component
function AdminSecurityWrapper({ children, onAuthenticated }: { children: React.ReactNode; onAuthenticated: () => void }) {
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Get passcode from localStorage or use default
  const getStoredPasscode = () => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('adminPasscode') || 'admin123';
      } catch (error) {
        console.warn('Failed to access localStorage:', error);
        return 'admin123';
      }
    }
    return 'admin123';
  };

  const [storedPasscode, setStoredPasscode] = useState(getStoredPasscode());

  // Correct passcode - dynamically loaded
  const CORRECT_PASSCODE = storedPasscode;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Shift+A
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        console.log('🎹 Ctrl+Shift+A pressed - opening admin dashboard');
        event.preventDefault();
        setShowPasscodeModal(true);
        setPasscode('');
        setAuthError('');
      }
    };

    console.log('🎹 Admin dashboard keyboard shortcut listener attached');
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      console.log('🎹 Admin dashboard keyboard shortcut listener removed');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePasscodeSubmit = () => {
    if (passcode === CORRECT_PASSCODE) {
      setIsAuthenticated(true);
      setShowPasscodeModal(false);
      setAuthError('');
      onAuthenticated();
    } else {
      setAuthError('Incorrect passcode. Please try again.');
      setPasscode('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handlePasscodeSubmit();
    }
  };

  if (!isAuthenticated && !showPasscodeModal) {
    return null;
  }

  return (
    <>
      {children}
      {showPasscodeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 10001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1a1412',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '12px',
            border: '2px solid #FAD45B',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#FAD45B',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '24px'
            }}>
              🔐
            </div>

            <h2 style={{
              color: '#FAD45B',
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Admin Access Required
            </h2>

            <p style={{
              color: '#f0e9e1',
              opacity: 0.8,
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              Enter the admin passcode to access the dashboard
            </p>

            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter passcode"
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#2d2d2d',
                  border: '1px solid rgba(250, 212, 91, 0.3)',
                  borderRadius: '8px',
                  color: '#f0e9e1',
                  fontSize: '16px',
                  textAlign: 'center',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
            </div>

            {authError && (
              <div style={{
                color: '#ef4444',
                fontSize: '14px',
                marginBottom: '16px',
                padding: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '4px',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                {authError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setShowPasscodeModal(false);
                  setPasscode('');
                  setAuthError('');
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: '#f0e9e1',
                  border: '1px solid rgba(250, 212, 91, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePasscodeSubmit}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#FAD45B',
                  color: '#1a1412',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Access Dashboard
              </button>
            </div>

            <div style={{
              marginTop: '20px',
              fontSize: '12px',
              color: '#f0e9e1',
              opacity: 0.6
            }}>
              Press Ctrl+Shift+A to open this dialog
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: ContentData;
  onContentUpdate: (content: ContentData) => void;
}

export default function AdminDashboard({ isOpen, onClose, currentContent, onContentUpdate }: AdminDashboardProps) {
  const [content, setContent] = useState<ContentData>(currentContent);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [saveStatus, setSaveStatus] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: ''
  });
  const [isUploadingProductImage, setIsUploadingProductImage] = useState(false);
  const [contentVersion, setContentVersion] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showGalleryUpload, setShowGalleryUpload] = useState(false);
  const [isUploadingGalleryImage, setIsUploadingGalleryImage] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [heroBackgroundType, setHeroBackgroundType] = useState<'video' | 'image'>('video');
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [isDragEnabled, setIsDragEnabled] = useState(true);

  useEffect(() => {
    setContent(currentContent);
  }, [currentContent]);

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;

    setIsTabTransitioning(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsTabTransitioning(false);
    }, 150);
  };

  const saveContent = async () => {
    let apiUrl: string = '';

    try {
      setIsUploading(true);
      setSaveStatus('💾 Saving to server...');

      // Detect the correct API URL for mobile access
      const getApiBaseUrl = () => {
        const currentUrl = window.location.href;
        console.log('Current URL:', currentUrl);

        // If accessing from mobile IP, use the mobile API URL
        if (currentUrl.includes('192.168.106.129')) {
          return 'http://192.168.106.129:3001';
        }

        // For localhost access, use the Express server
        if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
          return 'http://localhost:3001';
        }

        // For production (Vercel), use the same domain (Next.js API routes)
        // Vercel KV will handle the persistence
        if (currentUrl.includes('vercel.app') || currentUrl.includes('au-lait-coffee-shop')) {
          console.log('🔒 Vercel production detected - using Vercel KV storage');
          return ''; // Use same domain for Next.js API routes
        }

        // Fallback
        return '';
      };

      const apiBaseUrl = getApiBaseUrl();

      apiUrl = apiBaseUrl ? `${apiBaseUrl}/api/content/bulk` : '/api/content/bulk';

      console.log('🎯 Using API URL:', apiUrl);

      console.log('💾 Saving to API URL:', apiUrl);
      console.log('💾 Content being saved:', JSON.stringify(content, null, 2));

      // Use the API to save content
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      console.log('💾 Response status:', response.status);
      console.log('💾 Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('💾 Server response:', result);

      if (result.success) {
        onContentUpdate(content);
        setLastSaved(new Date());
        setContentVersion(prev => prev + 1);
        setSaveStatus('✅ Content saved successfully to server!');

        // Also save to localStorage as backup
        localStorage.setItem('auLaitContent', JSON.stringify(content));

        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        throw new Error(result.message || 'Server save failed');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;

      console.error('❌ Error saving content:', error);
      console.error('❌ Error details:', {
        message: errorMessage,
        stack: errorStack,
        apiUrl: apiUrl,
        contentKeys: Object.keys(content)
      });

      setSaveStatus(`❌ Error saving content: ${errorMessage}`);

      // Fallback to localStorage if server fails
      try {
        localStorage.setItem('auLaitContent', JSON.stringify(content));
        onContentUpdate(content);
        setSaveStatus('✅ Saved to localStorage (server unavailable)');
        setTimeout(() => setSaveStatus(''), 3000);
      } catch (localError: unknown) {
        const localErrorMessage = localError instanceof Error ? localError.message : 'Unknown localStorage error';
        console.error('❌ localStorage error:', localError);
        setSaveStatus('❌ Error saving to both server and localStorage');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const updateContent = <K extends keyof ContentData>(section: K, updates: Partial<ContentData[K]>) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  const uploadToCloudinary = async (file: File, type: 'image' | 'video'): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'au_lait_preset');

      // Get cloud name from environment or use default
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';

      // Log the exact URL being used for debugging
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`;
      console.log('📤 Upload URL:', uploadUrl);
      console.log('📤 Upload preset:', 'au_lait_preset');

      console.log('🔄 Uploading to Cloudinary...');
      console.log('Cloud name:', cloudName);
      console.log('File size:', file.size);
      console.log('File type:', file.type);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary error response:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleImageUpload = async (section: string, file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(prev => ({ ...prev, [section]: 0 }));

    try {
      const url = await uploadToCloudinary(file, 'image');
      updateContent(section as keyof ContentData, { image: url });
      setUploadProgress(prev => ({ ...prev, [section]: 100 }));
    } catch (error) {
      console.error('Upload error:', error);
      setSaveStatus('❌ Upload failed');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, [section]: 0 }));
      }, 1000);
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'video');
      updateContent('hero', { video: url });
    } catch (error) {
      console.error('Video upload error:', error);
      setSaveStatus('❌ Video upload failed');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleHeroImageUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'image');
      updateContent('hero', { backgroundImage: url });
    } catch (error) {
      console.error('Hero image upload error:', error);
      setSaveStatus('❌ Hero image upload failed');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const openAddProductModal = () => {
    const firstCategory = content.categories?.length > 0 ? content.categories[0].id : '';
    setNewProduct({
      name: '',
      price: '',
      description: '',
      category: firstCategory,
      image: ''
    });
    setShowAddProductModal(true);
  };

  const closeAddProductModal = () => {
    setShowAddProductModal(false);
    setNewProduct({
      name: '',
      price: '',
      description: '',
      category: '',
      image: ''
    });
  };

  const handleNewProductImageUpload = async (file: File) => {
    if (!file) return;

    setIsUploadingProductImage(true);
    try {
      const url = await uploadToCloudinary(file, 'image');
      setNewProduct(prev => ({ ...prev, image: url }));
    } catch (error) {
      console.error('Product image upload error:', error);
      setSaveStatus('❌ Product image upload failed');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsUploadingProductImage(false);
    }
  };

  const saveNewProduct = () => {
    // Validation
    if (!newProduct.name.trim() || !newProduct.price.trim() || !newProduct.description.trim()) {
      setSaveStatus('❌ Please fill in all required fields');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    if (!newProduct.category) {
      setSaveStatus('❌ Please select a category');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    if (!newProduct.image) {
      setSaveStatus('❌ Please upload a product image');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    // Create new product
    const product = {
      id: Date.now().toString(),
      name: newProduct.name.trim(),
      price: newProduct.price.trim(),
      description: newProduct.description.trim(),
      category: newProduct.category,
      image: newProduct.image
    };

    setContent(prev => ({
      ...prev,
      products: [...prev.products, product]
    }));

    closeAddProductModal();
    setSaveStatus('✅ Product added successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const updateProduct = (index: number, updates: Partial<ContentData['products'][0]>) => {
    setContent(prev => ({
      ...prev,
      products: prev.products.map((product, i) =>
        i === index ? { ...product, ...updates } : product
      )
    }));
  };

  const deleteProduct = (index: number) => {
    setContent(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const updateFooter = (updates: Partial<ContentData['footer']>) => {
    setContent(prev => ({
      ...prev,
      footer: { ...prev.footer, ...updates }
    }));
  };

  const addSocialLink = (platform: string, url: string) => {
    if (!url.trim()) return;

    const newLink = {
      id: Date.now().toString(),
      platform: platform.toLowerCase(),
      url: url.trim(),
      icon: platform.toLowerCase() // Store platform name instead of JSX element
    };

    setContent(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        socialLinks: [...(prev.footer?.socialLinks || []), newLink]
      }
    }));
  };

  const updateSocialLink = (index: number, updates: Partial<ContentData['footer']['socialLinks'][0]>) => {
    setContent(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        socialLinks: prev.footer!.socialLinks.map((link, i) =>
          i === index ? { ...link, ...updates } : link
        )
      }
    }));
  };

  const deleteSocialLink = (index: number) => {
    setContent(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        socialLinks: prev.footer!.socialLinks.filter((_, i) => i !== index)
      }
    }));
  };

  const getSocialIcon = (platform: string): React.JSX.Element => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />;
      case 'twitter':
      case 'x':
        return <FontAwesomeIcon icon={faXTwitter} className="w-6 h-6" />;
      case 'facebook':
        return <FontAwesomeIcon icon={faFacebook} className="w-6 h-6" />;
      case 'youtube':
        return <FontAwesomeIcon icon={faYoutube} className="w-6 h-6" />;
      case 'linkedin':
        return <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />;
      case 'tiktok':
        return <FontAwesomeIcon icon={faTiktok} className="w-6 h-6" />;
      default:
        return <FontAwesomeIcon icon={faLink} className="w-6 h-6" />;
    }
  };

  const exportContent = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `aulait-content-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedContent = JSON.parse(e.target?.result as string);
        setContent(importedContent);
        setSaveStatus('✅ Content imported successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
      } catch (error) {
        setSaveStatus('❌ Invalid file format');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <AdminSecurityWrapper onAuthenticated={() => {}}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: '#1a1412',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          borderRadius: '12px',
          border: '1px solid #FAD45B',
          overflow: 'hidden'
        }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(250, 212, 91, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ color: '#FAD45B', fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
              Au Lait Admin Dashboard
            </h1>
            <p style={{ color: '#f0e9e1', opacity: 0.7, fontSize: '14px' }}>
              Content Management System
            </p>
            {/* Status Bar */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '8px',
              fontSize: '12px',
              color: '#f0e9e1',
              opacity: 0.8
            }}>
              <span>📊 Version: {contentVersion}</span>
              {lastSaved && (
                <span>💾 Last saved: {lastSaved.toLocaleTimeString()}</span>
              )}
              <span>📱 {content.products.length} products</span>
              <span>🏷️ {content.categories.length} categories</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#f0e9e1',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.color = '#FAD45B';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.color = '#f0e9e1';
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(250, 212, 91, 0.2)',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'hero', label: 'Hero' },
            { id: 'product-manager', label: 'Product Manager' },
            { id: 'category-manager', label: 'Category Manager' },
            { id: 'about', label: 'About' },
            { id: 'contact', label: 'Contact' },
            { id: 'footer', label: 'Footer' },
            { id: 'settings', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#FAD45B' : 'transparent',
                color: activeTab === tab.id ? '#1a1412' : '#f0e9e1',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                transform: activeTab === tab.id ? 'scale(1.05)' : 'scale(1)',
                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(250, 212, 91, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = 'rgba(250, 212, 91, 0.1)';
                  target.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = 'transparent';
                  target.style.transform = 'scale(1)';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          maxHeight: '60vh',
          overflowY: 'auto',
          opacity: isTabTransitioning ? 0.7 : 1,
          transform: isTabTransitioning ? 'scale(0.98)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}>
          {/* Hero Section */}
          {activeTab === 'hero' && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ color: '#FAD45B', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                Hero Section
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px' }}>Title</label>
                  <input
                    type="text"
                    value={content.hero.title}
                    onChange={(e) => updateContent('hero', { title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#2d2d2d',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      borderRadius: '8px',
                      color: '#f0e9e1'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px' }}>CTA Button</label>
                  <input
                    type="text"
                    value={content.hero.cta}
                    onChange={(e) => updateContent('hero', { cta: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#2d2d2d',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      borderRadius: '8px',
                      color: '#f0e9e1'
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px' }}>Subtitle</label>
                <textarea
                  value={content.hero.subtitle}
                  onChange={(e) => updateContent('hero', { subtitle: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#2d2d2d',
                    border: '1px solid rgba(250, 212, 91, 0.3)',
                    borderRadius: '8px',
                    color: '#f0e9e1',
                    resize: 'vertical'
                  }}
                />
              </div>
              {/* Hero Background Options */}
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'rgba(45, 45, 45, 0.5)', borderRadius: '8px', border: '1px solid rgba(250, 212, 91, 0.2)' }}>
                <h3 style={{ color: '#FAD45B', fontSize: '16px', marginBottom: '12px' }}>🎬 Hero Background</h3>

                {/* Background Type Toggle */}
                <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setHeroBackgroundType('video')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      backgroundColor: heroBackgroundType === 'video' ? '#FAD45B' : 'transparent',
                      color: heroBackgroundType === 'video' ? '#1a1412' : '#f0e9e1',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    📹 Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroBackgroundType('image')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      backgroundColor: heroBackgroundType === 'image' ? '#FAD45B' : 'transparent',
                      color: heroBackgroundType === 'image' ? '#1a1412' : '#f0e9e1',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    🖼️ Image
                  </button>
                </div>

                {/* Video Background */}
                {heroBackgroundType === 'video' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px' }}>Background Video URL</label>
                    <input
                      type="url"
                      value={content.hero.video}
                      onChange={(e) => updateContent('hero', { video: e.target.value })}
                      placeholder="https://example.com/video.mp4"
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#2d2d2d',
                        border: '1px solid rgba(250, 212, 91, 0.3)',
                        borderRadius: '8px',
                        color: '#f0e9e1',
                        marginBottom: '8px'
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])}
                        style={{ padding: '8px', backgroundColor: '#2d2d2d', border: '1px solid rgba(250, 212, 91, 0.3)', borderRadius: '4px', color: '#f0e9e1' }}
                      />
                      <div style={{ fontSize: '12px', color: '#f0e9e1', opacity: 0.7 }}>
                        💡 Tip: Upload videos to Cloudinary for best performance
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Background */}
                {heroBackgroundType === 'image' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px' }}>Background Image URL</label>
                    <input
                      type="url"
                      value={content.hero.backgroundImage || ''}
                      onChange={(e) => updateContent('hero', { backgroundImage: e.target.value })}
                      placeholder="https://example.com/hero-bg.jpg"
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#2d2d2d',
                        border: '1px solid rgba(250, 212, 91, 0.3)',
                        borderRadius: '8px',
                        color: '#f0e9e1',
                        marginBottom: '8px'
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleHeroImageUpload(e.target.files[0])}
                        style={{ padding: '8px', backgroundColor: '#2d2d2d', border: '1px solid rgba(250, 212, 91, 0.3)', borderRadius: '4px', color: '#f0e9e1' }}
                      />
                      <div style={{ fontSize: '12px', color: '#f0e9e1', opacity: 0.7 }}>
                        💡 Tip: Use high-resolution images (1920x1080 or higher) for best results
                      </div>
                    </div>

                    {/* Background Image Preview */}
                    {content.hero.backgroundImage && (
                      <div style={{ marginTop: '12px', textAlign: 'center' }}>
                        <Image
                          src={content.hero.backgroundImage}
                          alt="Hero background preview"
                          width={300}
                          height={150}
                          style={{
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid rgba(250, 212, 91, 0.3)'
                          }}
                        />
                      </div>
                    )}

                    {/* Background Image Settings */}
                    <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'rgba(250, 212, 91, 0.05)', borderRadius: '6px', border: '1px solid rgba(250, 212, 91, 0.2)' }}>
                      <h4 style={{ color: '#FAD45B', fontSize: '14px', marginBottom: '8px' }}>🖼️ Background Settings</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ color: '#FAD45B', display: 'block', marginBottom: '4px', fontSize: '12px' }}>Overlay Opacity</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={content.hero.overlayOpacity || 50}
                            onChange={(e) => updateContent('hero', { overlayOpacity: parseInt(e.target.value) })}
                            style={{ width: '100%' }}
                          />
                          <div style={{ fontSize: '10px', color: '#f0e9e1', opacity: 0.7, textAlign: 'center' }}>
                            {content.hero.overlayOpacity || 50}%
                          </div>
                        </div>
                        <div>
                          <label style={{ color: '#FAD45B', display: 'block', marginBottom: '4px', fontSize: '12px' }}>Text Position</label>
                          <select
                            value={content.hero.textPosition || 'center'}
                            onChange={(e) => updateContent('hero', { textPosition: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '4px',
                              backgroundColor: '#2d2d2d',
                              border: '1px solid rgba(250, 212, 91, 0.3)',
                              borderRadius: '4px',
                              color: '#f0e9e1',
                              fontSize: '12px'
                            }}
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Categories Section */}
          {activeTab === 'categories' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ color: '#FAD45B', fontSize: '20px', fontWeight: '600' }}>Categories</h2>
                <button
                  onClick={() => {
                    const categoryNames = [
                      'Hot Drinks', 'Cold Drinks', 'Savory Crepes', 'Sweet Crepes',
                      'Specialty Drinks', 'Smoothies', 'Breakfast Sandwich', 'Brunch',
                      'Sandwich', 'Omelets', 'Soup & Salads', 'Benedicts'
                    ];
                    const categoryIds = [
                      'hot-drinks', 'cold-drinks', 'savory-crepes', 'sweet-crepes',
                      'specialty-drinks', 'smoothies', 'breakfast-sandwich', 'brunch',
                      'sandwich', 'omelets', 'soup-salads', 'benedicts'
                    ];

                    const newCategory = {
                      id: categoryIds[content.categories.length] || `category-${Date.now()}`,
                      name: categoryNames[content.categories.length] || 'New Category',
                      description: 'Category description'
                    };

                    if (content.categories.length < 12) {
                      setContent(prev => ({
                        ...prev,
                        categories: [...prev.categories, newCategory]
                      }));
                    }
                  }}
                  style={{
                    backgroundColor: '#FAD45B',
                    color: '#1a1412',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Add Category
                </button>
              </div>

              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(250, 212, 91, 0.1)', borderRadius: '8px', border: '1px solid rgba(250, 212, 91, 0.3)' }}>
                <p style={{ color: '#FAD45B', fontSize: '14px', margin: '0' }}>
                  <strong>Available Categories:</strong> Hot Drinks, Cold Drinks, Savory Crepes, Sweet Crepes, Specialty Drinks, Smoothies, Breakfast Sandwich, Brunch, Sandwich, Omelets, Soup & Salads, Benedicts
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {content.categories?.map((category, index) => (
                  <div key={category.id} style={{
                    backgroundColor: 'rgba(45, 45, 45, 0.5)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(250, 212, 91, 0.2)'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', marginBottom: '12px' }}>
                      <input
                        type="text"
                        placeholder="Category Name"
                        value={category.name}
                        onChange={(e) => {
                          const updatedCategories = [...content.categories];
                          updatedCategories[index] = { ...category, name: e.target.value };
                          setContent(prev => ({ ...prev, categories: updatedCategories }));
                        }}
                        style={{
                          padding: '8px',
                          backgroundColor: '#1a1412',
                          border: '1px solid rgba(250, 212, 91, 0.3)',
                          borderRadius: '4px',
                          color: '#f0e9e1',
                          fontSize: '14px'
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Category ID"
                        value={category.id}
                        onChange={(e) => {
                          const updatedCategories = [...content.categories];
                          updatedCategories[index] = { ...category, id: e.target.value };
                          setContent(prev => ({ ...prev, categories: updatedCategories }));
                        }}
                        style={{
                          padding: '8px',
                          backgroundColor: '#1a1412',
                          border: '1px solid rgba(250, 212, 91, 0.3)',
                          borderRadius: '4px',
                          color: '#f0e9e1',
                          fontSize: '14px'
                        }}
                      />
                      <button
                        onClick={() => {
                          setContent(prev => ({
                            ...prev,
                            categories: prev.categories.filter((_, i) => i !== index)
                          }));
                        }}
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    <textarea
                      placeholder="Category Description"
                      value={category.description}
                      onChange={(e) => {
                        const updatedCategories = [...content.categories];
                        updatedCategories[index] = { ...category, description: e.target.value };
                        setContent(prev => ({ ...prev, categories: updatedCategories }));
                      }}
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: '#1a1412',
                        border: '1px solid rgba(250, 212, 91, 0.3)',
                        borderRadius: '4px',
                        color: '#f0e9e1',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                ))}

                {(!content.categories || content.categories.length === 0) && (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#FAD45B',
                    backgroundColor: 'rgba(250, 212, 91, 0.1)',
                    borderRadius: '8px',
                    border: '2px dashed rgba(250, 212, 91, 0.3)'
                  }}>
                    <h3>No Categories Found</h3>
                    <p>Categories will appear here once loaded from the database.</p>
                    <button
                      onClick={() => {
                        // Load default categories
                        const defaultCategories = [
                          { id: 'hot-drinks', name: 'Hot Drinks', description: 'Our signature hot coffee beverages' },
                          { id: 'cold-drinks', name: 'Cold Drinks', description: 'Refreshing cold coffee drinks' },
                          { id: 'savory-crepes', name: 'Savory Crepes', description: 'Delicious savory crepe options' },
                          { id: 'sweet-crepes', name: 'Sweet Crepes', description: 'Sweet and decadent crepe varieties' },
                          { id: 'specialty-drinks', name: 'Specialty Drinks', description: 'Unique and specialty beverage options' },
                          { id: 'smoothies', name: 'Smoothies', description: 'Fresh and healthy smoothie options' }
                        ];
                        setContent(prev => ({ ...prev, categories: defaultCategories }));
                      }}
                      style={{
                        backgroundColor: '#FAD45B',
                        color: '#1a1412',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginTop: '16px'
                      }}
                    >
                      Load Default Categories
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products Section */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ color: '#FAD45B', fontSize: '20px', fontWeight: '600' }}>Products</h2>
                <button
                  onClick={openAddProductModal}
                  style={{
                    backgroundColor: '#FAD45B',
                    color: '#1a1412',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Add Product
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {content.products && content.products.map((product, index) => (
                  <div key={product.id} style={{
                    backgroundColor: 'rgba(45, 45, 45, 0.5)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(250, 212, 91, 0.2)'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', marginBottom: '12px' }}>
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={product.name}
                        onChange={(e) => updateProduct(index, { name: e.target.value })}
                        style={{
                          padding: '8px',
                          backgroundColor: '#1a1412',
                          border: '1px solid rgba(250, 212, 91, 0.3)',
                          borderRadius: '4px',
                          color: '#f0e9e1',
                          fontSize: '14px'
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Price"
                        value={product.price}
                        onChange={(e) => updateProduct(index, { price: e.target.value })}
                        style={{
                          padding: '8px',
                          backgroundColor: '#1a1412',
                          border: '1px solid rgba(250, 212, 91, 0.3)',
                          borderRadius: '4px',
                          color: '#f0e9e1',
                          fontSize: '14px'
                        }}
                      />
                      <select
                        value={product.category}
                        onChange={(e) => updateProduct(index, { category: e.target.value })}
                        style={{
                          padding: '8px',
                          backgroundColor: '#1a1412',
                          border: '1px solid rgba(250, 212, 91, 0.3)',
                          borderRadius: '4px',
                          color: '#f0e9e1',
                          fontSize: '14px'
                        }}
                      >
                        {content.categories?.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => deleteProduct(index)}
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    <textarea
                      placeholder="Description"
                      value={product.description}
                      onChange={(e) => updateProduct(index, { description: e.target.value })}
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: '#1a1412',
                        border: '1px solid rgba(250, 212, 91, 0.3)',
                        borderRadius: '4px',
                        color: '#f0e9e1',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About Section */}
          {activeTab === 'about' && (
            <div>
              <h2 style={{ color: '#FAD45B', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                About Section
              </h2>

              {/* About Image Upload */}
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'rgba(45, 45, 45, 0.5)', borderRadius: '8px', border: '1px solid rgba(250, 212, 91, 0.2)' }}>
                <h3 style={{ color: '#FAD45B', fontSize: '16px', marginBottom: '12px' }}>📸 About Image</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <input
                    type="url"
                    placeholder="About Image URL"
                    value={content.about.image}
                    onChange={(e) => updateContent('about', { image: e.target.value })}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#2d2d2d',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      borderRadius: '8px',
                      color: '#f0e9e1'
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload('about', e.target.files[0])}
                    style={{ padding: '8px', backgroundColor: '#2d2d2d', border: '1px solid rgba(250, 212, 91, 0.3)', borderRadius: '4px', color: '#f0e9e1' }}
                  />
                </div>
                {content.about.image && (
                  <div style={{ textAlign: 'center' }}>
                    <Image
                      src={content.about.image}
                      alt="About section"
                      width={300}
                      height={200}
                      style={{
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid rgba(250, 212, 91, 0.3)'
                      }}
                    />
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="About Title"
                value={content.about.title}
                onChange={(e) => updateContent('about', { title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#2d2d2d',
                  border: '1px solid rgba(250, 212, 91, 0.3)',
                  borderRadius: '8px',
                  color: '#f0e9e1',
                  marginBottom: '12px'
                }}
              />
              <textarea
                placeholder="About Content"
                value={content.about.content}
                onChange={(e) => updateContent('about', { content: e.target.value })}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#2d2d2d',
                  border: '1px solid rgba(250, 212, 91, 0.3)',
                  borderRadius: '8px',
                  color: '#f0e9e1',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          {/* Contact Section */}
          {activeTab === 'contact' && (
            <div>
              <h2 style={{ color: '#FAD45B', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                Contact Information
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Address"
                  value={content.contact.address}
                  onChange={(e) => updateContent('contact', { address: e.target.value })}
                  style={{
                    padding: '12px',
                    backgroundColor: '#2d2d2d',
                    border: '1px solid rgba(250, 212, 91, 0.3)',
                    borderRadius: '8px',
                    color: '#f0e9e1'
                  }}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={content.contact.phone}
                  onChange={(e) => updateContent('contact', { phone: e.target.value })}
                  style={{
                    padding: '12px',
                    backgroundColor: '#2d2d2d',
                    border: '1px solid rgba(250, 212, 91, 0.3)',
                    borderRadius: '8px',
                    color: '#f0e9e1'
                  }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={content.contact.email}
                  onChange={(e) => updateContent('contact', { email: e.target.value })}
                  style={{
                    padding: '12px',
                    backgroundColor: '#2d2d2d',
                    border: '1px solid rgba(250, 212, 91, 0.3)',
                    borderRadius: '8px',
                    color: '#f0e9e1'
                  }}
                />
                <input
                  type="text"
                  placeholder="Hours"
                  value={content.contact.hours}
                  onChange={(e) => updateContent('contact', { hours: e.target.value })}
                  style={{
                    padding: '12px',
                    backgroundColor: '#2d2d2d',
                    border: '1px solid rgba(250, 212, 91, 0.3)',
                    borderRadius: '8px',
                    color: '#f0e9e1'
                  }}
                />
              </div>
            </div>
          )}

          {/* Footer Section */}
          {activeTab === 'footer' && (
            <div>
              <h2 style={{ color: '#FAD45B', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                Footer Management
              </h2>

              {/* Footer Brand */}
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'rgba(45, 45, 45, 0.5)', borderRadius: '8px', border: '1px solid rgba(250, 212, 91, 0.2)' }}>
                <h3 style={{ color: '#FAD45B', fontSize: '16px', marginBottom: '12px' }}>🏪 Brand Information</h3>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px' }}>Brand Name</label>
                  <input
                    type="text"
                    placeholder="Au Lait"
                    value={content.settings?.siteTitle || 'Au Lait'}
                    onChange={(e) => updateContent('settings', { siteTitle: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#2d2d2d',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      borderRadius: '8px',
                      color: '#f0e9e1'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px' }}>Brand Description</label>
                  <textarea
                    placeholder="Experience coffee that transcends the ordinary. Crafted with passion, brewed to perfection."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#2d2d2d',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      borderRadius: '8px',
                      color: '#f0e9e1',
                      resize: 'vertical'
                    }}
                    defaultValue="Experience coffee that transcends the ordinary. Crafted with passion, brewed to perfection. Your journey to exceptional coffee starts at Au Lait."
                  />
                </div>
              </div>

              {/* Footer Contact Information */}
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'rgba(45, 45, 45, 0.5)', borderRadius: '8px', border: '1px solid rgba(250, 212, 91, 0.2)' }}>
                <h3 style={{ color: '#FAD45B', fontSize: '16px', marginBottom: '12px' }}>📍 Contact Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={content.footer?.address || ''}
                    onChange={(e) => updateFooter({ address: e.target.value })}
                    style={{
                      padding: '12px',
                      backgroundColor: '#2d2d2d',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      borderRadius: '8px',
                      color: '#f0e9e1'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="City, State ZIP"
                    value={content.footer?.city || ''}
                    onChange={(e) => updateFooter({ city: e.target.value })}
                    style={{
                      padding: '12px',
                      backgroundColor: '#2d2d2d',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      borderRadius: '8px',
                      color: '#f0e9e1'
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={content.footer?.phone || ''}
                    onChange={(e) => updateFooter({ phone: e.target.value })}
                    style={{
                      padding: '12px',
                      backgroundColor: '#2d2d2d',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      borderRadius: '8px',
                      color: '#f0e9e1'
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={content.footer?.email || ''}
                    onChange={(e) => updateFooter({ email: e.target.value })}
                    style={{
                      padding: '12px',
                      backgroundColor: '#2d2d2d',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      borderRadius: '8px',
                      color: '#f0e9e1'
                    }}
                  />
                </div>
              </div>

              {/* Footer Copyright */}
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'rgba(45, 45, 45, 0.5)', borderRadius: '8px', border: '1px solid rgba(250, 212, 91, 0.2)' }}>
                <h3 style={{ color: '#FAD45B', fontSize: '16px', marginBottom: '12px' }}>© Copyright</h3>
                <input
                  type="text"
                  placeholder="© 2025 Your Coffee Shop Name. All Rights Reserved."
                  defaultValue="© 2025 Au Lait Coffee Shop. All Rights Reserved."
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#2d2d2d',
                    border: '1px solid rgba(250, 212, 91, 0.3)',
                    borderRadius: '8px',
                    color: '#f0e9e1'
                  }}
                />
              </div>

              {/* Social Media Links Management */}
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'rgba(45, 45, 45, 0.5)', borderRadius: '8px', border: '1px solid rgba(250, 212, 91, 0.2)' }}>
                <h3 style={{ color: '#FAD45B', fontSize: '16px', marginBottom: '12px' }}>🌐 Social Media Links</h3>

                {/* Add New Social Link */}
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(250, 212, 91, 0.05)', borderRadius: '6px', border: '1px solid rgba(250, 212, 91, 0.2)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
                    <select
                      id="socialPlatform"
                      style={{
                        padding: '8px',
                        backgroundColor: '#2d2d2d',
                        border: '1px solid rgba(250, 212, 91, 0.3)',
                        borderRadius: '4px',
                        color: '#f0e9e1',
                        fontSize: '14px'
                      }}
                      defaultValue=""
                    >
                      <option value="">Select Platform</option>
                      <option value="instagram">Instagram</option>
                      <option value="twitter">Twitter</option>
                      <option value="facebook">Facebook</option>
                      <option value="youtube">YouTube</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="tiktok">TikTok</option>
                    </select>
                    <input
                      id="socialUrl"
                      type="url"
                      placeholder="https://..."
                      style={{
                        padding: '8px',
                        backgroundColor: '#2d2d2d',
                        border: '1px solid rgba(250, 212, 91, 0.3)',
                        borderRadius: '4px',
                        color: '#f0e9e1',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      onClick={() => {
                        const platform = (document.getElementById('socialPlatform') as HTMLSelectElement).value;
                        const url = (document.getElementById('socialUrl') as HTMLInputElement).value;
                        if (platform && url) {
                          addSocialLink(platform, url);
                          (document.getElementById('socialPlatform') as HTMLSelectElement).value = '';
                          (document.getElementById('socialUrl') as HTMLInputElement).value = '';
                        }
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#FAD45B',
                        color: '#1a1412',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      Add Link
                    </button>
                  </div>
                </div>

                {/* Existing Social Links */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {content.footer?.socialLinks?.map((link, index) => (
                    <div key={link.id} style={{
                      padding: '12px',
                      backgroundColor: 'rgba(250, 212, 91, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(250, 212, 91, 0.2)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#FAD45B' }}>
                          {getSocialIcon(link.platform)}
                        </div>
                        <button
                          onClick={() => {
                            setContent(prev => ({
                              ...prev,
                              footer: {
                                ...prev.footer!,
                                socialLinks: prev.footer!.socialLinks.filter((_, i) => i !== index)
                              }
                            }));
                          }}
                          style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            width: '20px',
                            height: '20px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => {
                          const updatedLinks = [...content.footer!.socialLinks];
                          updatedLinks[index] = { ...link, url: e.target.value };
                          setContent(prev => ({
                            ...prev,
                            footer: {
                              ...prev.footer!,
                              socialLinks: updatedLinks
                            }
                          }));
                        }}
                        placeholder="Social media URL"
                        style={{
                          width: '100%',
                          padding: '6px',
                          backgroundColor: '#2d2d2d',
                          border: '1px solid rgba(250, 212, 91, 0.3)',
                          borderRadius: '4px',
                          color: '#f0e9e1',
                          fontSize: '12px'
                        }}
                      />
                    </div>
                  ))}

                  {(!content.footer?.socialLinks || content.footer.socialLinks.length === 0) && (
                    <div style={{
                      gridColumn: '1 / -1',
                      textAlign: 'center',
                      padding: '24px',
                      color: '#FAD45B',
                      backgroundColor: 'rgba(250, 212, 91, 0.05)',
                      borderRadius: '8px',
                      border: '2px dashed rgba(250, 212, 91, 0.3)'
                    }}>
                      <p>No social media links added yet. Use the form above to add your first link.</p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#f0e9e1', opacity: 0.7, textAlign: 'center' }}>
                💡 Footer content will be visible on all pages of your website
              </div>
            </div>
          )}

          {/* Product Manager Section */}
          {activeTab === 'product-manager' && (
            <ProductManager
              products={content.products}
              categories={content.categories}
              onUpdateProducts={(products) => {
                setContent(prev => ({ ...prev, products }));
              }}
            />
          )}

          {/* Category Manager Section */}
          {activeTab === 'category-manager' && (
            <CategoryManager
              categories={content.categories}
              onUpdateCategories={(categories) => {
                setContent(prev => ({ ...prev, categories }));
              }}
            />
          )}

          {/* Settings Section */}
          {activeTab === 'settings' && (
            <div>
              <h2 style={{ color: '#FAD45B', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                Website Settings
              </h2>

              {/* Logo Management */}
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'rgba(45, 45, 45, 0.5)', borderRadius: '8px', border: '1px solid rgba(250, 212, 91, 0.2)' }}>
                <h3 style={{ color: '#FAD45B', fontSize: '16px', marginBottom: '12px' }}>🎨 Logo Management</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <input
                    type="url"
                    placeholder="Logo URL"
                    value={content.logo.url}
                    onChange={(e) => updateContent('logo', { url: e.target.value })}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#2d2d2d',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      borderRadius: '8px',
                      color: '#f0e9e1'
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload('logo', e.target.files[0])}
                    style={{ padding: '8px', backgroundColor: '#2d2d2d', border: '1px solid rgba(250, 212, 91, 0.3)', borderRadius: '4px', color: '#f0e9e1' }}
                  />
                </div>
                {content.logo.url && (
                  <div style={{ textAlign: 'center' }}>
                    <Image
                      src={content.logo.url}
                      alt="Current Logo"
                      width={150}
                      height={60}
                      style={{ maxHeight: '60px', maxWidth: '150px', objectFit: 'contain' }}
                    />
                  </div>
                )}
              </div>

              {/* Site Settings */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px' }}>Site Title</label>
                <input
                  type="text"
                  placeholder="Site Title"
                  value={content.settings?.siteTitle || ''}
                  onChange={(e) => updateContent('settings', { siteTitle: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#2d2d2d',
                    border: '1px solid rgba(250, 212, 91, 0.3)',
                    borderRadius: '8px',
                    color: '#f0e9e1',
                    marginBottom: '12px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px' }}>Favicon URL</label>
                <input
                  type="url"
                  placeholder="Favicon URL"
                  value={content.settings?.favicon || ''}
                  onChange={(e) => updateContent('settings', { favicon: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#2d2d2d',
                    border: '1px solid rgba(250, 212, 91, 0.3)',
                    borderRadius: '8px',
                    color: '#f0e9e1'
                  }}
                />
              </div>

              {/* Admin Passcode Management */}
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'rgba(45, 45, 45, 0.5)', borderRadius: '8px', border: '1px solid rgba(250, 212, 91, 0.2)' }}>
                <h3 style={{ color: '#FAD45B', fontSize: '16px', marginBottom: '12px' }}>🔐 Admin Passcode Management</h3>
                <p style={{ color: '#f0e9e1', opacity: 0.8, fontSize: '14px', marginBottom: '16px' }}>
                  Change the admin dashboard access passcode. Current passcode: <strong>admin123</strong>
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px' }}>New Passcode</label>
                  <input
                    type="password"
                    id="newPasscode"
                    placeholder="Enter new passcode"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#2d2d2d',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      borderRadius: '8px',
                      color: '#f0e9e1',
                      marginBottom: '8px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px' }}>Confirm New Passcode</label>
                  <input
                    type="password"
                    id="confirmPasscode"
                    placeholder="Confirm new passcode"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#2d2d2d',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      borderRadius: '8px',
                      color: '#f0e9e1'
                    }}
                  />
                </div>

                <button
                  onClick={() => {
                    const newPasscode = (document.getElementById('newPasscode') as HTMLInputElement).value;
                    const confirmPasscode = (document.getElementById('confirmPasscode') as HTMLInputElement).value;

                    if (!newPasscode.trim()) {
                      setSaveStatus('❌ Please enter a new passcode');
                      setTimeout(() => setSaveStatus(''), 3000);
                      return;
                    }

                    if (newPasscode !== confirmPasscode) {
                      setSaveStatus('❌ Passcodes do not match');
                      setTimeout(() => setSaveStatus(''), 3000);
                      return;
                    }

                    if (newPasscode.length < 4) {
                      setSaveStatus('❌ Passcode must be at least 4 characters long');
                      setTimeout(() => setSaveStatus(''), 3000);
                      return;
                    }

                    // Save new passcode to localStorage
                    localStorage.setItem('adminPasscode', newPasscode);
                    (document.getElementById('newPasscode') as HTMLInputElement).value = '';
                    (document.getElementById('confirmPasscode') as HTMLInputElement).value = '';

                    setSaveStatus('✅ Admin passcode updated successfully!');
                    setTimeout(() => setSaveStatus(''), 3000);
                  }}
                  style={{
                    backgroundColor: '#FAD45B',
                    color: '#1a1412',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Update Passcode
                </button>

                <div style={{
                  marginTop: '12px',
                  fontSize: '12px',
                  color: '#f0e9e1',
                  opacity: 0.7
                }}>
                  💡 The passcode is stored locally in your browser storage. Make sure to remember it!
                </div>
              </div>

            </div>
          )}

          {/* Save Button */}
          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={saveContent}
              style={{
                backgroundColor: '#FAD45B',
                color: '#1a1412',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              💾 Save All Changes
            </button>
            <div style={{ color: '#f0e9e1', opacity: 0.7, fontSize: '14px' }}>
              Changes are auto-saved to localStorage
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1a1412',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '12px',
            border: '2px solid #FAD45B',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(250, 212, 91, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ color: '#FAD45B', fontSize: '20px', fontWeight: '600', margin: 0 }}>
                Add New Product
              </h2>
              <button
                onClick={closeAddProductModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f0e9e1',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.color = '#FAD45B';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.color = '#f0e9e1';
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              {/* Product Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#2d2d2d',
                    border: '1px solid rgba(250, 212, 91, 0.3)',
                    borderRadius: '8px',
                    color: '#f0e9e1',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Price and Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Price *
                  </label>
                  <input
                    type="text"
                    placeholder="0.00"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#2d2d2d',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      borderRadius: '8px',
                      color: '#f0e9e1',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#2d2d2d',
                      border: '1px solid rgba(250, 212, 91, 0.3)',
                      borderRadius: '8px',
                      color: '#f0e9e1',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select Category</option>
                    {content.categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Description *
                </label>
                <textarea
                  placeholder="Enter product description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#2d2d2d',
                    border: '1px solid rgba(250, 212, 91, 0.3)',
                    borderRadius: '8px',
                    color: '#f0e9e1',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Image Upload */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: '#FAD45B', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Product Image *
                </label>
                <div style={{
                  border: '2px dashed rgba(250, 212, 91, 0.3)',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(250, 212, 91, 0.05)',
                  marginBottom: '12px'
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleNewProductImageUpload(e.target.files[0])}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#f0e9e1',
                      fontSize: '14px'
                    }}
                    disabled={isUploadingProductImage}
                  />
                  {isUploadingProductImage && (
                    <div style={{ color: '#FAD45B', fontSize: '14px', marginTop: '8px' }}>
                      ⏳ Uploading image...
                    </div>
                  )}
                </div>

                {/* Image Preview */}
                {newProduct.image && (
                  <div style={{ textAlign: 'center' }}>
                    <Image
                      src={newProduct.image}
                      alt="Product preview"
                      width={200}
                      height={150}
                      style={{
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid rgba(250, 212, 91, 0.3)'
                      }}
                    />
                    <div style={{ color: '#FAD45B', fontSize: '12px', marginTop: '8px' }}>
                      ✓ Image uploaded successfully
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={closeAddProductModal}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    color: '#f0e9e1',
                    border: '1px solid rgba(250, 212, 91, 0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveNewProduct}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#FAD45B',
                    color: '#1a1412',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminSecurityWrapper>
  );
}
