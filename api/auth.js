export default (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  // GET - Check auth
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, authenticated: false });
  }
  
  // POST - Login
  if (req.method === 'POST') {
    let body = {};
    try {
      if (req.body && typeof req.body === 'string') {
        body = JSON.parse(req.body);
      } else if (req.body && typeof req.body === 'object') {
        body = req.body;
      }
    } catch (e) {
      // ignore
    }
    
    const password = String(body?.password || '').trim();
    const correct = process.env.DASHBOARD_PASSWORD || '00000008';
    
    if (password === correct) {
      res.setHeader('Set-Cookie', 'dashboard_session=test123; Path=/; HttpOnly; SameSite=Strict; Max-Age=43200');
      return res.status(200).json({ success: true, authenticated: true });
    }
    
    return res.status(401).json({ success: false, authenticated: false, error: 'Invalid password' });
  }
  
  // DELETE - Logout
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', 'dashboard_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
    return res.status(200).json({ success: true, authenticated: false });
  }
  
  // OPTIONS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
};
