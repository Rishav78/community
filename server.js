var express = require('express')
var path = require('path')
var multer = require('multer')
var bodyParser = require('body-parser')
var mysql = require('mysql')
var session = require('express-session')
var MySQLStorage = require('express-mysql-session')(session)
var passport = require('passport')
var app = express()
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/static',express.static(path.join(__dirname,'Public')))
const con = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'UCA_WebProject'
})
const sessionStore = new MySQLStorage({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'UCA_WebProject'
})
const storage = multer.diskStorage({
	destination: './public/',
	filename: function(req, file, cb){
		cb(null,file.fieldname + path.extname(file.originalname))
	}
})
const upload = multer({
	storage: storage,
	// limits : {
	// 	fileSize: 10
	// }
	fileFilter: function(req,file,cb){
		checkFileType(file,cb)
	}
}).single('myImage')
function checkFileType(file,cb){
	const filetypes = /jpeg|jpg|png|gif/
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
	const mimetype = filetypes.test(file.mimetype)
	if(mimetype && extname){
		return cb(null,true)
	}else{
		cb('error')
	}
}
app.use(session({
	secret : 'sdfghjkl',
	resave : false,
	saveUninitialized : false,
	store : sessionStore
}))
Date
app.use(passport.initialize())
app.use(passport.session())
con.connect((err)=>{
	if (err) throw err
		// con.query('drop table communityList')
	// con.query('truncate table tags')
	// con.query('drop table Users')
	// con.query('truncate table Users')
	// var q = `create table Users(Name char(100), Email varchar(100), Password varchar(100), Phno char(15), City char(100), DOB char(10), Gender char(6), About char(250), Expectations char(250), Role char(50), Status char(50), ActivationState char(5), LoginAs char(20), Verified char(5))`
	// var q = `create table Tags(Id int, name char(100), CreatedBy varchar(100), CreationDate date)`
	// var q = 'create table CommunityList(CommunityName char(50), MembershipRule char(50), CommunityLocation varchar(50), CommunityOwner char(50), CreateDate date, CommunityPic varchar(200))'
	// var q = `insert into communityList values('asdfg', 'sdfg', 'sdfgh' , 'werty', '0/0/0', 'dfghjk')`
	// var q = `insert into Users values('Rishav', 'rishavgarg789@gmail.com', 'hacker12', '1234567890', 'Mandi GobindGarh', '13/9/1999', 'Male', null, null, 'Superadmin', 'Confirmed', 'True', 'Admin', 'True')`
	//  
	// con.query(q)
	console.log('connected...')
})
app.get('/',(req,res)=>{
	if(req.isAuthenticated()){
		con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
			if(err) throw err
				console.log(result[0].Role)
			if(result[0].Verified == 'True'){
				if(result[0].Role == 'User'){
					return res.redirect('/profile')
				}else{
					if(result[0].LoginAs == 'Admin'){
						return res.redirect('/admin/profile')
					}else{
						return res.redirect('/communitypanel')
					}
				}
			}else{
				editInformation(req,res)
			}
		})
	}
	res.sendFile(path.join(__dirname,'views','login.html'))
})
app.post('/login',(req,res)=>{
	con.query(`select * from Users where Email = '${req.body.Email}' and Password = '${req.body.Password}'`,(err,result)=>{
		if(err) throw err
		if(result.length>0){
			if(result[0].ActivationState == 'True'){
				req.login(req.body.Email,(err)=>{
					if(err) throw err
					if(result[0].Verified == 'True'){
						if(result[0].Role == 'User'){
							return res.redirect('/profile')	
						}else{
							return res.redirect('/admin/profile')
						}
					}else{
						editInformation(req,res)
					}
				})
			}else{
				return res.render('404NotFound')
			}
		}else{
			return res.send('User does not exist')
		}
	})
})

app.get('/admin/profile',isAuthenticated(),(req,res)=>{
	con.query(`update Users set LoginAs = 'Admin' where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
	})
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		var data = result[0]
		return res.render('Home',{data : data,visible : false})
	})
})

app.get('/profile',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		var data = result[0]
		console.log(data.LoginAs)
		if(data.Role == 'User'){
			return res.render('profile_user',{data : data, visible : true})
		}else{
			if(data.LoginAs == 'Admin'){
				return res.render('profile_superadmin_admin',{data : data,visible : true})
			}else{
				return res.render('profile_superadmin_user',{data : data,visible : true})
			}
		}
	})
})

app.get('/admin/adduser',isAuthenticated(),(req,res)=>{
	return res.render('AddUser')
})

app.post('/admin/adduser',(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})

	req.on('end',()=>{
		data = JSON.parse(data)
		con.query(`select * from Users where Email = '${data.email}'`,(err,result)=>{
			if(err) throw err
			console.log('dfghjkl')
			if(result.length == 0){
				var q = `insert into Users(Name, Email, Password, Phno, City, Role, Status, ActivationState, LoginAs) values('${data.name}', '${data.email}', '${data.password}', '${data.phone}', '${data.city}', '${data.role}', 'Pending', 'False', 'Admin')`
				con.query(q,(err,result)=>{
					if(err) throw err;
					console.log('add')
					return res.send('User Added')
				})
			}else{
				return res.send('User Already Exist')
			}
		})
		
	})
})

app.get('/admin/userlist',isAuthenticated(),(req,res)=>{
	con.query('select * from Users',(err,result)=>{
		return res.render('ShowUser2',{data : result})
	})
})

app.post('/admin/userlist',(req,res)=>{
	console.log('ghj')
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		if(data.status == 'All' && data.userType == 'All'){
			con.query(`select * from Users`,(err,result)=>{
				if(err) throw err
				return res.send(JSON.stringify(getUser(data,result)))
			})
		}else if(data.status != 'All' && data.userType == 'All'){
			con.query(`select * from Users where Status = '${data.status}'`,(err,result)=>{
				if(err) throw err
				return res.send(JSON.stringify(getUser(data,result)))
			})
		}else if(data.status == 'All' && data.userType != 'All'){
			con.query(`select * from Users where Role = '${data.userType}'`,(err,result)=>{
				if(err) throw err
				return res.send(JSON.stringify(getUser(data,result)))
			})
		}else{
			con.query(`select * from Users where Status = '${data.status}' and Role = '${data.userType}'`,(err,result)=>{
				if(err) throw err
				return res.send(JSON.stringify(getUser(data,result)))
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
		  	return res.send('done')
		})
	})
})

// app.post('/deleteuser',(req,res)=>{
// 	var data = ''
// 	req.on('data',(chunk)=>{
// 		data += chunk
// 	})
// 	req.on('end',()=>{
// 		con.query(`delete from Users where Email = '${data}'`,(err,result)=>{
// 			if(err) throw err
// 			console.log('done')
// 			res.send('deleted')
// 		})
// 	})
// })

app.post('/Activation',(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		console.log(data)
		con.query(`update Users set ActivationState = '${data.state}' where Email = '${data.user}'`,(err,result)=>{
			if(err) throw err
			return res.send(data)
		})
	})
})

app.get('/Logout',isAuthenticated(),(req,res)=>{
	con.query(`update Users set LoginAs = 'Admin' where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
	})
	req.session.destroy((err)=>{
		if(err) throw err
		return res.redirect('/')
	})
})

app.get('/tags',(req,res)=>{
	return res.render('Tags')
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
					return res.send('added')
				})
			}else{
				return res.send('tag already exist')
			}
		})
	})
})

app.get('/tagslist',(req,res)=>{
	return res.render('taglist2')
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
				return res.send(result)
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
			return res.send('done')
		})
	})
})

app.get('/changePassword',(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		if(result[0].Role == 'User'){
			res.render('ChangePassword_user')
		}else{
			if(result[0].LoginAs == 'Admin'){
				return res.render('changePassword_superadmin_admin')
			}else{
				return res.render('ChangePassword_superadmin_user')
			}
		}
	})
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

app.get('/community/communityList',(req,res)=>{
	return res.render('communityList')
})

app.post('/community/communityList',(req,res)=>{
	var data = ''
	console.log('dfghj')
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

app.get('/manageCommunity',(req,res)=>{
	return res.render('manageCommunity')
})

app.get('/communitypanel',(req,res)=>{
	con.query(`update Users set LoginAs = 'User' where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
	})
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		if(result[0].Role == 'User'){
			return res.render('communitypanel_user')
		}else{
			return res.render('communitypanel_superadmin_user')
		}
	})
})

app.get('/notfound',(req,res)=>{
	return res.render('404NotFound')
})

app.get('/editInformation',(req,res)=>{
	editInformation(req,res)
})

app.get('/getInformation',(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		res.send(JSON.stringify(result[0]))
	})
})

app.post('/updateInfo',(req,res)=>{
	console.log(req.body)
	var data = req.body
	// con.query(`update Users set Name = '${data.name}', DOB = '${data.dob}', Gender = '${data.gender}', Phno = '${data.phone}', City = '${data.city}', About = '${data.about}', Expectations = '${data.expectations}', Verified = 'True' where Email = '${req.user}'`,(err,result)=>{
	// 	if (err) throw err
	// 	res.redirect('/profile')
	// })
	res.redirect('/profile')
})

app.get('/faltu',(req,res)=>{
	res.render('faltu')
})

app.post('/faltu',(req,res)=>{
	console.log(req.body)

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
		return res.redirect('/')
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

function editInformation(req,res) {
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		console.log(req.user)
		var data = result[0]
		if(data.Role == 'User'){
			return res.render('editInformation_user')
		}else{
			if(data.LoginAs == 'Admin'){
				return res.render('editInformation_superadmin_admin')
			}else{
				return res.render('editInformation_superadmin_user')
			}
		}
	})
}

var Port = 8000
app.listen(Port,()=>{
	console.log(`Listening on port ${Port}`)
})