const services = require('../../services');

exports.inviteduser = (req, res) => {
    services.community.invitedusers.invitedusers(req, res);
}