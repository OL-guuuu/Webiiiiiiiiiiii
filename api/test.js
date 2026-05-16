export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ 
    test: 'working',
    timestamp: new Date().toISOString()
  });
};
