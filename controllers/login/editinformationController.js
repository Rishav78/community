const services = require('../../services');

exports.serveEditInformationPage = (req, res) => {
    const { user } = req;
    return res.render('editInformation',{ data: user });
}

exports.updateInformation = (req, res) => {
    services.login.editinformation.updateInformation(req, res);
}