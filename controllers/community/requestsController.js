const services = require('../../services');

exports.requests = (req, res) => {
    services.community.requests.requests(req, res);
}