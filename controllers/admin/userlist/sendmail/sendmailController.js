const transporter = require('../../../../middleware/nodemailer').transporter;

exports.sendmail = (req, res, next) => {
    const { to, subject, msg:text} = req.body;
    const from = 'rishavgarg789@gmail.com';
    let mail = { from, to, subject, text };
	transporter.sendMail(mail,(err,info)=>{
		if(err) throw err;
		console.log('send')
		return res.send('send')
	});
}