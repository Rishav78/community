const services = require('../../services');

exports.communitypanel = (req, res) => {
    services.community.communitypanel.communitypannel(req, res);
}