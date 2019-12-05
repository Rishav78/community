const services = require('../../services');

exports.serveChangePasswordPage = (req, res) => {
    return res.render('changePassword',{
        changed: false, 
        data: req.user
    });
}

exports.changepassword = (req, res) => {
    services.login.changepasword.changepassword(req, res);
}