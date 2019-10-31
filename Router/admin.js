var express = require('express')
var router = express.Router();
const user = require('../models/user');
var nodeMailer = require('nodemailer')

const transporter = nodeMailer.createTransport({
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
})

router.get('/profile',isAuthenticated(),(req,res)=>{
	user
	.findOne({'_id': req.user._id})
	.then((result)=>{
		return res.render('profile',{data : result,visible : false})
	})
})

router.get('/adduser',isAuthenticated(),(req,res)=>{
	user
	.findOne({'_id': req.user._id})
	.then((result)=>{
		return res.render('AddUser',{added : false,data: result})
	})
})

router.post('/adduser',isAuthenticated(),(req,res)=>{
	var data = req.body;
	user
	.findOne({'Email': req.body.email})
	.then(function(total){
		console.log(total)
		if(!total){
			const newuser = new user({
				Name: req.body.name,
				Email: req.body.email,
				Password:req.body.password,
				Phone:req.body.phone,
				City:req.body.city,
				Role:req.body.role,
				Status:false,
				Image:'default.png',
				ActivationState: true,
				LoginAs:req.body.role
			});
			newuser.save((usr) => {
				return res.render('AddUser',{added : true, data: req.user})
			})
		}else{
			return res.send('User Already Exist')
		}
	})
})

router.get('/userlist',isAuthenticated(),(req,res)=>{
	user
	.findOne({'_id': req.user})
	.then((result)=>{
		return res.render('ShowUser',{data : result})
	})
})

router.post('/userlist',isAuthenticated(),(req,res)=>{
	const arr = ['Email', 'Phno', 'City', 'Status', 'Role', 'Action'];
	const query = {};
	if(req.body.roleFilter!='All') 
		query.Role = req.body.roleFilter;
	if(req.body.statusFilter!='All') 
		query.Status = req.body.statusFilter
	if(req.body.search.value) 
		query.Email = {$regex: new RegExp(req.body.search.value)}
	user
	.find(query)
	.sort({[arr[req.body.order[0].column]]: req.body.order[0].dir})
	.then((result)=>{
		var record = result.filter((value,index)=>{
			if(index >= req.body.start && req.body.length>0){
				req.body.length--
				return true;
			}
		})
		user
		.countDocuments({})
		.then((total)=>{
			res.json({'recordsTotal': total, 'recordsFiltered' : result.length, data: record});
		})
	})
})

router.post('/userlist/sendMail',isAuthenticated(),(req,res)=>{
	let mail = {
		from: 'rishavgarg789@gmail.com',
		to: req.body.to,
		subject: req.body.subject,
		text: req.body.msg
	}
	transporter.sendMail(mail,(err,info)=>{
		if(err) throw err;
		console.log('send')
		res.send('send')
	})
})

router.post('/userlist/update',isAuthenticated(),(req,res)=>{
	user.updateOne({
		'_id': req.user._id,
	},
	{
		Email:req.body.Email,
		Phno:req.body.Phone,
		City:req.body.City,
		Status:req.body.Status,
		Role:req.body.Role,
	})
	.then(()=>{
		return res.send('done')
	})
})

function isAuthenticated(){
	return (req, res, next)=>{
		if(req.isAuthenticated()){
			return next()
		}
		return res.redirect('/')
	}
}

module.exports = router;