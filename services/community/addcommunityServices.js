const community = require('../../models/community');
const communitymembers = require('../../models/communityMember');

function infoObject(req) {
    const { CommunityName, MembershipRule, Discription } = req.body;
    const communityInfo = {
		CommunityName,
		MembershipRule,
		CommunityLocation: 'Not Added',
		CommunityOwner: req.user,
		Discription: Discription.replace(/<[^>]*>/g, ''),
		TotalReq:0,
		Members:1,
		User:0,
		Invited:0,
		CommunityPic:'defaultCommunity.jpg',
		Status:'Activate',
    };
    return communityInfo;
}

exports.createCommunity = async (req, res) => {
	const newCommunity = new community(infoObject(req));
	newCommunity.save((err) => {
        if(err) throw err;
        const cmInfo = {
			communityId: newCommunity._id,
			UserId: req.user._id,
			Accepted: true,
			Type: 'Owner',
		};
		const newcommunitymember = new communitymembers(cmInfo);
		newcommunitymember.save(() => {
			return res.render('CreateCommunity',{
				created: true, 
				data: req.user,
			});
		});
	});
}