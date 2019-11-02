const services = require('../../../services');

exports.update = (req, res, next) => {
    services.admin.userlist.update.update(req, res);
}