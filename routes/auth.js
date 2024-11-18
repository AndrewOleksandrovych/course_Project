

const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

router.get('/register', (req, res) => {
  res.render('pages/register');
});

router.get('/login', (req, res) => {
  res.render('pages/login');
});

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
