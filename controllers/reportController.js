const ExcelJS = require('exceljs');
const Salary = require('../models/Salary');
const Leave = require('../models/Leave');
const Project = require('../models/Project');

exports.exportSalaryReportToExcel = async (req, res) => {
  try {
    const salaries = await Salary.find().populate('user');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Звіт про зарплати');

    worksheet.columns = [
      { header: "Ім'я", key: 'name', width: 30 },
      { header: 'Сума', key: 'amount', width: 15 },
      { header: 'Дата', key: 'date', width: 15 }
    ];

    salaries.forEach(salary => {
      worksheet.addRow({
        name: salary.user ? salary.user.name : 'Користувач видалений',
        amount: salary.amount,
        date: salary.date.toDateString()
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=salary_report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exportLeaveReportToExcel = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('user');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Звіт про відпустки');

    worksheet.columns = [
      { header: "Ім'я", key: 'name', width: 30 },
      { header: 'Дата початку', key: 'startDate', width: 15 },
      { header: 'Дата закінчення', key: 'endDate', width: 15 },
      { header: 'Причина', key: 'reason', width: 30 }
    ];

    leaves.forEach(leave => {
      worksheet.addRow({
        name: leave.user ? leave.user.name : 'Користувач видалений',
        startDate: leave.startDate.toDateString(),
        endDate: leave.endDate.toDateString(),
        reason: leave.reason
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=leave_report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exportProjectReportToExcel = async (req, res) => {
  try {
    const projects = await Project.find().populate('users');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Звіт про проекти');

    worksheet.columns = [
      { header: 'Назва проекту', key: 'name', width: 30 },
      { header: 'Опис', key: 'description', width: 50 },
      { header: 'Дата початку', key: 'startDate', width: 15 },
      { header: 'Дата закінчення', key: 'endDate', width: 15 },
      { header: 'Учасники', key: 'users', width: 50 }
    ];

    projects.forEach(project => {
      worksheet.addRow({
        name: project.name,
        description: project.description,
        startDate: project.startDate.toDateString(),
        endDate: project.endDate ? project.endDate.toDateString() : '',
        users: project.users.map(user => user.name).join(', ')
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=project_report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
