// Vercel entrypoint - serves static frontend
module.exports = (req, res) => {
  res.status(200).json({ message: 'MEEP Platform - Use /api/* endpoints for API calls' });
};
