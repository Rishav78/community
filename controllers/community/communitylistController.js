const services = require('../../services');

exports.serveCommunitylistPage = (req, res, next) => {
    return res.render('CommunityList',{
        data: req.user
    });
}

exports.communitylist = (req, res, next) => {
    services.community.communitylist.communitylist(req, res);
}