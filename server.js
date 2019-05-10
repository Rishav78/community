var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var mysql = require('mysql')
var session = require('express-session')
var MySQLStorage = require('express-mysql-session')(session)
var passport = require('passport')
var app = express()
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'Public')))
var con = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'UCA_WebProject'
})
var sessionStore = new MySQLStorage({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'UCA_WebProject'
})
app.use(session({
	secret : 'sdfghjkl',
	resave : false,
	saveUninitialized : false,
	store : sessionStore
}))
app.use(passport.initialize())
app.use(passport.session())
con.connect((err)=>{
	if (err) throw err
		// con.query('drop table communityList')
	// con.query('truncate table tags')
	// con.query('truncate table Users')
	// var q = `create table Tags(Id int, name char(100), CreatedBy varchar(100), CreationDate date)`
	// var q = 'create table CommunityList(CommunityName char(50), MembershipRule char(50), CommunityLocation varchar(50), CommunityOwner char(50), CreateDate date, CommunityPic varchar(200))'
	// var q = `insert into communityList values('asdfg', 'sdfg', 'sdfgh' , 'werty', '0/0/0', 'dfghjk')`
	// var q = `insert into Users values('Rishav', 'rishavgarg789@gmail.com', 'hacker12', '1234567890', 'Mandi GobindGarh', 'M', '13/9/1999', 'Superadmin', 'Confirmed')`
	// con.query(q,(err,result)=>{
	// 	if (err) {throw err}
	// })
	// con.query()
	console.log('connected...')
})
app.get('/',(req,res)=>{
	if(req.isAuthenticated()){
		return res.redirect('/home')
	}
	res.sendFile(path.join(__dirname,'views','login.html'))
})
app.post('/login',(req,res)=>{
	con.query(`select * from Users where Email = '${req.body.Email}' and Password = '${req.body.Password}'`,(err,result)=>{
		if(err) throw err
		if(result.length>0){
			req.login(req.body.Email,(err)=>{
				if(err) throw err
				res.redirect('/home')
			})
		}else{
			res.send('User does not exist')
		}
	})
})

app.get('/home',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		var data = result[0]
		res.render('Home',{data})
	})
})

app.get('/adduser',isAuthenticated(),(req,res)=>{
	res.render('AddUser')
})

app.post('/adduser',(req,res)=>{
	console.log(req.body)
	res.send(req.body)
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
		console.log('dfghjk')
	})

	// req.on('end',()=>{
	// 	data = JSON.parse(data)
	// 	con.query(`select * from Users where Email = '${data.email}'`,(err,result)=>{
	// 		if(err) throw err
	// 		if(result.length <= 0){
	// 			var q = `insert into Users values('${data.name}', '${data.email}', '${data.password}', '${data.phone}', '${data.city}', 'M', date '2015-12-17', '${data.role}', 'Pending')`
	// 			con.query(q,(err,result)=>{
	// 				if(err) throw err;
	// 				console.log('add')
	// 				return res.send('User Added')
	// 			})
	// 		}else{
	// 			res.send('User Already Exist')
	// 		}
	// 	})
		
	// })
})

app.get('/showusers',isAuthenticated(),(req,res)=>{
	con.query('select * from Users',(err,result)=>{
		res.render('ShowUser2',{data : result})
	})
})

app.post('/users',(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		if(data.status == 'All' && data.userType == 'All'){
			con.query(`select * from Users`,(err,result)=>{
				if(err) throw err
				res.send(JSON.stringify(getUser(data,result)))
			})
		}else if(data.status != 'All' && data.userType == 'All'){
			con.query(`select * from Users where Status = '${data.status}'`,(err,result)=>{
				if(err) throw err
				res.send(JSON.stringify(getUser(data,result)))
			})
		}else if(data.status == 'All' && data.userType != 'All'){
			con.query(`select * from Users where Role = '${data.userType}'`,(err,result)=>{
				if(err) throw err
				res.send(JSON.stringify(getUser(data,result)))
			})
		}else{
			con.query(`select * from Users where Status = '${data.status}' and Role = '${data.userType}'`,(err,result)=>{
				if(err) throw err
				res.send(JSON.stringify(getUser(data,result)))
			})
		}
	})
})

app.post('/update',(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		con.query(`update Users set Email = '${data.Email}', Phno = '${data.Phone}', City = '${data.City}', Status = '${data.Status}', Role = '${data.Role}' where Email = '${data.Email}'`,(err,result)=>{
			if(err) throw err
		  	res.send('done')
		})
	})
})

app.post('/deleteuser',(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		con.query(`delete from Users where Email = '${data}'`,(err,result)=>{
			if(err) throw err
			console.log('done')
			res.send('deleted')
		})
	})
})

app.get('/Logout',isAuthenticated(),(req,res)=>{
	req.session.destroy((err)=>{
		if(err) throw err
		res.redirect('/')
	})
})

app.get('/tags',(req,res)=>{
	res.render('Tags')
})

app.post('/tags',(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		con.query(`select * from tags where name = '${data}'`,(err,result)=>{
			if(err) throw err
			if(result.length<=0){
				con.query(`insert into tags values(${Math.random()*Math.pow(10,8)}, '${data}', '${req.user}', date '12/12/12')`,(err,result)=>{
					if(err) throw err
					res.send('added')
				})
			}else{
				res.send('tag already exist')
			}
		})
	})
})

app.get('/tagslist',(req,res)=>{
	res.render('taglist2')
})

app.post('/tagslistdata',(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		con.query(`select * from tags`,(err,result)=>{
			if (err) throw err
			// if(data){
			// 	var array = []
			// 	result.forEach((value)=>{
			// 		if(value.name.indexOf(data)>=0){
			// 			array = [...array,value]
			// 		}
			// 	})
			// 	res.send(array)
			// }else{
				res.send(result)
			// }
		})
	})
})

app.post('/deletetag',(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		con.query(`delete from tags where name = ${data}`,(err,result)=>{
			if(err) throw err
			res.send('done')
		})
	})
})

app.get('/changePassword',(req,res)=>{
	res.render('changePassword')
})

app.post('/changePassword',(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		con.query(`select Password from Users where Email = '${req.user}'`,(err,result)=>{
			if(err) throw err
			if(result[0].Password === data.old){
				con.query(`update Users set Password = '${data.New}' where Email = '${req.user}'`)
				return res.send('changed')
			}else{
				return res.send('wrong password')
			}
		})
	})
})

app.get('/communityList',(req,res)=>{
	res.render('communityList')
})

app.post('/communityList',(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		if(data.Rule != 'All'){
			con.query(`select * from communityList where MembershipRule = ${data.Rule}`,(err,result)=>{
				if(err) throw err
				return res.send(result)
			})
		}
		con.query(`select * from communityList`,(err,result)=>{
			if(err) throw err
			return res.send(result)
		})
	})
})

app.get('/communitypanel',(req,res)=>{
	res.render('communityAsUser')
})

passport.serializeUser((user,done)=>{
	done(null, user)
})

passport.deserializeUser((user, done)=>{
	done(null,user)
})

function isAuthenticated(){
	return (req, res, next)=>{
		if(req.isAuthenticated()){
			return next()
		}
		res.redirect('/')
	}
}

function getUser(data,users){
	if(data.search){
		var newUser = []
		users.forEach((value)=>{
			if(value.Email.indexOf(data.search)>=0){
				newUser = [...newUser,value]
			}
		})
		return newUser
	}else{
		return users
	} 
}

var Port = 8000
app.listen(Port,()=>{
	console.log(`Listening on port ${Port}`)
})