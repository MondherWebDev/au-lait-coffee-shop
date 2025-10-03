import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    console.log('🔍 API Request: Loading content from server');

    // Try to load saved content first
    const filePath = path.join(process.cwd(), 'data', 'content.json');
    let contentData = null;

    if (fs.existsSync(filePath)) {
      try {
        const savedContent = fs.readFileSync(filePath, 'utf8');
        contentData = JSON.parse(savedContent);
        console.log('✅ Loaded saved content from file');

        // Validate content structure
        if (!contentData || typeof contentData !== 'object') {
          throw new Error('Invalid content structure');
        }

      } catch (parseError) {
        console.warn('⚠️ Error parsing saved content, creating new structure:', parseError);
        contentData = null;
      }
    }

    // If no saved content, create empty structure
    const dynamicContent = contentData || {
      logo: { url: '' },
      hero: {
        title: 'Welcome to Au Lait',
        subtitle: 'Your content is ready to be customized. Use the admin dashboard to add your coffee shop information.',
        cta: 'Explore Our Menu',
        video: ''
      },
      about: {
        title: 'About Our Coffee Shop',
        content: 'Welcome to our coffee shop! We\'re excited to serve you the finest coffee and create memorable experiences. Use the admin dashboard to customize this content with your unique story.',
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
      settings: {
        siteTitle: 'Au Lait Coffee Shop',
        favicon: ''
      },
      categories: [],
      products: []
    };

    // Add metadata
    const responseData = {
      success: true,
      data: dynamicContent,
      metadata: {
        loadedFrom: contentData ? 'file' : 'generated',
        timestamp: new Date().toISOString(),
        version: '2.0'
      }
    };

    console.log('📤 Serving dynamic content:', {
      hasLogo: !!dynamicContent.logo.url,
      categoriesCount: dynamicContent.categories.length,
      productsCount: dynamicContent.products.length,
      hasContact: !!dynamicContent.contact.address
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('❌ Error in content API:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
