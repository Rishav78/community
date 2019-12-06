const services = require('../../services');

exports.joinCommunity = (req, res) => {
    services.community.joincommunity.joinCommunity(req, res);
}