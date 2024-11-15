const express = require('express');
const router = express.Router();
const { ensureAdmin } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const salaryController = require('../controllers/salaryController');
const leaveController = require('../controllers/leaveController');
const projectController = require('../controllers/projectController'); // Імпорт контролера проектів

router.get('/dashboard', ensureAdmin, (req, res) => {
  res.render('pages/admin/dashboard', { user: req.user });
});

// Маршрути для управління користувачами
router.get('/users', ensureAdmin, userController.getUsers);
router.get('/users/new', ensureAdmin, (req, res) => {
  res.render('pages/admin/createUser');
});
router.get('/dashboard', ensureAdmin, (req, res) => {
    res.render('pages/admin/dashboard', { user: req.user });
  });
router.post('/users', ensureAdmin, userController.createUser);
router.get('/users/:id/edit', ensureAdmin, userController.editUserForm);
router.post('/users/:id/edit', ensureAdmin, userController.updateUser);
router.post('/users/:id/delete', ensureAdmin, userController.deleteUser);
router.get('/users/search', ensureAdmin, userController.searchUsers);
router.get('/users/autocomplete', ensureAdmin, userController.autocompleteUsers);
router.get('/users/search', ensureAdmin, userController.searchUsers);

// Маршрути для управління зарплатами
router.get('/salaries', ensureAdmin, salaryController.getSalaries);
router.get('/salaries/new', ensureAdmin, salaryController.createSalaryForm);
router.post('/salaries', ensureAdmin, salaryController.createSalary);
router.get('/salaries/:id/edit', ensureAdmin, salaryController.editSalaryForm);
router.post('/salaries/:id/edit', ensureAdmin, salaryController.updateSalary);
router.post('/salaries/:id/delete', ensureAdmin, salaryController.deleteSalary);
router.get('/salaries/search', ensureAdmin, salaryController.searchSalaries);
router.get('/salaries/filter', ensureAdmin, salaryController.filterSalaries);
router.get('/salaries/search', ensureAdmin, salaryController.searchSalaries);
router.get('/salaries/filter', ensureAdmin, salaryController.filterSalaries);
router.get('/salaries/export', ensureAdmin, salaryController.exportSalariesToExcel);

// Маршрути для управління відпустками
router.get('/leaves', ensureAdmin, leaveController.getLeaves);
router.get('/leaves/new', ensureAdmin, leaveController.createLeaveForm);
router.post('/leaves', ensureAdmin, leaveController.createLeave);
router.get('/leaves/:id/edit', ensureAdmin, leaveController.editLeaveForm);
router.post('/leaves/:id/edit', ensureAdmin, leaveController.updateLeave);
router.post('/leaves/:id/delete', ensureAdmin, leaveController.deleteLeave);
router.get('/leaves/search', ensureAdmin, leaveController.searchLeaves);
router.get('/leaves/filter', ensureAdmin, leaveController.filterLeaves);
router.get('/leaves/search', ensureAdmin, leaveController.searchLeaves);
router.get('/leaves/filter', ensureAdmin, leaveController.filterLeaves);

// Маршрути для управління проектами
router.get('/projects', ensureAdmin, projectController.getProjects);
router.get('/projects/new', ensureAdmin, projectController.createProjectForm);
router.post('/projects', ensureAdmin, projectController.createProject);
router.get('/projects/:id/edit', ensureAdmin, projectController.editProjectForm);
router.post('/projects/:id/edit', ensureAdmin, projectController.updateProject);
router.post('/projects/:id/delete', ensureAdmin, projectController.deleteProject);
router.get('/projects/search', ensureAdmin, projectController.searchProjects);

router.get('/projects/filter', ensureAdmin, projectController.filterProjects);
router.get('/projects/:id/details', ensureAdmin, projectController.getProjectDetails);

module.exports = router;
