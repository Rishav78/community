const user = require('../../../models/user');

exports.update = async (req, res) => {
    const { Email, Phone:Phno, City, Status, Role } = req.body;
    await user.updateOne({'_id': req.user._id,},{Email,Phno,City,Status,Role,});
    return res.send('done');
}