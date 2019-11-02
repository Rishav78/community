const user = require('../../../models/user');

exports.userlist = async (req, res) => {
    const arr = ['Email', 'Phno', 'City', 'Status', 'Role', 'Action'];
	const query = {};
	if(req.body.roleFilter!='All') 
		query.Role = req.body.roleFilter;
	if(req.body.statusFilter!='All') 
		query.Status = req.body.statusFilter;
	if(req.body.search.value) 
		query.Email = {$regex: new RegExp(req.body.search.value)};
    
    const result = await user
            .find(query)
            .sort({
                [arr[req.body.order[0].column]]: req.body.order[0].dir
            });

    const record = result.filter((value,index)=>{
        if(index >= req.body.start && req.body.length>0){
            req.body.length--;
            return true;
        }
    });
    const total = await user.countDocuments({});
    return res.json({'recordsTotal': total, 'recordsFiltered' : result.length, data: record});
}