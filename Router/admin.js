var express = require('express')
var router = express.Router()
// var bodyParser = require('body-parser')
var mysql = require('mysql')
var session = require('express-session')
var MySQLStorage = require('express-mysql-session')(session)
var passport = require('passport')

const con = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'UCA_WebProject'
})
con.connect((err)=>{
	if (err) throw err
	console.log('connected...')
})

router.get('/profile',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		var data = result[0]
		return res.render('Home',{data : data,visible : false})
	})
})
router.get('/adduser',isAuthenticated(),(req,res)=>{
	con.query(`select Image, Role, Name from Users where Email = '${req.user}'`,(err,result)=>{
		if (err) throw err;
		return res.render('AddUser',{added : false,data: result[0]})
	})
})
router.post('/adduser',isAuthenticated(),(req,res)=>{
	var data = req.body
	con.query(`select * from Users where Email = '${data.email}' or Email = '${req.user}'`,(err,total)=>{
		if(err) throw err
		if(total.length == 1){
			con.query(`select max(Id) from Users`,(err,result)=>{
				var q = `insert into Users(Id, Name, Email, Password, Phno, City, Role, Status, Image, ActivationState, LoginAs) values(${result[0]['max(Id)']+1}, '${data.name}', '${data.email}', '${data.password}', '${data.phone}', '${data.city}', '${data.role}', 'Pending', 'default.png', 'True', 'Admin')`
				con.query(q,(err,result)=>{
					if(err) throw err;
					console.log('add')
					// console.log()
					return res.render('AddUser',{added : true, data: total[0]})
				})
			})
		}else{
			return res.send('User Already Exist')
		}
	})
})
router.get('/userlist',isAuthenticated(),(req,res)=>{
	con.query('select Image, Role, Name from Users',(err,result)=>{
		return res.render('ShowUser2',{data : result[0]})
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

function isAuthenticated(){
	return (req, res, next)=>{
		if(req.isAuthenticated()){
			return next()
		}
		return res.redirect('/')
	}
}

module.exports = router;