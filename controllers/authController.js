const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { name, email, password, role, adminPassword } = req.body;

  // Перевірка паролю адміністратора
  if (role === 'admin' && adminPassword !== 'super22admin') {
    return res.render('pages/register', { error: 'Неправильний пароль адміністратора' });
  }

  try {
    const user = new User({ name, email, password, role });
    await user.save();
    res.redirect('/auth/login'); // Перенаправлення на форму авторизації після успішної реєстрації
  } catch (error) {
    res.render('pages/register', { error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('pages/login', { error: 'Неправильний email або пароль' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('pages/login', { error: 'Неправильний email або пароль' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    if (user.role === 'admin') {
      res.redirect('/admin/dashboard'); // Перенаправлення адміністратора на панель адміністратора
    } else {
      res.redirect('/profile'); // Перенаправлення звичайного користувача на його профіль
    }
  } catch (error) {
    res.render('pages/login', { error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/'); // Перенаправлення на головну сторінку
};
