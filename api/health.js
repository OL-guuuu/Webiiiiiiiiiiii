/**
 * Health Check API - Diagnostic endpoint
 * Use this to verify that the API is working and storage backends are configured
 */

export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Check environment variables
    const hasVercelKv = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
    const hasUpstashRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
    const isProduction = process.env.NODE_ENV === 'production';

    // Try to reach each backend
    let vercelKvStatus = 'not-configured';
    let upstashRedisStatus = 'not-configured';

    if (hasVercelKv) {
      try {
        const response = await fetch(`${process.env.KV_REST_API_URL}/ping`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
          },
        });
        vercelKvStatus = response.ok ? 'connected' : 'error';
      } catch (error) {
        vercelKvStatus = 'unreachable';
      }
    }

    if (hasUpstashRedis) {
      try {
        const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/ping`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          },
        });
        upstashRedisStatus = response.ok ? 'connected' : 'error';
      } catch (error) {
        upstashRedisStatus = 'unreachable';
      }
    }

    const isHealthy = hasVercelKv || hasUpstashRedis;
    const diagnostics = {
      success: true,
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      environment: {
        production: isProduction,
        vercelDeployed: !!process.env.VERCEL,
      },
      storage: {
        vercelKv: {
          configured: hasVercelKv,
          status: vercelKvStatus,
        },
        upstashRedis: {
          configured: hasUpstashRedis,
          status: upstashRedisStatus,
        },
        localFile: {
          configured: !isProduction,
          status: !isProduction ? 'available' : 'disabled-in-production',
        },
      },
      recommendations: [],
    };

    // Add recommendations based on status
    if (!hasVercelKv && !hasUpstashRedis && isProduction) {
      diagnostics.recommendations.push(
        'CRITICAL: No persistent storage configured for production. Your changes are NOT being saved.'
      );
      diagnostics.recommendations.push(
        'Configure either Vercel KV (recommended) or Upstash Redis by adding environment variables.'
      );
    }

    if (isProduction && !isHealthy) {
      diagnostics.status = 'critical';
    }

    return res.status(200).json(diagnostics);

  } catch (error) {
    console.error('[Health] Unhandled error:', error);
    return res.status(500).json({
      success: false,
      status: 'error',
      error: error?.message || 'Unknown error occurred',
    });
  }
};
