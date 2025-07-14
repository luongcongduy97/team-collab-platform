const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

router.post('/', authMiddleware, adminMiddleware, teamController.createTeam);
router.get('/my', authMiddleware, teamController.getMyTeam);
router.post('/:teamId/invite', authMiddleware, adminMiddleware, teamController.inviteUser);
router.post(
  '/:teamId/invite-by-email',
  authMiddleware,
  adminMiddleware,
  teamController.inviteByEmail,
);

module.exports = router;
