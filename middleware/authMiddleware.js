const jwt = require('jsonwebtoken');
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ Error: 'No token provided' });
    } else {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id, username } = decoded;
        req.user = { id, username };
        next();
      } catch (err) {
        res.status(401).json({ Error: 'Token failed', err });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = authMiddleware;
