const services = require('../../services');

exports.serveListPage = (req, res) => {
    const { user } = req;
    return res.render('joinCommunity', { data: user });
}

exports.communityList = (req, res) => {
    services.community.list.communnityList(req, res);
}