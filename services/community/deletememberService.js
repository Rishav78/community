
const communitymembers = require('../../models/communityMember');
const communitys = require('../../models/community');

exports.deletemember = async (req, res) => {
    const { user, Type } = req.body;
    const { id } = req.params;
    await communitymembers.findOneAndDelete({ 'UserId': user, 'communityId': id });
	await communitys.updateOne({ '_id': id }, { 'Members': -1 });
    if(Type == 'User')
        await communitys.updateOne({ '_id': id }, { 'User': -1 });
    res.send('done')
}