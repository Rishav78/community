const login = require('./loginController');
const switchuser = require('./switchUserController');
const profile = require('./profileController');
const changepassword = require('./changepasswordController');

module.exports = {
    login,
    switchuser,
    profile,
    changepassword,
};