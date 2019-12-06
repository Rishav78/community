const services = require('../../services');

exports.promotAndDemote = (req, res) => {
    services.community.promotordemote.promotOrDemote(req, res);
}