const communitys = require('../../models/community');
const communitymembers = require('../../models/communityMember');

exports.joinCommunity = async (req, res) => {
    const { id } = req.params;

    const community = await communitys.findOne({
        '_id': id
    },{
        MembershipRule: 1
    });
	
    if(community.MembershipRule == 'Direct'){
        const member = {
            UserId: req.user,
            communityId: req.params.id,
            Accepted: true,
            Type: 'User'
        };
        const newcommunitymembers = new communitymembers(member);
        newcommunitymembers.save(async (err) => {
            if(err) throw err;
            await community.updateOne({
                '_id': id
            },{
                '$inc': { 'Members': 1, 'User': 1 }
            });
            res.send('done');
        });
    }else{
        const newcommunitymembers = new communitymembers({
            UserId: req.user,
            communityId: req.params.id,
            Accepted: false,
            Type: 'User'
        });
        
        newcommunitymembers.save(async (err) => {
            await community.updateOne({
                '_id': id
            },{
                '$inc': { 'TotalReq': 1 } 
            });
            res.send('done');
        });
    }
}