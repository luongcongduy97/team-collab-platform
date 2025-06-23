const prisma = require('../prisma/client');

exports.createBoard = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { title } = req.body;

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const board = await prisma.board.create({
      data: {
        title,
        team: { connect: { id: teamId } },
      },
    });

    res.status(201).json(board);
  } catch (err) {
    console.error('[CREATE_BOARD]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getBoardsByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const boards = await prisma.board.findMany({ where: { teamId } });

    res.json(boards);
  } catch (err) {
    console.error('[GET_BOARDS_BY_TEAM]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
