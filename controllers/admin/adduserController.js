const services = require('../../services');

exports.serveAdduserPage = (req, res, next) => {
    return res.render('AddUser',{
        added : false,
        data: req.user
    })
}

exports.addNewUser = async (req, res, next) => {
    services.admin.adduser.addNewUser(req, res);
}