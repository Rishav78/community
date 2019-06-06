var express = require('express')
var router = express.Router()
var con = require('./mysql.js')
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
	con.query(`select * from Users where Id = '${req.user}'`,(err,result)=>{
		if(err) throw err
		var data = result[0]
		console.log(data)
		return res.render('profile',{data : data,visible : false})
	})
})
router.get('/adduser',isAuthenticated(),(req,res)=>{
	con.query(`select Image, Role, Name from Users where Id = '${req.user}'`,(err,result)=>{
		if (err) throw err;
		return res.render('AddUser',{added : false,data: result[0]})
	})
})
router.post('/adduser',isAuthenticated(),(req,res)=>{
	var data = req.body
	con.query(`select * from Users where Email = '${data.email}' or Id = '${req.user}'`,(err,total)=>{
		if(err) throw err;
		var id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
		if(total.length == 1){
			var q = `insert into Users(Id, Name, Email, Password, Phno, City, Role, Status, Image, ActivationState, LoginAs) values('${id}', '${data.name}', '${data.email}', '${data.password}', '${data.phone}', '${data.city}', '${data.role}', 'Pending', 'default.png', 'True', 'Admin')`
			con.query(q,(err,result)=>{
				if(err) throw err;
				console.log('add')
				// console.log()
				return res.render('AddUser',{added : true, data: total[0]})
			})
		}else{
			return res.send('User Already Exist')
		}
	})
})

router.get('/userlist',isAuthenticated(),(req,res)=>{
	con.query('select Image, Role, Name from Users',(err,result)=>{
		return res.render('ShowUser',{data : result[0]})
	})
})

router.post('/user',isAuthenticated(),(req,res)=>{
	var arr = ['Email', 'Phno', 'City', 'Status', 'Role', 'Action']
	var data = req.body
	con.query(`select * from Users order by ${arr[data.order[0].column]} ${data.order[0].dir}`,(err,result)=>{
		if(err) throw err;
		if(data.roleFilter!='All'){
			result = result.filter((value)=>{
				return value.Role === data.roleFilter
			})
		}
		if(data.statusFilter!='All'){
			result = result.filter((value)=>{
				return value.Status === data.statusFilter
			})
		}
		if(data.search.value){
			result = result.filter((value)=>{
				return value.Email.includes(data.search.value)
			})
		}
		var record = result.filter((value,index)=>{
			if(index >= data.start && data.length>0){
				data.length--
				return true;
			}
		})
		con.query('select count(Email) from Users',(err,total)=>{
			res.json({'recordsTotal': total[0]['count(Email)'], 'recordsFiltered' : result.length, data: record});
		})
	})
})

router.post('/userlist/sendMail',isAuthenticated(),(req,res)=>{
	var data = ''
	req.on('data', chunk=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data);
		let mail = {
			from: 'rishavgarg789@gmail.com',
			to: data.to,
			subject: data.subject,
			text: data.msg
		}
		transporter.sendMail(mail,(err,info)=>{
			if(err) throw err;
			console.log('send')
			res.send('send')
		})
	})
})

router.post('/userlist/update',isAuthenticated(),(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		con.query(`update Users set Email = '${data.Email}', Phno = '${data.Phone}', City = '${data.City}', Status = '${data.Status}', Role = '${data.Role}' where Email = '${data.Email}'`,(err,result)=>{
			if(err) throw err
		  	return res.send('done')
		})
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