const prisma = require('../prisma/client');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notifications);
  } catch (err) {
    console.error('[GET_NOTIFICATIONS]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
