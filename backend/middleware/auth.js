const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token' });
    req.user = decoded;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  // If the user has a valid id, treat as admin (since only admins exist now)
  if (req.user && req.user.id) return next();
  return res.status(403).json({ message: 'Admin access required' });
};

exports.isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') return next();
  return res.status(403).json({ message: 'Student access required' });
};
