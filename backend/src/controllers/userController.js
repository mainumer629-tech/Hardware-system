const { User } = require('../models/user');

const listUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ order: [['name', 'ASC']] });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { listUsers };
