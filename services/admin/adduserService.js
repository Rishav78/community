const user = require('../../models/user');

exports.addNewUser = async (req, res) => {
    const { name, email, password, phone, city, role} = req.body;

    const alreadyexists = await user.findOne({'Email': req.body.email});
    if(alreadyexists) return res.send('User Already Exist');
    const newuser = new user({
        Name:  name,
        Email:  email,
        Password: password,
        Phone: phone,
        City: city,
        Role: role,
        Status: false,
        Image: 'default.png',
        ActivationState: true,
        LoginAs: role
    });
    newuser.save((err) => {
        if(err) throw err;
        return res.render('AddUser',{
            added : true, 
            data: req.user
        })
    })
} 