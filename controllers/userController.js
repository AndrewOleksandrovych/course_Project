const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render('pages/admin/users', { users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password, role });
    await user.save();
    res.redirect('/admin/users');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.editUserForm = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render('pages/admin/editUser', { user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { name, email, role } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, { name, email, role });
    res.redirect('/admin/users');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin/users');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchUsers = async (req, res) => {
    const { query } = req.query;
    try {
      const users = await User.find({ name: new RegExp(query, 'i') });
      res.render('pages/admin/users', { users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  exports.autocompleteUsers = async (req, res) => {
    const { term } = req.query;
    try {
      const users = await User.find({ name: new RegExp(term, 'i') }).limit(10);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
