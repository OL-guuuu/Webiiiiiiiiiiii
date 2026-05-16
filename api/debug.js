/**
 * Debug Endpoint - Test Upstash Integration
 * Shows exact request/response details
 */

import https from 'https';

export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    console.log('[DEBUG] Starting Upstash test...');
    
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    console.log('[DEBUG] Env vars check:', {
      hasUrl: !!upstashUrl,
      hasToken: !!upstashToken,
      urlPreview: upstashUrl ? upstashUrl.substring(0, 50) + '...' : 'MISSING',
    });

    if (!upstashUrl || !upstashToken) {
      return res.status(400).json({
        error: 'Missing Upstash credentials',
        hasUrl: !!upstashUrl,
        hasToken: !!upstashToken,
      });
    }

    const sendUpstashCommand = async (commandParts) => {
      const url = new URL(upstashUrl);
      const payload = JSON.stringify(commandParts);

      return new Promise((resolve) => {
        const options = {
          hostname: url.hostname,
          path: url.pathname,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${upstashToken}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
        };

        const request = https.request(options, (response) => {
          let data = '';

          response.on('data', (chunk) => {
            data += chunk;
          });

          response.on('end', () => {
            try {
              resolve({
                status: response.statusCode,
                headers: response.headers,
                body: data ? JSON.parse(data) : null,
                raw: data,
              });
            } catch (error) {
              resolve({
                status: response.statusCode,
                headers: response.headers,
                raw: data,
                parseError: error.message,
              });
            }
          });
        });

        request.on('error', (error) => {
          resolve({ error: error.message });
        });

        request.write(payload);
        request.end();
      });
    };

    // Test 1: SET a test value
    console.log('[DEBUG] Test 1: Setting test value...');
    const testData = JSON.stringify({ 
      test: 'value', 
      timestamp: Date.now(),
      message: 'Diagnostic test from debug endpoint'
    });

    const setCommand = ['SET', 'debug-test-key', testData, 'EX', 3600];

    console.log('[DEBUG] SET Command:', setCommand);
    const setResult = await sendUpstashCommand(setCommand);

    console.log('[DEBUG] SET Result:', setResult);

    // Test 2: GET the value back
    console.log('[DEBUG] Test 2: Getting value back...');

    const getCommand = ['GET', 'debug-test-key'];

    console.log('[DEBUG] GET Command:', getCommand);
    const getResult = await sendUpstashCommand(getCommand);

    console.log('[DEBUG] GET Result:', getResult);

    console.log('[DEBUG] Both tests completed');

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      upstash: {
        url: upstashUrl.substring(0, 50) + '...',
        hostname: new URL(upstashUrl).hostname,
        pathname: new URL(upstashUrl).pathname,
      },
      tests: {
        set: setResult,
        get: getResult,
      },
    });

  } catch (error) {
    console.error('[DEBUG] Error:', error.message, error.stack);
    return res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};
