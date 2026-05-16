const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

console.log('ENV vars:');
console.log('URL:', UPSTASH_URL);
console.log('TOKEN:', UPSTASH_TOKEN ? 'SET' : 'MISSING');

if (UPSTASH_URL && UPSTASH_TOKEN) {
  console.log('\n--- Testing GET command ---');
  fetch(UPSTASH_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      command: ['GET', 'site:config'],
    }),
  })
  .then(r => {
    console.log('GET Response status:', r.status);
    return r.text();
  })
  .then(data => {
    console.log('GET Response (raw):', data);
    try {
      console.log('GET Response (parsed):', JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log('Could not parse response');
    }
  })
  .catch(e => {
    console.error('GET Error:', e.message);
  })
  .then(() => {
    console.log('\n--- Testing SET command ---');
    return fetch(UPSTASH_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        command: ['SET', 'site:config', 'test-value', 'EX', '3600'],
      }),
    });
  })
  .then(r => {
    console.log('SET Response status:', r.status);
    return r.text();
  })
  .then(data => {
    console.log('SET Response (raw):', data);
    try {
      console.log('SET Response (parsed):', JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log('Could not parse response');
    }
  })
  .catch(e => {
    console.error('SET Error:', e.message);
  });
} else {
  console.log('Missing env vars');
}
