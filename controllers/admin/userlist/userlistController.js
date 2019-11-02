const services = require('../../../services');

exports.serveUserlistPage = (req, res, next) => {
    return res.render('ShowUser',{
        data : req.user,
    });
}

exports.userlist = (req, res, next) => {
    services.admin.userlist.userlist.userlist(req, res);
}

exports.userinfo = (req, res, next) => {
    services.admin.userlist.userlist.userinfo(req, res);
}