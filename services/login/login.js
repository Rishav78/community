const user = require('../../models/user');

exports.login = async (req, res) => {
    const { Email, Password } = req.body;
    console.log(Email, Password)
    const loginuser = await user.findOne({ Email, Password });

    if(loginuser){
        if(loginuser.ActivationState == true){
            req.login(loginuser._id, err => {
                if(err) throw err
                if(loginuser.Verified == true){
                    if(loginuser.Role == 'User'){
                        return res.redirect('/profile')	
                    }else{
                        return res.redirect('/admin/profile')
                    }
                }else{
                    res.render('editInfomation_starting',{
                        data: loginuser
                    });
                }
            })
        }else{
            return res.render('404NotFound',{
                msg: 'Error: Unable to login you are deactivated contact site admin...',
            });
        }
    }else{
        return res.render('login',{
            visible: true
        });
    }
}