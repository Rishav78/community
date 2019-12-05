const communitymembers = require('../../models/communityMember');

exports.communitymembers = async (req, res) => {
    const { id } = req.params;
    const members = await communitymembers.find({
		'communityId': id,
		'Accepted' : true,
		'Type': 'User',
    }).populate('UserId');
    return res.json(members);
}