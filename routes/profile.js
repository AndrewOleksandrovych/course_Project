const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

router.get('/', ensureAuthenticated, profileController.getProfile);
router.get('/edit', ensureAuthenticated, profileController.editProfileForm);
router.post('/edit', ensureAuthenticated, profileController.updateProfile);

module.exports = router;
