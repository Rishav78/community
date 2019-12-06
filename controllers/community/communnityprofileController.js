const services = require('../../services');

exports.serveCommunityPofilePage = async (req, res) => {
    const profile = await services.community.communityprofile.serveCommunityProfilePage(req);
    return res.render('CommunityProfile', profile);
}