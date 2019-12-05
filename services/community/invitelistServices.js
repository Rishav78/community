const communitys = require('../../models/community');
const communitymembers = require('../../models/communityMember');
const inviteduser = require('../../models/inviteduser');
const users = require('../../models/user');

exports.invitelist = async (req, res) => {
    const { id } = req.params;
    let members = await communitymembers.find({
        'communityId': id,
    },{
        'UserId': 1, 
        '_id': 0
    });
	members = members.map((value) => value.UserId);
	let invited = await inviteduser.find({
		'communityId': id
	},{
		'UserId': 1, 
		'_id': 0
	})
	invited = invited.map((value) => value.UserId);
	const invites = await users.find({
		'$and': [
			{'_id': {'$nin': members}},
			{'_id': {'$nin': invited}},
			{'Name': {'$regex': new RegExp(req.body.search),},}
	]});
	return res.json(invites);
}