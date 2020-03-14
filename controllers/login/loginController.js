const services = require('../../services');

exports.serveLoginPage = (req, res, next) => {
    if(!req.isAuthenticated()) {
        return res.render('login',{visible: false})
    }
    const { user } = req;
    if(!user.Verified){
        return res.render('editInfomation_starting',{data: user})
    }
    if(user.Role === 'User'){
        return res.redirect('/profile')
    }
    if(user.LoginAs == 'Admin'){
        return res.redirect('/admin/profile')
    }
    return res.redirect('/community/communitypanel')
}

exports.login = async (req, res, next) => {
    const { Email, Password } = req.body;
    try {
        const { success, user } = await services.login.login.login(Email, Password);
        if(!user.ActivationState){
            return res.render('404NotFound',{
                msg: 'Error: Unable to login you are deactivated contact site admin...',
            });
        }
        req.login(user._id, err => {
            if(err) throw err
            if(!user.Verified){
                return res.render('editInfomation_starting',{
                    data: user
                });
            }
            if(user.Role == 'User'){
                return res.redirect('/profile')	
            }
            return res.redirect('/admin/profile')
        });
    }
    catch (err) {
        return res.render('login',{
            visible: true
        });
    }
}