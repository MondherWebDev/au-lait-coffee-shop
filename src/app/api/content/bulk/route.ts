import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

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

  } catch (error) {
    console.error('❌ KV storage error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save content to database',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve content
export async function GET() {
  try {
    const contentKey = 'aulait_content_data';
    const contentData = await kv.get(contentKey);

    if (!contentData) {
      return NextResponse.json({
        success: false,
        error: 'No content found'
      }, { status: 404 });
    }

    const content = JSON.parse(contentData as string);

    return NextResponse.json({
      success: true,
      data: content,
      storage: 'vercel-kv'
    });

  } catch (error) {
    console.error('❌ KV retrieval error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve content from database'
      },
      { status: 500 }
    );
  }
}
