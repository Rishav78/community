const user = require('../../../models/user');

exports.update = async (req, res) => {
    console.log('dfghjkl;')
    const { Email, Phone:Phno, City, Status, Role } = req.body;
    console.log(await user.updateOne({'_id': req.params.id,},{Email,Phno,City,Status,Role,}));
    return res.send('done');
}