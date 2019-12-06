const login = require('./loginController');
const switchuser = require('./switchUserController');
const profile = require('./profileController');
const changepassword = require('./changepasswordController');
const logout = require('./logoutController');
const editinformation = require('./editinformationController');

module.exports = {
    login,
    switchuser,
    profile,
    changepassword,
    logout,
    editinformation,
};