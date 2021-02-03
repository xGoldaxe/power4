const User = require('../../models/User');

exports.getPseudoById = async (userId) => {
    const user = await User.findById(userId)
    return user.pseudo
}