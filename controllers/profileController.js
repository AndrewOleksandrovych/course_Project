const User = require('../models/User');
const Salary = require('../models/Salary');
const Leave = require('../models/Leave');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const salaries = await Salary.find({ user: req.user.id });
    const leaves = await Leave.find({ user: req.user.id });
    res.render('pages/profile', { user, salaries, leaves });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editProfileForm = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.render('pages/editProfile', { user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.name = name;
    user.email = email;
    if (password) {
      user.password = password;
    }
    await user.save();
    res.redirect('/profile');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
