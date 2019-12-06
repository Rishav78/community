const services = require('../../services');



exports.deletemember = (req, res) => {
    // console.log(req.body);
    services.community.deletemember.deletemember(req, res);
}