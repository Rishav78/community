const users = require('../../models/user');

exports.viewprofile = async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    const user2 = await users.findById(id);
    return res.render('MemberProfile',{
        data: user,
        data2: user2
    });
}