const services = require('../../services');

exports.manageCommunity = (req, res) => {
    services.community.managecommunity.manageCommunity(req, res);
}