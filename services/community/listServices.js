const communitymembers = require('../../models/communityMember');
const communitys = require('../../models/community'); 

exports.communnityList = async (req, res) => {
    const { _id } = req.user;
    let community = await communitymembers.find({
        'UserId': _id
    },{
        communityId: 1, 
        '_id': 0
    });
    community = community.map((value) => value.communityId);
    if(req.body.search)
        query.CommunityName = new RegExp(req.body.search);
        
	const list = await communitys.find({$and: [
        { '_id': { '$nin': community} },
        { 'CommunityName': new RegExp(req.body.search) },
        { 'Status': 'Activate' }
    ]});
	return res.json(list)
}