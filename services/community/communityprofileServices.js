const communitys = require('../../models/community');
const communitymembers = require('../../models/communityMember');


exports.serveCommunityProfilePage = async (req, res) => {
    let requested;
    const { user } = req;
    const { id } = req.params;
    const community = await communitys.findById(id);
    const joined = await communitymembers.find({
        'communityId': id
    }).populate('UserId');
    let join = joined.filter((value)=>{
        return value.UserId._id.toString() === req.user._id.toString()
    });
    if(join[0]){
        requested = join[0].Accepted == false;
    }
    join = join.length > 0 && join[0].Accepted == true
    const owner = joined.filter((value) => {
        return (value.UserId == req.user) && (value.Type == 'Owner')
    })
    return {
        "data": user, "community": community, "join": join, "request": requested, "members": joined, "owner": owner
    };
}