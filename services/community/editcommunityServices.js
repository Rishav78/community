const communitys = require('../../models/community');

exports.serveEditCommunityPage = async (req) => {
    const { id } = req.params;
    const community = await communitys.findById(id);
	return community;
}

exports.updateCommunityInformation = async (req, res) => {
    const { id } = req.params;
    const { CommunityName, MembershipRule, Discription } = req.body;
    await communitys.updateOne({'_id': id},{
		CommunityName, MembershipRule,
		Discription: Discription.replace(/<[^>]*>/g, ''),
	});
	return res.redirect(`/community/communityprofile/${id}`);
}