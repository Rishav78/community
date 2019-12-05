const users = require('../../models/user');

exports.changepassword = async (req, res) => {
    const { old, new:newP } = req.body;
    const user = await users.findById(req.user._id);
    const { Password } = user;
    if(Password.localeCompare(old))
        return res.render('changePassword',{changed: 'wrong', data: req.user});
    console.log(req.user._id);
	await users.updateOne({ '_id': req.user._id },{ "Password": newP });
	return res.render('changePassword',{
        changed: 'changed', 
        data: req.user
    });
}