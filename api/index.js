// Dummy entrypoint for Vercel build process
// Actual API functions are in the /api directory
module.exports = (req, res) => {
  res.status(200).json({ message: 'MEEP Platform - API Server' });
};
