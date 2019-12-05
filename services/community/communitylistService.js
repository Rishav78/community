const community = require('../../models/community');

exports.communitylist = async (req, res) => {
    const { MembershipRule } = req.body;
    const { value } = req.body.search;

    const array = ['CommunityName', 'MembershipRule', 'CommunityLocation', 'CommunityOwner', 'CreateDate'];
	const query = {};
	if(MembershipRule != 'All')
		query.MembershipRule = MembershipRule;
	if(value)
        query.CommunityName = {$regex: new RegExp(value)};
        
    
	const result = await community
	        .find(query)
	        .populate('CommunityOwner')
            .sort({[array[req.body.order[0].column]]: req.body.order[0].dir});
            
    
    const record = result.filter((value,index)=>{
        if(index >= req.body.start && req.body.length>0){
            req.body.length--
            return true;
        }
    })
		
	const count = await	community.countDocuments({})
	return res.send({
        'recordsTotal': count, 
        'recordsFiltered' : result.length, 
        data: record
    });
}