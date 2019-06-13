// <-------------------- Require Modules ------------------------------>

var express = require('express')
var path = require('path')
var multer = require('multer')
var bodyParser = require('body-parser')
var mysql = require('mysql')
var session = require('express-session')
var MySQLStorage = require('express-mysql-session')(session)
var passport = require('passport')
var GitHubStrategy = require('passport-github').Strategy;
var app = express()

// <-------------------------------------------------------------------->






// <-------------------- Routes ---------------------------------------->

var Login = require('./Router/Login.js')
var Admin = require('./Router/admin.js')
var Tags = require('./Router/tags.js')
var Community = require('./Router/community.js')

// <------------------------------------------------------------------->






// <---------- Integreating modules with express ---------------------->

passport.use(new GitHubStrategy({
    clientID: 'Iv1.13d8fc580d101b03',
    clientSecret: 'd3b582904a88c27b5692c6ac6c9b503164496342',
  },
  function(accessToken, refreshToken, profile, cb) {

    con.query(`select * from Users where Email = '${profile.emails[0].value}'`,(err,result)=>{
    	if(err) throw err;
    	if(result.length > 0){
    		console.log('express-session')
    		return cb(null,result[0].Id)
    	}else{
    		var id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
			if(err) throw err
			con.query(`insert into Users(Id, Name, Email, Password, Phno, City, Role, Status, Image, ActivationState, LoginAs) values('${id}', '${profile.displayName}', '${profile.emails[0].value}', '${profile.username}', null, '${profile._json.location}', 'User', 'Pending', 'default.png', 'True', 'Admin')`,(err,result)=>{
				if(err) throw err;
				return cb(null,id)
			})
    	}
    })
  }
));

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

app.get('/auth/github',
  passport.authenticate('github',{
  	scope: ['profile']
  }));

app.get('/code', passport.authenticate('github', { failureRedirect: '/' }), (req,res)=>{
	console.log(req.user)
	console.log('done')
	res.redirect('/')
});


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
con.connect((err)=>{
	if (err) throw err
	// var q = `insert into Users(Name, Email, Password, Phno, City, Role, Status, ActivationState, LoginAs) values('rishav', 'rishav@gmail.com', '123456789', '1234567890', 'sdfghj,', 'User', 'Pending', 'True', 'Admin')`
	// 	con.query(q,(err,result)=>{
	// 		if(err) throw err;
	// 		console.log('add')
	// 		// return res.render('AddUser',{added : true})
	// 	})
	// con.query('truncate table CommunityMembers')
	// con.query('drop table comments')
	// con.query('create table Comments(Id char(100), Ref char(100), CreatedBy char(100), UserName char(100), Text char(100), Comments int)')
	// con.query('create table CommunityMembers(Id char(100), UserId char(100), Accepted char(5), Type char(5))')
	// con.query('truncate table communityList')
	// con.query('create database UCA_WebProject')
	// con.query('drop table DiscussionTopic')
	// con.query('create table DiscussionTopic(Id char(100), CommunityId char(100), CreatedBy char(100), UserName char(100), Topic char(100), About char(100), Date char(10), Comments int)')
	// con.query("insert into DiscussionTopic values('qwef34', '1wdfgy65', 'SuperAdmin', 'Rishav', 'Nthing', '1/9/1999', 7)")
	// con.query("insert into comments values('1234', 'qwef34', 'sdfghj', 'Rishav', 'yoyo', 1)")
	// con.query('drop table communityList')
	// con.query('drop table Users')
	// con.query('truncate table communityList')
	// con.query('drop table tags')
	// con.query('truncate table InvitedUsers')
	// con.query(`create table InvitedUsers(Id char(100), UserId char(100))`)
	// con.query('update communityList set totalreq = 0, members = 0')
	// var q = `create table Users(Id char(100), Name char(100), Email varchar(100), Password varchar(100), Phno char(15), City char(100), DOB char(10), Gender char(6), About char(250), Expectations char(250), Role char(50), Status char(50), Image char(100), ActivationState char(5), LoginAs char(20), Verified char(5))`
	// var q = `create table Tags(Id char(100), name char(100), CreatedBy varchar(100), CreationDate varchar(10))`
	// var q = 'create table CommunityList(Id char(100), CommunityName char(50), MembershipRule char(50), CommunityLocation varchar(50), CommunityOwner varchar(100), Discription char(250), CreateDate char(10), TotalReq int DEFAULT 0, Members int DEFAULT 0, User int DEFAULT 0, Invited int DEFAULT 0, CommunityPic varchar(200), Status char(12))'
	// var q = `insert into communityList values('5fosgdvgy6lcrzh2gc0dzd', 'First Community', 'Direct', 'Mandi' , 'Rishav', 'nothing', '1/1/1', 0, 0, 0, 0, 'defaultCommunity.jpg')`
	// var q = `insert into Users values('g7yti9e4o7n14gl3n81dw6', 'Rishav', 'rishavgarg789@gmail.com', 'hacker12', '1234567890', 'Mandi GobindGarh', '13/9/1999', 'Male', null, null, 'Superadmin', 'Confirmed', '1.gif', 'True', 'Admin', 'True')`
	 
	// con.query(q)
	// console.log('connected...')
})

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