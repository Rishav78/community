const multer = require('../../middleware/multer');

exports.uploadProfilePic = (req, res, next) => {
    upload(req, res, err => {
		if(err) throw err;
		res.redirect('/profile')
	});
}