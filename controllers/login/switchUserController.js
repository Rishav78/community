const services = require('../../services');

exports.switchUser = (req, res) => {
    services.login.switchuser.switchUser(req, res);
}