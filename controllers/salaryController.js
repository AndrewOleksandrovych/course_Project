const Salary = require('../models/Salary');
const User = require('../models/User');
const transporter = require('../config/email');
const ExcelJS = require('exceljs');

exports.createSalary = async (req, res) => {
  const { userId, amount, date } = req.body;
  try {
    const salary = new Salary({ user: userId, amount, date });
    await salary.save();

    const user = await User.findById(userId);
    if (user && user.email) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Зміна в зарплаті',
        text: `Вашу зарплату було оновлено: ${amount} грн`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }

    res.redirect('/admin/salaries');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSalary = async (req, res) => {
  const { amount, date } = req.body;
  try {
    const salary = await Salary.findByIdAndUpdate(req.params.id, { amount, date });
    const user = await User.findById(salary.user);

    if (user && user.email) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Зміна в зарплаті',
        text: `Вашу зарплату було оновлено: ${amount} грн`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }

    res.redirect('/admin/salaries');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find().populate('user');
    res.render('pages/admin/salaries', { salaries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSalaryForm = async (req, res) => {
  try {
    const users = await User.find();
    res.render('pages/admin/createSalary', { users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editSalaryForm = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id).populate('user');
    const users = await User.find();
    res.render('pages/admin/editSalary', { salary, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSalary = async (req, res) => {
  try {
    await Salary.findByIdAndDelete(req.params.id);
    res.redirect('/admin/salaries');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchSalaries = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({ name: new RegExp(query, 'i') }).select('_id');
    const salaries = await Salary.find({ user: { $in: users } }).populate('user');
    res.render('pages/admin/salaries', { salaries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.filterSalaries = async (req, res) => {
  const { minAmount, maxAmount, startDate, endDate } = req.query;
  try {
    const query = Salary.find().populate('user');
    if (minAmount) query.where('amount').gte(minAmount);
    if (maxAmount) query.where('amount').lte(maxAmount);
    if (startDate) query.where('date').gte(new Date(startDate));
    if (endDate) query.where('date').lte(new Date(endDate));
    const salaries = await query;
    res.render('pages/admin/salaries', { salaries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exportSalariesToExcel = async (req, res) => {
  try {
    const salaries = await Salary.find().populate('user');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Salaries');

    worksheet.columns = [
      { header: 'Користувач', key: 'user', width: 30 },
      { header: 'Сума', key: 'amount', width: 15 },
      { header: 'Дата', key: 'date', width: 20 },
    ];

    salaries.forEach(salary => {
      worksheet.addRow({
        user: salary.user ? salary.user.name : 'Користувач видалений',
        amount: salary.amount,
        date: salary.date.toDateString()
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=salaries.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
