var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var multer = require('multer')
var path = require('path')

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

const storage = multer.diskStorage({
	destination: './Public/Files',
	filename: function(req, file, cb){
		con.query(`select Id from Users where Email = '${req.user}'`,(err,result)=>{
			if(err) throw err;
			con.query(`update Users set Image = '${result[0].Id + path.extname(file.originalname)}' where Email = '${req.user}'`)
			cb(null, result[0].Id + path.extname(file.originalname))
		})
	}
})

const upload = multer({
	storage: storage,
}).single('file');

router.get('/',(req,res)=>{
	if(req.isAuthenticated()){
		con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
			if(err) throw err
			if(result[0].Verified == 'True'){
				if(result[0].Role == 'User'){
					return res.redirect('/profile')
				}else{
					if(result[0].LoginAs == 'Admin'){
						return res.redirect('/admin/profile')
					}else{
						return res.redirect('/community/communitypanel')
					}
				}
			}else{
				res.render('editInfomation_starting',{data: result[0]})
			}
		})
	}else{
		res.render('Login',{visible: false})
	}
})
router.post('/',(req,res)=>{
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
						res.render('editInfomation_starting',{data: result[0]})
					}
				})
			}else{
				return res.render('404NotFound')
			}
		}else{
			return res.render('Login',{visible: true})
		}
	})
})

router.get('/profile',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		var data = result[0]
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

router.post('/Activation',isAuthenticated(),(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		con.query(`update Users set ActivationState = '${data.state}' where Email = '${data.user}'`,(err,result)=>{
			if(err) throw err
			return res.send(data)
		})
	})
})

router.post('/Available',(req,res)=>{
	var data = ''
	req.on('data',chunk => {
		data += chunk
	})
	req.on('end',()=>{
		con.query('select Email from Users',(err,result)=>{
			if(err) throw err;
			for(var i=0;i<result.length;i++){
			  	if(result[i].Email == data){
			  		return res.send(' is already exist')
			  	}
			}
			return res.send(' is Available')
		})
	})
})

router.get('/Logout',isAuthenticated(),(req,res)=>{
	con.query(`update Users set LoginAs = 'Admin' where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
	})
	req.session.destroy((err)=>{
		if(err) throw err
		return res.redirect('/')
	})
})

router.post('/deletetag',isAuthenticated(),(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		con.query(`delete from tags where Id = ${data}`,(err,result)=>{
			if(err) throw err
			return res.send('done')
		})
	})
})

router.get('/changePassword',isAuthenticated(),(req,res)=>{
	changePassword(req,res,false)
})

router.post('/changePassword',isAuthenticated(),(req,res)=>{
	var data = req.body
	con.query(`select Password from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		if(result[0].Password === data.old){
			con.query(`update Users set Password = '${data.new}' where Email = '${req.user}'`)
			changePassword(req,res,'changed')
		}else{
			changePassword(req,res,'wrong')
		}
	})
})

router.get('/editInformation',isAuthenticated(),(req,res)=>{
	editInformation(req,res)
})

router.get('/getInformation',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		res.send(JSON.stringify(result[0]))
	})
})

router.post('/updateInfo',isAuthenticated(),(req,res)=>{
	var data = req.body
	console.log(data)
	con.query(`update Users set Name = '${data.name}', DOB = '${data.dob}', Gender = '${data.gender}', Phno = '${data.phone}', City = '${data.city}', About = '${data.about}', Expectations = '${data.expectations}', Verified = 'True' where Email = '${req.user}'`,(err,result)=>{
		if (err) throw err
		res.redirect('/profile')
	})
})

router.get('/switchAsUser',(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		if(result[0].LoginAs == 'Admin'){
			var data = {switch: 'User',msg:'Switch Admin To User'}
			con.query(`update Users set LoginAs = 'User' where Email = '${req.user}'`)
			res.render('Switch',{data})
		}else{
			var data = {switch: 'Admin',msg: 'Switch User To Admin'}
			con.query(`update Users set LoginAs = 'Admin' where Email = '${req.user}'`)
			res.render('Switch',{data})
		}
	})
})

router.post('/updateProfilePic',(req,res)=>{
	upload(req,res,err=>{
		if(err) throw err;
		res.redirect('/profile')
	})
})

function editInformation(req,res) {
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		console.log(result[0])
		var data = result[0]
		if(data.Role == 'User'){
			return res.render('editInformation_user',{data})
		}else{
			if(data.LoginAs == 'Admin'){
				return res.render('editInformation_superadmin_admin',{data})
			}else{
				return res.render('editInformation_superadmin_user',{data})
			}
		}
	})
}

function changePassword(req,res,value){
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		if(result[0].Role == 'User'){
			res.render('ChangePassword_user',{changed: value, data: result[0]})
		}else{
			if(result[0].LoginAs == 'Admin'){
				return res.render('changePassword_superadmin_admin',{changed: value, data: result[0]})
			}else{
				return res.render('ChangePassword_superadmin_user',{changed: value, data: result[0]})
			}
		}
	})
}

function isAuthenticated(){
	return (req, res, next)=>{
		if(req.isAuthenticated()){
			return next()
		}
		return res.redirect('/')
	}
}

module.exports = router;