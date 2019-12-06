const communitymembers = require('../../models/communityMember');
const communitys = require('../../models/community');

async function acceptRequest(req) {
    const { id } = req.params;
    const { user } = req.body;
    await communitymembers.updateOne({
        'communityId': id,
        'UserId': user,
    },{
        Accepted: true,
    });
    await communitys.updateOne({ '_id': id }, { '$inc': { 'TotalReq': -1, 'members': 1 } });
}

async function rejectRequest(req) {
    const { id } = req.params;
    const { user } = req.body;
    await communitymembers.findOneAndRemove({
        'communityId': id,
        'UserId': user,
    });
    await communitys.updateOne({ '_id': id }, { '$inc': { 'TotalReq': -1 } });
}

exports.action = async (req, res) => {
    const { type } = req.body;
    console.log(type)
    if(type === 1) await acceptRequest(req);
    else await rejectRequest(req);
    res.send('done');
}