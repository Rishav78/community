// <-------------------- Require Modules ------------------------------>

var express = require('express')
var path = require('path')
var multer = require('multer')
var bodyParser = require('body-parser')
var mysql = require('mysql')
var session = require('express-session')
var MySQLStorage = require('express-mysql-session')(session)
var passport = require('passport')
var app = express()

// <-------------------------------------------------------------------->






// <-------------------- Routes ---------------------------------------->

var Login = require('./Router/Login.js')
var Admin = require('./Router/admin.js')
var Tags = require('./Router/tags.js')
var Community = require('./Router/community.js')

// <------------------------------------------------------------------->






// <---------- Integreating modules with express ---------------------->

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/static',express.static(path.join(__dirname,'Public','JavaScript')))
app.use('/static',express.static(path.join(__dirname,'Public','CSS')))
app.use('/static',express.static(path.join(__dirname,'Public','Files')))
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
app.use(session({
	secret : 'sdfghjkl',
	resave : false,
	saveUninitialized : false,
	store : sessionStore
}))
// Date
app.use(passport.initialize())
app.use(passport.session())

// <-------------------------------------------------------------------->


// function checkFileType(file,cb){
// 	const filetypes = /jpeg|jpg|png|gif/
// 	const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
// 	const mimetype = filetypes.test(file.mimetype)
// 	if(mimetype && extname){
// 		return cb(null,true)
// 	}else{
// 		cb('error')
// 	}
// }
// con.connect((err)=>{
	// if (err) throw err
	// var q = `insert into Users(Name, Email, Password, Phno, City, Role, Status, ActivationState, LoginAs) values('rishav', 'rishav@gmail.com', '123456789', '1234567890', 'sdfghj,', 'User', 'Pending', 'True', 'Admin')`
	// 	con.query(q,(err,result)=>{
	// 		if(err) throw err;
	// 		console.log('add')
	// 		// return res.render('AddUser',{added : true})
	// 	})
	// con.query('create database UCA_WebProject')
	// con.query('drop table communityList')
	// con.query('truncate table Users')
	// con.query('drop table Users')
	// con.query('truncate table communityList')
	// var q = `create table Users(Id int, Name char(100), Email varchar(100), Password varchar(100), Phno char(15), City char(100), DOB char(10), Gender char(6), About char(250), Expectations char(250), Role char(50), Status char(50), Image char(100), ActivationState char(5), LoginAs char(20), Verified char(5))`
	// var q = `create table Tags(Id int, name char(100), CreatedBy varchar(100), CreationDate date)`
	// var q = 'create table CommunityList(CommunityName char(50), MembershipRule char(50), CommunityLocation varchar(50), CommunityOwner char(50), Discription char(250), CreateDate date, CommunityPic varchar(200))'
	// var q = `insert into communityList values('asdfg', 'sdfg', 'sdfgh' , 'werty', '0/0/0', 'dfghjk')`
	// var q = `insert into Users values(1, 'Rishav', 'rishavgarg789@gmail.com', 'hacker12', '1234567890', 'Mandi GobindGarh', '13/9/1999', 'Male', null, null, 'Superadmin', 'Confirmed', '1.gif', 'True', 'Admin', 'True')`
	//  
	// con.query(q)
// 	console.log('connected...')
// })

//---------------------------------------------------------------------------------------------------------------------------------------------------





// <--------------------------- initilizing Routes ------------------------------------->

app.use('/',Login)
app.use('/admin',Admin)
app.use('/tags',Tags)
app.use('/community',Community)

// <----------------------------------------------------------------------------------->



// <----------------------------------- Maintaining Passport(session) ----------------->

passport.serializeUser((user,done)=>{
	done(null, user)
})
passport.deserializeUser((user, done)=>{
	done(null,user)
})

// <---------------------------------------------------------------------------------->




// <------------------------- Initializing Port -------------------------------------->

var Port = 8000
app.listen(Port,()=>{
	console.log(`Listening on port ${Port}`)
})

// <---------------------------------------------------------------------------------->