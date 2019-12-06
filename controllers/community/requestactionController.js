const services = require('../../services');


exports.action = (req, res) => {
    services.community.action.action(req, res);
}