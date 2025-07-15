const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, messageController.getMessages);

module.exports = router;
