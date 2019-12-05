const communitys = require('../../models/community');
const inviteduser = require('../../models/inviteduser');

exports.serveInviteusersPage = async (req) => {
    const { id } = req.params;
	const community = await communitys.findById(id);
	return community;		
}

exports.inviteuser = (req, res) => {
	const { id } = req.params;
	const newinvited = new inviteduser({
		'communityId': req.params.id,
		'UserId': req.body.id
	});

	newinvited.save(async (err) => {
		if(err) throw err;
		await communitys.updateOne({
			'_id': id
		},{
			'$inc': { 'Invited': 1 }
		});
		return res.send('done')
	})
}