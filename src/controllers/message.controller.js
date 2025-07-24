const prisma = require('../prisma/client');

exports.getMessages = async (req, res) => {
  try {
    const { teamId } = req.params;
    const messages = await prisma.message.findMany({
      where: { teamId },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { id: true, name: true } } },
    });
    res.json(messages);
  } catch (err) {
    console.error('[GET_MESSAGES]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
