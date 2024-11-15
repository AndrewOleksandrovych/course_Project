const Project = require('../models/Project');
const User = require('../models/User');
const transporter = require('../config/email');

exports.createProject = async (req, res) => {
  const { name, description, startDate, endDate, users, status } = req.body;
  try {
    const userIds = Array.isArray(users) ? users : [users];
    const project = new Project({ name, description, startDate, endDate, users: userIds, status });
    await project.save();

    for (const userId of userIds) {
      const user = await User.findById(userId);
      if (user && user.email) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Новий проект',
          text: `Вас додано до нового проекту: ${name}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      } else {
        console.log(`User with ID ${userId} not found or does not have an email.`);
      }
    }

    res.redirect('/admin/projects');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  const { name, description, startDate, endDate, users, status } = req.body;
  try {
    const userIds = Array.isArray(users) ? users : [users];
    const project = await Project.findByIdAndUpdate(req.params.id, { name, description, startDate, endDate, users: userIds, status });

    for (const userId of userIds) {
      const user = await User.findById(userId);
      if (user && user.email) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Оновлення проекту',
          text: `Проект ${name} було оновлено`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      } else {
        console.log(`User with ID ${userId} not found or does not have an email.`);
      }
    }

    res.redirect('/admin/projects');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('users');
    res.render('pages/admin/projects', { projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProjectForm = async (req, res) => {
  try {
    const users = await User.find();
    res.render('pages/admin/createProject', { users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editProjectForm = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('users');
    const users = await User.find();
    res.render('pages/admin/editProject', { project, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect('/admin/projects');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchProjects = async (req, res) => {
  const { query } = req.query;
  try {
    const projects = await Project.find({ name: new RegExp(query, 'i') }).populate('users');
    res.render('pages/admin/projects', { projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.filterProjects = async (req, res) => {
  const { startDate, endDate, status } = req.query;
  try {
    const query = Project.find().populate('users');
    if (startDate) query.where('startDate').gte(new Date(startDate));
    if (endDate) query.where('endDate').lte(new Date(endDate));
    if (status) query.where('status').equals(status);
    const projects = await query;
    res.render('pages/admin/projects', { projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectDetails = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('users');
    res.render('pages/admin/projectDetails', { project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
