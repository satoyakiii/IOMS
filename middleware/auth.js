// middleware/auth.js


function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }
  
  if (req.session.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Admin access required.' });
  }
  
  next();
}

function requireOwnerOrAdmin(resourceUserId) {
  return (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized. Please login.' });
    }
    
    const isOwner = req.session.userId === resourceUserId.toString();
    const isAdmin = req.session.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden. You can only access your own resources.' });
    }
    
    next();
  };
}

module.exports = {
  requireAuth,
  requireAdmin,
  requireOwnerOrAdmin
};
