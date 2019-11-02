const nodeMailer = require('nodemailer');

exports.transporter = nodeMailer.createTransport({
	service: 'gmail',
	secure: false,
	port: 25,
	auth: {
		user: 'rishavgarg789@gmail.com',
		pass: 'Port_123456'
	},
	tls: {
		rejectUnauthorized: false
	}
});