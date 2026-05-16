#!/usr/bin/env node

/**
 * Direct Upstash REST API Test
 * Tests the exact request format and response parsing
 */

import https from 'https';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

console.log('='.repeat(80));
console.log('UPSTASH REST API DIRECT TEST');
console.log('='.repeat(80));

if (!UPSTASH_URL || !UPSTASH_TOKEN) {
  console.error('❌ Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
  process.exit(1);
}

console.log('✓ Environment variables present');
console.log('URL:', UPSTASH_URL.substring(0, 50) + '...');

function makeRequest(command, commandName) {
  return new Promise((resolve) => {
    console.log(`\n📤 ${commandName}:`, JSON.stringify(command));

    const url = new URL(UPSTASH_URL);
    const postData = JSON.stringify({ command });

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      },
    };

    console.log('🔗 Request Details:');
    console.log('  - Host:', options.hostname);
    console.log('  - Path:', options.path);
    console.log('  - Method:', options.method);
    console.log('  - Auth Header: Bearer [TOKEN]');

    const request = https.request(options, (response) => {
      console.log(`📥 Response Status: ${response.statusCode}`);
      console.log(`📥 Response Headers:`, response.headers);

      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        console.log('📥 Response Body (raw):', data);
        try {
          const parsed = JSON.parse(data);
          console.log('📥 Response Body (parsed):', JSON.stringify(parsed, null, 2));
          resolve({
            status: response.statusCode,
            headers: response.headers,
            body: parsed,
          });
        } catch (e) {
          console.error('❌ Failed to parse response:', e.message);
          resolve({
            status: response.statusCode,
            headers: response.headers,
            body: data,
            parseError: e.message,
          });
        }
      });
    });

    request.on('error', (error) => {
      console.error('❌ Request Error:', error.message);
      resolve({ error: error.message });
    });

    request.write(postData);
    request.end();
  });
}

async function test() {
  try {
    // Test 1: PING
    console.log('\n' + '='.repeat(80));
    console.log('TEST 1: PING (check connection)');
    console.log('='.repeat(80));
    let result = await makeRequest(['PING'], 'PING');
    console.log('✓ PING Result:', result);

    // Test 2: SET simple value
    console.log('\n' + '='.repeat(80));
    console.log('TEST 2: SET test-key test-value');
    console.log('='.repeat(80));
    const testValue = JSON.stringify({ timestamp: Date.now(), message: 'Test Value' });
    result = await makeRequest(['SET', 'test-key', testValue], 'SET');
    console.log('✓ SET Result:', result);

    // Test 3: GET the value back
    console.log('\n' + '='.repeat(80));
    console.log('TEST 3: GET test-key');
    console.log('='.repeat(80));
    result = await makeRequest(['GET', 'test-key'], 'GET');
    console.log('✓ GET Result:', result);
    
    if (result.body?.result) {
      console.log('✓ Retrieved Value:', result.body.result);
      try {
        const parsed = JSON.parse(result.body.result);
        console.log('✓ Parsed JSON:', JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log('ℹ Value is not JSON');
      }
    }

    // Test 4: SET with EX (expiry)
    console.log('\n' + '='.repeat(80));
    console.log('TEST 4: SET site:config <large-json> EX 31536000');
    console.log('='.repeat(80));
    const largeJson = JSON.stringify({
      siteName: 'Test Site',
      theme: 'dark',
      pages: ['home', 'about', 'contact'],
      nested: {
        level1: {
          level2: 'value'
        }
      },
      timestamp: Date.now(),
    });
    result = await makeRequest(['SET', 'site:config', largeJson, 'EX', '31536000'], 'SET with EX');
    console.log('✓ SET with EX Result:', result);

    // Test 5: GET site:config
    console.log('\n' + '='.repeat(80));
    console.log('TEST 5: GET site:config');
    console.log('='.repeat(80));
    result = await makeRequest(['GET', 'site:config'], 'GET site:config');
    console.log('✓ GET site:config Result:', result);
    if (result.body?.result) {
      try {
        const parsed = JSON.parse(result.body.result);
        console.log('✓ Parsed site:config:', JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log('❌ Failed to parse site:config:', e.message);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('✓ ALL TESTS COMPLETED');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Test Error:', error);
    process.exit(1);
  }
}

test();
