const express = require('express');
const router = express.Router({ mergeParams: true });
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/:teamId/messages', authMiddleware, messageController.getMessages);

module.exports = router;
