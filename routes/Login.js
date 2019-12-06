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

router.get('/deletetag/:id',isAuthenticated(),(req,res)=>{
	console.log(req.params.id)
	tag.findByIdAndRemove(req.params.id)
	.then(()=>{
		return res.send('done')
	})
})

router.get('/getInformation',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((result)=>{
		res.send(JSON.stringify(result[0]))
	})
})


router.post('/updateProfilePic',(req,res)=>{
	upload(req,res,err=>{
		if(err) throw err;
		res.redirect('/profile')
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