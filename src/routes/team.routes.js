const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, teamController.createTeam);
router.get('/my', authMiddleware, teamController.getMyTeam);

module.exports = router;
