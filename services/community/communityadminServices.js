const communitymembers = require('../../models/communityMember');

exports.communityadmins = async (req, res) => {
    const { id } = req.params;
    const admins = await communitymembers.find({
		'communityId': id,
		'Accepted': true,
		'Type': {'$ne': 'User'},
    }).populate('UserId');
	res.json(admins);
}