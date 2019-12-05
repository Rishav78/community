const services = require('../../services');

exports.communitymembers = (req, res) => {
    services.community.communitymember.communitymembers(req, res);
}