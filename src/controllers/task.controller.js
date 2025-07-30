const prisma = require('../prisma/client');
const { getIO } = require('../socket');

exports.createTask = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, content, status, assignedId } = req.body;

    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        content,
        status,
        board: { connect: { id: boardId } },
        assigned: assignedId ? { connect: { id: assignedId } } : undefined,
      },
      include: {
        assigned: {
          select: { id: true, name: true },
        },
      },
    });

    const io = getIO();
    if (board.teamId) {
      io.to(`team-${board.teamId}`).emit('task-created', task);
    }

    res.status(201).json(task);
  } catch (err) {
    console.error('[CREATE_TASK]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTasksByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const tasks = await prisma.task.findMany({
      where: { boardId },
      include: {
        assigned: {
          select: { id: true, name: true },
        },
      },
    });
    res.json(tasks);
  } catch (err) {
    console.error('[GET_TASKS_BY_BOARD]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, content, status, assignedId, boardId } = req.body;

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        content,
        status,
        board: boardId ? { connect: { id: boardId } } : undefined,
        assigned: assignedId ? { connect: { id: assignedId } } : undefined,
      },
      include: {
        assigned: {
          select: { id: true, name: true },
        },
      },
    });

    res.json(task);
  } catch (err) {
    console.error('[UPDATE_TASK]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    await prisma.task.delete({ where: { id: taskId } });
    res.status(204).end();
  } catch (err) {
    console.error('[DELETE_TASK]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
