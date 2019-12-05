const communitys = require('../../models/community');

exports.manageCommunity = async (req, res) => {
    const community = await communitys.findById(req.params.id);

    if(community.Status != 'Activate')
        return res.render('404NotFound',{msg: 'Error: This community is deactivated or may be deleted by superadmin'});

	return res.render('manageCommunity',{
        "data": req.user, 
        "community": community, 
        "join": true,
        "request": false,
    });
}