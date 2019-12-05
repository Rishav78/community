const users = require('../../models/user');

exports.switchUser = async (req, res) => {
    const user = await users.findById(req.user._id);
    const data = {
        switch: user.LoginAs == 'Admin' ? 'User': 'Admin',
        msg: user.LoginAs == 'Admin' ? 'Switch Admin To User' : 'Switch User To Admin'
    };
    await users.updateOne({'_id': req.user._id},{LoginAs: data.switch});
    return res.render('Switch',{data})
}