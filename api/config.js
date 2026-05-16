/**
 * Site Config API Handler - Vercel Serverless Function
 * Handles GET/PUT operations for persistent site configuration storage
 * Supports multiple backends: Vercel KV, Upstash Redis, Local File
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

// ============================================================================
// ENVIRONMENT & CONFIGURATION
// ============================================================================

const CONFIG_KEY = 'site:config';
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = !!process.env.VERCEL;

const storageConfig = {
  vercelKv: {
    enabled: !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN),
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  },
  upstashRedis: {
    enabled: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
  localFile: {
    enabled: !isProduction,
    path: path.resolve(process.cwd(), 'data', 'site-config.json'),
  },
};

const sendUpstashCommand = async (commandParts) => {
  const url = new URL(storageConfig.upstashRedis.url);
  const postData = JSON.stringify(commandParts);

  return new Promise((resolve) => {
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${storageConfig.upstashRedis.token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
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
            data: data ? JSON.parse(data) : null,
            raw: data,
          });
        } catch (error) {
          resolve({
            status: response.statusCode,
            raw: data,
            parseError: error?.message,
          });
        }
      });
    });

    request.on('error', (error) => {
      resolve({ error: error.message });
    });

    request.write(postData);
    request.end();
  });
};

console.log('[API:Config] Storage backends available:', {
  vercelKv: storageConfig.vercelKv.enabled,
  upstashRedis: storageConfig.upstashRedis.enabled,
  localFile: storageConfig.localFile.enabled,
  environment: isProduction ? 'production' : 'development',
  isVercel,
  upstashUrl: storageConfig.upstashRedis.url ? 'SET' : 'MISSING',
  upstashToken: storageConfig.upstashRedis.token ? 'SET' : 'MISSING',
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Read config from Vercel KV
 */
const readFromVercelKv = async () => {
  if (!storageConfig.vercelKv.enabled) return null;
  try {
    console.log('[API:Config] Reading from Vercel KV...');
    
    const url = new URL(`${storageConfig.vercelKv.url}/get/${CONFIG_KEY}`);
    
    return new Promise((resolve) => {
      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storageConfig.vercelKv.token}`,
        },
      };

      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          if (response.statusCode === 200) {
            try {
              const parsed = JSON.parse(data);
              if (parsed.result) {
                const config = typeof parsed.result === 'string' ? JSON.parse(parsed.result) : parsed.result;
                return resolve(config);
              }
              return resolve(null);
            } catch (e) {
              console.error('[API:Config] Parse error:', e.message);
              return resolve(null);
            }
          } else {
            console.error('[API:Config] Vercel KV read failed:', response.statusCode);
            return resolve(null);
          }
        });
      });

      request.on('error', (error) => {
        console.error('[API:Config] Vercel KV request error:', error.message);
        resolve(null);
      });

      request.end();
    });
  } catch (error) {
    console.error('[API:Config] Failed to read from Vercel KV:', error?.message);
    return null;
  }
};

/**
 * Write config to Vercel KV
 */
const writeToVercelKv = async (data) => {
  if (!storageConfig.vercelKv.enabled) return false;
  try {
    console.log('[API:Config] Writing to Vercel KV...');
    
    const payload = {
      value: JSON.stringify(data),
      ex: 31536000,
    };
    const postData = JSON.stringify(payload);
    
    const url = new URL(`${storageConfig.vercelKv.url}/set/${CONFIG_KEY}`);
    
    return new Promise((resolve) => {
      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storageConfig.vercelKv.token}`,
          'Content-Type': 'application/json',
          'Content-Length': postData.length,
        },
      };

      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          if (response.statusCode === 200) {
            console.log('[API:Config] Successfully wrote to Vercel KV');
            return resolve(true);
          } else {
            console.error('[API:Config] Vercel KV write failed:', response.statusCode);
            return resolve(false);
          }
        });
      });

      request.on('error', (error) => {
        console.error('[API:Config] Vercel KV write error:', error.message);
        resolve(false);
      });

      request.write(postData);
      request.end();
    });
  } catch (error) {
    console.error('[API:Config] Failed to write to Vercel KV:', error?.message);
    return false;
  }
};

/**
 * Read config from Upstash Redis
 */
const readFromUpstashRedis = async () => {
  if (!storageConfig.upstashRedis.enabled) return null;
  try {
    console.log('[API:Config] Reading from Upstash Redis...');
    const result = await sendUpstashCommand(['GET', CONFIG_KEY]);

    if (result?.status !== 200 || result?.error || result?.parseError) {
      console.error('[API:Config] Upstash read failed:', result);
      return null;
    }

    if (!result.data || !Object.prototype.hasOwnProperty.call(result.data, 'result')) {
      return null;
    }

    const resultValue = result.data.result;
    if (resultValue == null) {
      return null;
    }

    return typeof resultValue === 'string' ? JSON.parse(resultValue) : resultValue;
  } catch (error) {
    console.error('[API:Config] Failed to read from Upstash:', error?.message);
    return null;
  }
};

/**
 * Write config to Upstash Redis
 */
const writeToUpstashRedis = async (data) => {
  if (!storageConfig.upstashRedis.enabled) {
    console.log('[API:Config] Upstash disabled');
    return false;
  }
  try {
    console.log('[API:Config] Writing to Upstash Redis...');
    const configJson = JSON.stringify(data);

    console.log('[API:Config] Upstash URL hostname:', new URL(storageConfig.upstashRedis.url).hostname);
    console.log('[API:Config] Upstash URL path:', new URL(storageConfig.upstashRedis.url).pathname);

    const result = await sendUpstashCommand(['SET', CONFIG_KEY, configJson, 'EX', 31536000]);

    if (result?.status === 200 && result?.data && result.data.result === 'OK') {
      console.log('[API:Config] Successfully wrote to Upstash Redis');
      return true;
    }

    console.error('[API:Config] Upstash write failed:', result);
    return false;
  } catch (error) {
    console.error('[API:Config] Failed to write to Upstash:', error?.message);
    return false;
  }
};

/**
 * Read config from local file (development only)
 */
const readFromLocalFile = () => {
  if (!storageConfig.localFile.enabled) return null;
  try {
    console.log('[API:Config] Reading from local file...');
    if (!fs.existsSync(storageConfig.localFile.path)) return null;
    
    const raw = fs.readFileSync(storageConfig.localFile.path, 'utf8');
    if (!raw) return null;
    
    return JSON.parse(raw);
  } catch (error) {
    console.error('[API:Config] Failed to read from local file:', error?.message);
    return null;
  }
};

/**
 * Write config to local file (development only)
 */
const writeToLocalFile = (data) => {
  if (!storageConfig.localFile.enabled) return false;
  try {
    console.log('[API:Config] Writing to local file...');
    const dir = path.dirname(storageConfig.localFile.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(storageConfig.localFile.path, JSON.stringify(data, null, 2), 'utf8');
    console.log('[API:Config] Successfully wrote to local file');
    return true;
  } catch (error) {
    console.error('[API:Config] Failed to write to local file:', error?.message);
    return false;
  }
};

/**
 * Parse request body
 */
const parseRequestBody = async (req) => {
  // Vercel explicitly populates req.body
  if (req.body !== undefined) {
    if (typeof req.body === 'object') {
      return req.body;
    }
    try {
      return JSON.parse(req.body);
    } catch (e) {
      return {};
    }
  }
  
  // Fallback for non-Vercel environments (like local node scripts if any)
  return new Promise((resolve) => {
    // If the socket has already ended and we didn't have req.body, just resolve empty
    if (req.readableEnded) {
      return resolve({});
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        console.warn('[API:Config] Failed to parse request body:', error?.message);
        resolve({});
      }
    });

    // In case there's an error reading the stream
    req.on('error', () => resolve({}));
  });
};

// ============================================================================
// MAIN HANDLER
// ============================================================================

export default async (req, res) => {
  // Set CORS & content type headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET /api/config - Read configuration
    if (req.method === 'GET') {
      console.log('[API:Config] GET request received');
      
      // Try each backend in priority order
      const kvData = await readFromVercelKv();
      if (kvData) {
        console.log('[API:Config] Returning data from Vercel KV');
        return res.status(200).json({
          success: true,
          data: kvData,
          source: 'vercel-kv',
          timestamp: Date.now(),
        });
      }

      const redisData = await readFromUpstashRedis();
      if (redisData) {
        console.log('[API:Config] Returning data from Upstash Redis');
        return res.status(200).json({
          success: true,
          data: redisData,
          source: 'upstash-redis',
          timestamp: Date.now(),
        });
      }

      const fileData = readFromLocalFile();
      if (fileData) {
        console.log('[API:Config] Returning data from local file');
        return res.status(200).json({
          success: true,
          data: fileData,
          source: 'local-file',
          timestamp: Date.now(),
          warning: 'Using local file storage - not shared across instances',
        });
      }

      console.log('[API:Config] No config found, returning empty data');
      return res.status(200).json({
        success: true,
        data: {},
        source: 'none',
        timestamp: Date.now(),
      });
    }

    // PUT/POST /api/config - Write configuration
    if (req.method === 'PUT' || req.method === 'POST') {
      console.log(`[API:Config] ${req.method} request received`);
      
      const body = await parseRequestBody(req);
      
      if (!body || Object.keys(body).length === 0) {
        console.warn('[API:Config] Empty body received');
        return res.status(400).json({
          success: false,
          error: 'Request body is empty',
        });
      }

      console.log('[API:Config] Request body received, attempting to persist...');

      // Try each backend in priority order
      if (storageConfig.vercelKv.enabled) {
        const kvOk = await writeToVercelKv(body);
        if (kvOk) {
          console.log('[API:Config] Successfully persisted to Vercel KV');
          return res.status(200).json({
            success: true,
            source: 'vercel-kv',
            timestamp: Date.now(),
            message: 'Configuration saved to Vercel KV - visible to all users',
          });
        }
        console.warn('[API:Config] Vercel KV write failed, trying next backend');
      }

      if (storageConfig.upstashRedis.enabled) {
        const redisOk = await writeToUpstashRedis(body);
        if (redisOk) {
          console.log('[API:Config] Successfully persisted to Upstash Redis');
          return res.status(200).json({
            success: true,
            source: 'upstash-redis',
            timestamp: Date.now(),
            message: 'Configuration saved to Upstash Redis - visible to all users',
          });
        }
        console.warn('[API:Config] Upstash Redis write failed, trying next backend');
      }

      if (storageConfig.localFile.enabled) {
        const fileOk = writeToLocalFile(body);
        if (fileOk) {
          console.log('[API:Config] Successfully persisted to local file');
          return res.status(200).json({
            success: true,
            source: 'local-file',
            timestamp: Date.now(),
            warning: 'Configuration saved to local file only - NOT visible to other users. Configure Vercel KV or Upstash Redis for production.',
          });
        }
        console.warn('[API:Config] Local file write failed');
      }

      console.error('[API:Config] All storage backends failed');
      return res.status(503).json({
        success: false,
        error: 'All storage backends failed. Configure Vercel KV or Upstash Redis.',
        availableBackends: {
          vercelKv: storageConfig.vercelKv.enabled,
          upstashRedis: storageConfig.upstashRedis.enabled,
          localFile: storageConfig.localFile.enabled,
        },
      });
    }

    // 405 Method Not Allowed
    console.warn(`[API:Config] Unsupported method: ${req.method}`);
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      allowedMethods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    });

  } catch (error) {
    console.error('[API:Config] Unhandled error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error?.message || 'Unknown error occurred',
    });
  }
};
