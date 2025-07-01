const express = require('express');
const router = express.Router({ mergeParams: true });
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/:boardId/tasks', authMiddleware, taskController.createTask);
router.get('/:boardId/tasks', authMiddleware, taskController.getTasksByBoard);
router.put('/tasks/:taskId', authMiddleware, taskController.updateTask);
router.delete('/task/:taskId', authMiddleware, taskController.deleteTask);

module.exports = router;
