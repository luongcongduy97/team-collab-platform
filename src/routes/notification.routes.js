const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/notifications', authMiddleware, notificationController.getNotifications);

module.exports = router;
