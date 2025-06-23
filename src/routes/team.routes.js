const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, teamController.createTeam);
router.get('/my', authMiddleware, teamController.getMyTeam);
router.post('/:teamId/invite', authMiddleware, teamController.inviteUser);
router.post('/:teamId/invite-by-email', authMiddleware, teamController.inviteByEmail);

module.exports = router;
