const services = require('../../services');

exports.serveAddCommunityPage = (req, res) => {
    return res.render('CreateCommunity',{
		created: false,
		data: req.user
	});
}

exports.createCommunity = (req, res) => {
    services.community.addcommunity.createCommunity(req, res);
}