import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the data
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid content data'
        },
        { status: 400 }
      );
    }

    console.log('📝 Content update received:', Object.keys(body));
    console.log('📝 Content size:', JSON.stringify(body).length, 'characters');

    // For now, save to localStorage as fallback since Vercel KV might not be configured
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('aulait_content_backup', JSON.stringify(body));
        console.log('✅ Content saved to localStorage as backup');
      } catch (localStorageError) {
        console.warn('⚠️ localStorage not available:', localStorageError);
      }
    }

    // Try Vercel KV if available
    try {
      const { kv } = await import('@vercel/kv');

      // Save to Vercel KV (Redis) for persistence
      const contentKey = 'aulait_content_data';

      // Store the entire content object in KV
      await kv.set(contentKey, JSON.stringify(body));

      // Also store individual sections for easier retrieval
      for (const [section, data] of Object.entries(body)) {
        await kv.set(`aulait_section_${section}`, JSON.stringify(data));
      }

      console.log('✅ Content saved to Vercel KV');

      return NextResponse.json({
        success: true,
        message: 'Content saved successfully to database',
        data: body,
        storage: 'vercel-kv'
      });

    } catch (kvError) {
      console.warn('⚠️ Vercel KV not available, using localStorage only:', kvError);

      return NextResponse.json({
        success: true,
        message: 'Content saved to localStorage (KV unavailable)',
        data: body,
        storage: 'localStorage'
      });
    }

  } catch (error) {
    console.error('❌ Content save error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save content',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve content
export async function GET() {
  try {
    // Try to get from Vercel KV first
    try {
      const { kv } = await import('@vercel/kv');
      const contentKey = 'aulait_content_data';
      const contentData = await kv.get(contentKey);

      if (contentData) {
        const content = JSON.parse(contentData as string);
        return NextResponse.json({
          success: true,
          data: content,
          storage: 'vercel-kv'
        });
      }
    } catch (kvError) {
      console.warn('⚠️ Vercel KV not available for GET:', kvError);
    }

    // Fallback to localStorage if KV is not available
    if (typeof window !== 'undefined') {
      try {
        const localData = localStorage.getItem('aulait_content_backup');
        if (localData) {
          const content = JSON.parse(localData);
          return NextResponse.json({
            success: true,
            data: content,
            storage: 'localStorage'
          });
        }
      } catch (localStorageError) {
        console.warn('⚠️ localStorage not available:', localStorageError);
      }
    }

    return NextResponse.json({
      success: false,
      error: 'No content found in any storage'
    }, { status: 404 });

  } catch (error) {
    console.error('❌ Content retrieval error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
