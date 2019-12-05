const express = require('express')
const router = express.Router()
const knex = require('./mysql.js')
const multer = require('multer')
const path = require('path')
const user = require('../models/user');
const tag = require('../models/tag');

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


router.get('/profile',isAuthenticated(),(req,res)=>{
	return res.render('profile',{data : req.user,visible : true})
})

router.post('/Activation',isAuthenticated(),(req,res)=>{

	user
	.updateOne({"_id": req.body.user},{
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
	user
	.updateOne({'_id': req.user._id},{
		LoginAs: 'Admin'
	})
	.then(()=>{
		req.session.destroy((err)=>{
			if(err) throw err
			return res.redirect('/')
		})
	})
})

router.get('/deletetag/:id',isAuthenticated(),(req,res)=>{
	console.log(req.params.id)
	tag.findByIdAndRemove(req.params.id)
	.then(()=>{
		return res.send('done')
	})
})

router.get('/changePassword',isAuthenticated(),(req,res)=>{
	res.render('changePassword',{changed: false, data: req.user})
})

router.post('/changePassword',isAuthenticated(),(req,res)=>{
	user.findById(req.user._id)
	.then((result)=>{
		if(result.Password === req.body.old){
			user.updateOne({'_id': req.user._id},{
				Password: req.body.new
			})
			.then(()=>{
				res.render('changePassword',{changed: 'changed', data: req.user})
			})
		}else{
			res.render('changePassword',{changed: 'wrong', data: req.user})
		}
	})
})

router.get('/editInformation',isAuthenticated(),(req,res)=>{
	return res.render('editInformation',{data: req.user})
})

router.get('/getInformation',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((result)=>{
		res.send(JSON.stringify(result[0]))
	})
})

router.post('/editInformation',isAuthenticated(),(req,res)=>{
	var data = req.body
	user.updateOne({'_id': req.user._id},
	{
		Name: data.name,
		DOB: data.dob,
		Gender: data.gender,
		Phno: data.phno,
		City: data.city,
		About: data.about,
		Expectations: data.expectations,
		Verified: true
	})
	.then(()=>{
		res.redirect('/profile')
	})
})

router.get('/switchAsUser',(req,res)=>{
	user
	.findById(req.user._id)
	.then((result)=>{
		var data = {
			switch: result.LoginAs == 'Admin' ? 'User': 'Admin',
			msg: result.LoginAs == 'Admin' ? 'Switch Admin To User' : 'Switch User To Admin'
		}
		
		user
		.updateOne({'_id': req.user._id},{
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
	
	user
	.findById(req.params.id)
	.then(function(user2){
		res.render('MemberProfile',{
			data: req.user,
			data2: user2
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