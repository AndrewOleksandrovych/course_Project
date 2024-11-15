const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.ensureAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.redirect('/auth/login');
  }
};

exports.ensureAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.redirect('/auth/login');
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.redirect('/auth/login');
  }
};
