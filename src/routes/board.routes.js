const express = require('express');
const router = express.Router({ mergeParams: true });
const boardController = require('../controllers/board.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

router.post('/:teamId/boards', authMiddleware, adminMiddleware, boardController.createBoard);
router.get('/:teamId/boards', authMiddleware, boardController.getBoardsByTeam);

module.exports = router;
