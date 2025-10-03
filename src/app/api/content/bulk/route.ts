import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

    console.log('📝 Content update received:', body);

    // Save to a JSON file for persistence
    const filePath = path.join(process.cwd(), 'data', 'content.json');

    // Ensure the data directory exists
    const dataDir = path.dirname(filePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write the content to file
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf8');

    console.log('✅ Content saved to file:', filePath);

    return NextResponse.json({
      success: true,
      message: 'Content saved successfully',
      data: body
    });

  } catch (error) {
    console.error('❌ Bulk update error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save content'
      },
      { status: 500 }
    );
  }
}
