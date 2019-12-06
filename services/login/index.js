const login = require('./login');
const switchuser = require('./switchUserService');
const changepasword = require('./changepasswordService');
const editinformation = require('./editinformationService');
const viewprofile = require('./viewprofileController');
const activateanddeactivate = require('./activateanddeactivateServices');
module.exports = {
    login,
    switchuser,
    changepasword,
    editinformation,
    viewprofile,
    activateanddeactivate
}