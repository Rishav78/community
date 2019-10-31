const express = require('express')
const router = express.Router()
const knex = require('./mysql.js')
const multer = require('multer')
const path = require('path')
const user = require('../models/user');

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
		user.find({"_id": req.user._id}).then((result)=>{
			if(result[0].Verified == true){
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
		res.render('login',{visible: false})
	}
})
router.post('/',(req,res)=>{
	user
	.find({
		Email: req.body.Email,
		Password: req.body.Password
	})
	.then((user)=>{
		if(user.length>0){
			if(user[0].ActivationState == true){
				req.login(user[0]._id,(err)=>{
					if(err) throw err
					if(user[0].Verified == true){
						if(user[0].Role == 'User'){
							return res.redirect('/profile')	
						}else{
							return res.send(user)
							// return res.redirect('/admin/profile')
						}
					}else{
						res.render('editInfomation_starting',{data: user[0]})
					}
				})
			}else{
				return res.render('404NotFound',{msg: 'Error: Unable to login you are deactivated contact site admin...'})
			}
		}else{
			return res.render('login',{visible: true})
		}
	})
})

router.get('/profile',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((result)=>{
		var data = result[0]
		return res.render('profile',{data : data,visible : true})
	})
})

router.post('/Activation',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Email', req.body.user)
	.update({
		ActivationState: req.body.state,
	})
	.then(()=>{
		return res.send(req.body)
	})
})

router.post('/Available',(req,res)=>{
	knex.select('Email')
	.where('Email', req.body.Email)
	.from('Users')
	.then((result)=>{
		if(result.length > 0) return res.send(' is already exist');
		return res.send(' is Available');
	})
})

router.get('/Logout',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.update({
		LoginAs: 'Admin'
	})
	.then(()=>{
		req.session.destroy((err)=>{
			if(err) throw err
			return res.redirect('/')
		})
	})
})

router.post('/deletetag/:id',isAuthenticated(),(req,res)=>{
	knex('tags')
	.where('name',req.params.id)
	.del()
	.then(()=>{
		return res.send('done')
	})
})

router.get('/changePassword',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id',req.user)
	.then((result)=>{
		res.render('ChangePassword',{changed: false, data: result[0]})
	})
})

router.post('/changePassword',isAuthenticated(),(req,res)=>{
	knex.select().from('Users').where('Id',req.user).then((result)=>{
		if(result[0].Password === req.body.old){
			knex('Users')
			.where('Id', req.user)
			.update({
				Password: req.body.new
			})
			.then(()=>{
				res.render('ChangePassword',{changed: 'changed', data: result[0]})
			})
		}else{
			res.render('ChangePassword',{changed: 'wrong', data: result[0]})
		}
	})
})

router.get('/editInformation',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((result)=>{
		return res.render('editInformation',{data: result[0]})
	})
})

router.get('/getInformation',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((result)=>{
		res.send(JSON.stringify(result[0]))
	})
})

router.post('/updateInfo',isAuthenticated(),(req,res)=>{
	var data = req.body
	console.log(data)
	knex('Users')
	.where('Id',req.user)
	.update({
		Name: data.name,
		DOB: data.dob,
		Gender: data.gender,
		Phno: data.phno,
		City: data.city,
		About: data.about,
		Expectations: data.expectations,
		Verified: 'True'
	})
	.then(()=>{
		res.redirect('/profile')
	})
})

router.get('/switchAsUser',(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((result)=>{
		var data = {
			switch: result[0].LoginAs == 'Admin' ? 'User': 'Admin',
			msg: result[0].LoginAs == 'Admin' ? 'Switch Admin To User' : 'Switch User To Admin'
		}
		knex('Users')
		.where('Id', req.user)
		.update({
			LoginAs: data.switch
		})
		.then(()=>{
			res.render('Switch',{data})
		})
	})
})

router.post('/updateProfilePic',(req,res)=>{
	upload(req,res,err=>{
		if(err) throw err;
		res.redirect('/profile')
	})
})

router.get('/viewprofile/:id',(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.the(function(user){
		this(Users)
		.where('Id', req.params.id)
		.then(function(user2){
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