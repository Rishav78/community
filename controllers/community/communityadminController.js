const services = require('../../services');

exports.communityadmin = (req, res) => {
    services.community.communityadmin.communityadmins(req, res);
}