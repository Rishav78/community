const services = require('../../services');

exports.invitelist = (req, res) => {
    services.community.invitelist.invitelist(req, res);
}