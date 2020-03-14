const users = require('../../models/user');

exports.login = async (Email, Password) => {
    try {
        const user = await users.findOne({ Email, Password });
        if (!user) {
            throw new Error('user does not exist');
        }
        return { success: true, user };
    }
    catch (err) {
        throw err;
    }
}