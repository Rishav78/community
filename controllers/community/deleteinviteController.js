const services = require('../../services');

exports.deleteinvite = (req, res) => {
    services.community.deleteinvite.deleteinvite(req, res);
}