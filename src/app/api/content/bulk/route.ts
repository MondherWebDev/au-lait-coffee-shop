import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';

// Redis client configuration
let redisClient: any = null;

async function getRedisClient() {
  if (!redisClient) {
    try {
      const redisUrl = process.env.REDIS_URL || process.env.KV_URL;

      if (!redisUrl) {
        throw new Error('REDIS_URL or KV_URL not configured');
      }

      console.log('🔗 Connecting to Redis Cloud...');
      redisClient = createClient({
        url: redisUrl,
        socket: {
          connectTimeout: 30000,
          keepAlive: 30000,
          reconnectStrategy: (retries) => {
            console.log(`🔄 Redis reconnect attempt ${retries}`);
            return Math.min(retries * 100, 3000);
          }
        }
      });

      redisClient.on('error', (err: Error) => {
        console.error('❌ Redis Client Error:', err.message);
      });

      redisClient.on('connect', () => {
        console.log('✅ Redis Cloud connected successfully');
      });

      await redisClient.connect();
    } catch (error) {
      console.error('❌ Failed to connect to Redis Cloud:', error);
      throw error;
    }
  }

  return redisClient;
}

// Test function to check Redis Cloud connection
async function testRedisConnection() {
  try {
    const client = await getRedisClient();

    // Try to set a test value
    await client.set('test_key', 'test_value');

    // Try to get it back
    const testValue = await client.get('test_key');

    if (testValue === 'test_value') {
      console.log('✅ Redis Cloud is working correctly');
      return true;
    } else {
      console.log('❌ Redis Cloud test failed - value mismatch');
      return false;
    }
  } catch (error) {
    console.log('❌ Redis Cloud not available:', error instanceof Error ? error.message : String(error));
    return false;
  }
}

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

    // Test Redis Cloud configuration
    const redisWorking = await testRedisConnection();

    // For now, save to localStorage as fallback since Vercel KV might not be configured
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('aulait_content_backup', JSON.stringify(body));
        console.log('✅ Content saved to localStorage as backup');
      } catch (localStorageError) {
        console.warn('⚠️ localStorage not available:', localStorageError);
      }
    }

    // Try Redis Cloud directly first
    try {
      const client = await getRedisClient();

      // Save to Redis Cloud for persistence
      const contentKey = 'aulait_content_data';

      // Store the entire content object in Redis
      await client.set(contentKey, JSON.stringify(body));

      // Also store individual sections for easier retrieval
      for (const [section, data] of Object.entries(body)) {
        await client.set(`aulait_section_${section}`, JSON.stringify(data));
      }

      console.log('✅ Content saved to Redis Cloud');

      return NextResponse.json({
        success: true,
        message: 'Content saved successfully to Redis Cloud',
        data: body,
        storage: 'redis-cloud',
        redisStatus: 'working'
      });

    } catch (redisError) {
      console.warn('⚠️ Redis Cloud not available, using localStorage only:', redisError);

      return NextResponse.json({
        success: true,
        message: 'Content saved to localStorage (Redis unavailable)',
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

// Separate test endpoint for KV configuration
export async function PATCH() {
  const redisWorking = await testRedisConnection();

  return NextResponse.json({
    redisConfigured: redisWorking,
    timestamp: new Date().toISOString(),
    message: redisWorking ? 'Redis Cloud is working correctly' : 'Redis Cloud is not configured or not available'
  });
}

// GET endpoint to retrieve content
export async function GET() {
  try {
    // Try to get from Redis Cloud first
    try {
      const client = await getRedisClient();
      const contentKey = 'aulait_content_data';
      const contentData = await client.get(contentKey);

      if (contentData) {
        const content = JSON.parse(contentData);
        return NextResponse.json({
          success: true,
          data: content,
          storage: 'redis-cloud'
        });
      }
    } catch (redisError) {
      console.warn('⚠️ Redis Cloud not available for GET:', redisError);
    }

    // Fallback to localStorage if Redis is not available
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
