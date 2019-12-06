const communitymembers = require('../../models/communityMember');

exports.requests = async (req, res) => {
    const { id } = req.params;
    const reqsts = await communitymembers.find({
        'communityId': id,
        'Accepted': false
    }).populate('UserId');
	return res.json(reqsts)
}