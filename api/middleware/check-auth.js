// Add this middleware to routes which should only be accessible to users that are logged in

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const secret = process.env.JWT_SECRET || require('../../config.json').JWT_SECRET;
    const token = req.headers.authorization.split(' ')[1];

    const payload = jwt.verify(token, secret);

    // TODO decide what will be included in the payload of the token

    req.userData = {
      userId: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: 'Not authenticated.'
    });
  }
};
