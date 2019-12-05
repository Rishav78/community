const invitedusers = require('../../models/inviteduser');

exports.invitedusers = async (req, res) => {
    const invited = await invitedusers.find({
        'communityId': req.params.id
    }).populate('UserId');
	return res.json(invited);
}