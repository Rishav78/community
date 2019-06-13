var express = require('express')
var router = express.Router()
var knex = require('./mysql.js')
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
	knex('Users')
	.where('Id', req.user)
	.then((result)=>{
		return res.render('profile',{data : result[0],visible : false})
	})
})

router.get('/adduser',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((result)=>{
		return res.render('AddUser',{added : false,data: result[0]})
	})
})

router.post('/adduser',isAuthenticated(),(req,res)=>{
	var data = req.body
	knex('Users')
	.where('Email', req.body.email)
	.orWhere('Id', req.user)
	.then(function(total){
		var id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
		if(total.length == 1){
			this.insert({
				Id,
				Name: req.body.name,
				Email: req.body.email,
				Password:req.body.password,
				Phone:req.body.phone,
				City:req.body.city,
				Role:req.body.role,
				Status:'Pending',
				Image:'default.png',
				ActivationState:'True',
				LoginAs:req.body.role,

			})
			.then(()=>{
				return res.render('AddUser',{added : true, data: total[0]})
			})
		}else{
			return res.send('User Already Exist')
		}
	})
})

router.get('/userlist',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((result)=>{
		return res.render('ShowUser',{data : result[0]})
	})
})

router.post('/user',isAuthenticated(),(req,res)=>{
	var arr = ['Email', 'Phno', 'City', 'Status', 'Role', 'Action']
	knex('Users')
	.where(function(){
		if(req.body.roleFilter!='All'){
			this.where(knex.raw(`INSTR(Email, '${req.body.search.value}')`))
			if(req.body.roleFilter!='All'){
				this.andWhere('Role', '=', req.body.roleFilter)
			}
			if(req.body.statusFilter!='All'){
				this.andWhere('Status', '=', req.body.statusFilter)
			}
		}
	})
	.orderBy(arr[req.body.order[0].column], req.body.order[0].dir)
	.then((result)=>{
		var record = result.filter((value,index)=>{
			if(index >= req.body.start && req.body.length>0){
				req.body.length--
				return true;
			}
		})
		knex('Users')
		.count('Email')
		.then((total)=>{
			res.json({'recordsTotal': total[0]['count(Email)'], 'recordsFiltered' : result.length, data: record});
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
	knex('Users')
	.where('Email', req.body.Email)
	.update({
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