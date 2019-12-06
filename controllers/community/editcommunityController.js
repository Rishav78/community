const services = require('../../services');

exports.serveEditCommunityPage = async (req, res) => {
    const { user } = req;
    const community = await services.community.editcommunity.serveEditCommunityPage(req, res);
    return res.render('editCommunity',{
        data: user, community, join: true, request: false,
    });
}

exports.updateComapnyInformation = (req, res) => {
    services.community.editcommunity.updateCommunityInformation(req, res);
}