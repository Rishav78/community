const services = require('../../services');

exports.viewProfile = (req, res) => {
    services.login.viewprofile.viewprofile(req, res);
}