var express = require('express')
var router = express.Router()
var con = require('./mysql.js')
var multer = require('multer')
var path = require('path')

const storage = multer.diskStorage({
	destination: './Public/Files',
	filename: function(req, file, cb){
		con.query(`select Id from Users where Id = '${req.user}'`,(err,result)=>{
			if(err) throw err;
			con.query(`update Users set Image = '${result[0].Id + path.extname(file.originalname)}' where Id = '${req.user}'`)
			cb(null, result[0].Id + path.extname(file.originalname))
		})
	}
})

const upload = multer({
	storage: storage,
}).single('file');

router.get('/',(req,res)=>{
	if(req.isAuthenticated()){
		con.query(`select * from Users where Id = '${req.user}'`,(err,result)=>{
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
	con.query(`select * from Users where Email = '${req.body.Email}' and Password = '${req.body.Password}'`,(err,user)=>{
		if(err) throw err
		if(user.length>0){
			if(user[0].ActivationState == 'True'){
				req.login(user[0].Id,(err)=>{
					if(err) throw err
					if(user[0].Verified == 'True'){
						if(user[0].Role == 'User'){
							return res.redirect('/profile')	
						}else{
							return res.redirect('/admin/profile')
						}
					}else{
						res.render('editInfomation_starting',{data: user[0]})
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
	con.query(`select * from Users where Id = '${req.user}'`,(err,result)=>{
		if(err) throw err
		var data = result[0]
		return res.render('profile',{data : data,visible : true})
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
	con.query(`update Users set LoginAs = 'Admin' where Id = '${req.user}'`,(err,result)=>{
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
		con.query(`delete from tags where name = '${data}'`,(err,result)=>{
			if(err) throw err
			return res.send('done')
		})
	})
})

router.get('/changePassword',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Id = '${req.user}'`,(err,result)=>{
		if(err) throw err
		res.render('ChangePassword',{changed: false, data: result[0]})
	})
})

router.post('/changePassword',isAuthenticated(),(req,res)=>{
	var data = req.body
	con.query(`select Password from Users where Id = '${req.user}'`,(err,result)=>{
		if(err) throw err
		if(result[0].Password === data.old){
			con.query(`update Users set Password = '${data.new}' where Id = '${req.user}'`,(err,result)=>{
				con.query(`select * from Users where Id = '${req.user}'`,(err,result)=>{
					if(err) throw err
					res.render('ChangePassword',{changed: 'changed', data: result[0]})
				})
			})
		}else{
			con.query(`select * from Users where Id = '${req.user}'`,(err,result)=>{
				if(err) throw err
				res.render('ChangePassword',{changed: 'wrong', data: result[0]})
			})
		}
	})
})

router.get('/editInformation',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Id = '${req.user}'`,(err,result)=>{
		if(err) throw err
		var data = result[0]
		return res.render('editInformation',{data})
	})
})

router.get('/getInformation',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Id = '${req.user}'`,(err,result)=>{
		if(err) throw err
		res.send(JSON.stringify(result[0]))
	})
})

router.post('/updateInfo',isAuthenticated(),(req,res)=>{
	var data = req.body
	console.log(data)
	con.query(`update Users set Name = '${data.name}', DOB = '${data.dob}', Gender = '${data.gender}', Phno = '${data.phone}', City = '${data.city}', About = '${data.about}', Expectations = '${data.expectations}', Verified = 'True' where Id = '${req.user}'`,(err,result)=>{
		if (err) throw err
		res.redirect('/profile')
	})
})

router.get('/switchAsUser',(req,res)=>{
	con.query(`select * from Users where Id = '${req.user}'`,(err,result)=>{
		if(err) throw err
		if(result[0].LoginAs == 'Admin'){
			var data = {switch: 'User',msg:'Switch Admin To User'}
			con.query(`update Users set LoginAs = 'User' where Id = '${req.user}'`,(err,result)=>{
				res.render('Switch',{data})
			})
		}else{
			var data = {switch: 'Admin',msg: 'Switch User To Admin'}
			con.query(`update Users set LoginAs = 'Admin' where Id = '${req.user}'`,(err,result)=>{
				res.render('Switch',{data})
			})
		}
	})
})

router.post('/updateProfilePic',(req,res)=>{
	upload(req,res,err=>{
		if(err) throw err;
		res.redirect('/profile')
	})
})

router.get('/viewprofile/:id',(req,res)=>{
	console.log(req.params.id)
	con.query(`select * from Users where Id = '${req.user}'`,(err,user)=>{
		con.query(`select * from Users where Id = '${req.params.id}'`,(err,user2)=>{
			res.render('MemberProfile',{
				data: user[0],
				data2: user2[0]
			})
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