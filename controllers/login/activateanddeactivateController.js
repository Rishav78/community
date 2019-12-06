const services = require('../../services');

exports.activateAndDeactivate = (req, res) => {
    services.login.activateanddeactivate.activateAndDeactivate(req, res);
}