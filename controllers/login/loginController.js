const services = require('../../services');

exports.serveLoginPage = (req, res, next) => {
    if(req.isAuthenticated()){
        const { user } = req;
        if(user.Verified == true){
            if(user.Role == 'User'){
                return res.redirect('/profile')
            }else{
                if(user.LoginAs == 'Admin'){
                    return res.redirect('/admin/profile')
                }else{
                    return res.redirect('/community/communitypanel')
                }
            }
        }else{
            res.render('editInfomation_starting',{data: user})
        }
    } else {
        res.render('login',{visible: false})
    }
}

exports.login = (req, res, next) => {
    services.login.login.login(req, res);
}