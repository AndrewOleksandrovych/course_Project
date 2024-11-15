const express = require('express');
const router = express.Router();
const { ensureAdmin } = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');

router.get('/salaries/excel', ensureAdmin, reportController.exportSalaryReportToExcel);
router.get('/leaves/excel', ensureAdmin, reportController.exportLeaveReportToExcel);
router.get('/projects/excel', ensureAdmin, reportController.exportProjectReportToExcel);

module.exports = router;
