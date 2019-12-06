const communitymembers = require('../../models/communityMember');
const communitys = require('../../models/community');

async function promotMember(req) {
    const { id } = req.params;
    const { communityId } = req.body;
    await communitymembers.updateOne({ 'UserId': id, communityId }, { 'Type': 'Admin' }); 
    await communitys.updateOne({ '_id': communityId }, { '$inc': { 'User': -1 } });
}

async function demoteMember(req) {
    const { id } = req.params;
    const { communityId } = req.body;
    console.log(id, communityId);
    await communitymembers.updateOne({ 'UserId': id, communityId }, { 'Type': 'User' });
    await communitys.updateOne({ '_id': communityId }, { '$inc': { 'User': 1 } });
}


exports.promotOrDemote = (req, res) => {
    const { type } = req.body;
    if(type === 1) promotMember(req);
    else demoteMember(req)
    res.send('done');
}