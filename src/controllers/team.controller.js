const prisma = require('../prisma/client');

exports.createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const team = await prisma.team.create({
      data: {
        name,
        members: {
          connect: { id: userId },
        },
      },
    });

    res.status(201).json(team);
  } catch (err) {
    console.error('[CREATE_TEAM]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.inviteUser = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        members: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        members: true,
      },
    });

    res.json(updatedTeam);
  } catch (err) {
    console.error('[INVITE_USER]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMyTeam = async (req, res) => {
  try {
    const userId = req.user.id;

    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: { id: userId },
        },
      },
      include: {
        members: true,
        boards: true,
      },
    });
    res.json(teams);
  } catch (err) {
    console.error('[GET_MY_TEAMS]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
