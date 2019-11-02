const multer = require('multer');

const storage = multer.diskStorage({
	destination: './Public/Files',
	filename: function(req, file, cb){
		con.query(`update Users set Image = '${req.user + path.extname(file.originalname)}' where Id = '${req.user}'`)
		cb(null, req.user + path.extname(file.originalname))
	},
});

exports.upload = multer({
	storage: storage,
}).single('file');