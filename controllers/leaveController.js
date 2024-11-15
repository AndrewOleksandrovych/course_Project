const Leave = require('../models/Leave');
const User = require('../models/User');
const transporter = require('../config/email');

exports.createLeave = async (req, res) => {
  const { userId, startDate, endDate, reason } = req.body;
  try {
    const leave = new Leave({ user: userId, startDate, endDate, reason });
    await leave.save();

    const user = await User.findById(userId);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Зміна в відпустці',
      text: `Ваша відпустка була оновлена: ${new Date(startDate).toDateString()} - ${new Date(endDate).toDateString()}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.redirect('/admin/leaves');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateLeave = async (req, res) => {
  const { userId, startDate, endDate, reason } = req.body;
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, { user: userId, startDate, endDate, reason }, { new: true });
    const user = await User.findById(leave.user);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Зміна в відпустці',
      text: `Ваша відпустка була оновлена: ${new Date(startDate).toDateString()} - ${new Date(endDate).toDateString()}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.redirect('/admin/leaves');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('user'); 
    res.render('pages/admin/leaves', { leaves });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createLeaveForm = async (req, res) => {
  try {
    const users = await User.find();
    res.render('pages/admin/createLeave', { users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editLeaveForm = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate('user');
    const users = await User.find();
    res.render('pages/admin/editLeave', { leave, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLeave = async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id);
    res.redirect('/admin/leaves');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchLeaves = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({ name: new RegExp(query, 'i') }).select('_id');
    const userIds = users.map(user => user._id);
    const leaves = await Leave.find({ user: { $in: userIds } }).populate('user');
    res.render('pages/admin/leaves', { leaves });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.filterLeaves = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const query = Leave.find().populate('user');
    if (startDate) query.where('startDate').gte(new Date(startDate));
    if (endDate) query.where('endDate').lte(new Date(endDate));
    const leaves = await query;
    res.render('pages/admin/leaves', { leaves });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};