const services = require('../../services');

exports.serveInviteuserPage = async (req, res) => {
    const community = await services.community.inviteusers.serveInviteusersPage(req);
    return res.render('inviteUsers',{
        data: req.user,
        community,
        join: true,
        request: false
    });
}

exports.inviteuser = (req, res) => {
    services.community.inviteusers.inviteuser(req, res);
}