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

      const team = await prisma.team.findUnique({
        where: { id: board.teamId },
        include: { members: true },
      });
      if (team) {
        const notificationsData = team.members.map((m) => ({
          content: `New task "${task.title}" created`,
          userId: m.id,
        }));
        await prisma.notification.createMany({ data: notificationsData });
      }
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

    const io = getIO();
    if (task.boardId) {
      const board = await prisma.board.findUnique({ where: { id: task.boardId } });
      if (board && board.teamId) {
        io.to(`team-${board.teamId}`).emit('task-updated', task);
        const team = await prisma.team.findUnique({
          where: { id: board.teamId },
          include: { members: true },
        });
        if (team) {
          const notificationsData = team.members.map((m) => ({
            content: `Task "${task.title}" updated`,
            userId: m.id,
          }));
          await prisma.notification.createMany({ data: notificationsData });
        }
      }
    }

    res.json(task);
  } catch (err) {
    console.error('[UPDATE_TASK]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const existing = await prisma.task.findUnique({
      where: { id: taskId },
      include: { board: true },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await prisma.task.delete({ where: { id: taskId } });
    const io = getIO();
    if (existing.board && existing.board.teamId) {
      io.to(`team-${existing.board.teamId}`).emit('task-deleted');
      const team = await prisma.team.findUnique({
        where: { id: existing.board.teamId },
        include: { members: true },
      });
      if (team) {
        const notificationsData = team.members.map((m) => ({
          content: 'Task deleted',
          userId: m.id,
        }));
        await prisma.notification.createMany({ data: notificationsData });
      }
    }
    res.status(204).end();
  } catch (err) {
    console.error('[DELETE_TASK]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
