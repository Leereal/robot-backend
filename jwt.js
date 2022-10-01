const { sign, verify } = require('jsonwebtoken');

const createTokens = (user) => {
  const accessToken = sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies['access-token'];
  if (!accessToken)
    return res.status(400).json({ error: 'User not authenticated' });
  try {
    const validToken = verify(accessToken, process.env.JWT_SECRET);
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (error) {
    return res.status(400).json({ err: error });
  }
};

module.exports = { createTokens, validateToken };
