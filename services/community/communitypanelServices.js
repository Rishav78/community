const communitymembers = require('../../models/communityMember');

exports.communitypannel = async (req, res) => {
    const query = {
		'UserId': req.user._id,
		'Accepted': true,
	};
    const community = await communitymembers.find(query).populate('communityId');
    return res.render('communityPanel',{
        data: req.user,
        community: community
    })
}


