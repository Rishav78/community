const invitedusers = require('../../models/inviteduser');
const communitys = require('../../models/community');

exports.deleteinvite = async (req, res) => {
    const { user } = req.body;
    const { id } = req.params;
    const query = {
        'UserId': user,
        'communityId': id,
    }
    await invitedusers.deleteOne(query);
    
    await communitys.updateOne({'_id': id}, {
        '$inc': {
            'Invited': -1,
        },
    });
    res.send('done');
}