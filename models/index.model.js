import User from './user.model.js';

const getActiveUser = async (email) =>
  await User.findOne({ where: { userEmail: email, userStatus: 1 } });

export { getActiveUser };
