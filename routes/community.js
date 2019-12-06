var express = require('express')
var router = express.Router()
const user = require('../models/user');
const community = require('../models/community');
var path = require('path')
var multer = require('multer')
var striptags = require('striptags')
const communitymembers = require('../models/communityMember');
const mongoose = require('../models/db');
const inviteduser = require('../models/inviteduser');



router.post('/updateCommunity/:id',(req,res)=>{
	knex('communityList')
	.where('Id', req.params.id)
	.update({
		CommunityName: req.body.CommunityName,
		Status: req.body.Status,
	})
	.then(()=>{
		res.send('done')
	})
})

router.get('/getCommunity/:id',(req,res)=>{
	knex.table('communityList')
	.innerJoin('Users','communityList.CommunityOwner','=','Users.Id')
	.where('communityList.Id', req.params.id)
	.then((result)=>{
		res.json(result[0])
	})
})



router.post('/updateProfilePic',isAuthenticated(),(req,res)=>{
	upload(req,res,err=>{
		if(err) throw err;
		res.redirect('/profile')
	})
})

router.get('/manageCommunity/:id',isAuthenticated(),(req,res)=>{
	community
	.findById(req.params.id)
	.then((community)=>{
		if(community.Status=='Activate'){
			return res.render('manageCommunity',{
				data: req.user, 
				community: community, 
				join: true,
				request: false
			})
		}else{
			return res.render('404NotFound',{msg: 'Error: This community is deactivated or may be deleted by superadmin'})
		}
	})
})


router.get('/CommunityMembers/:id',isAuthenticated(),(req,res)=>{
	communitymembers
	.find({
		'communityId': req.params.id,
		'Accepted' : true,
		'Type': 'User',
	})
	.populate('UserId')
	.then((result)=>{
		res.json(result)
	})
})




router.get('/communitymembers/:id',isAuthenticated(),(req,res)=>{
	console.log(req.params.id)
	knex('communityList')
	.where('Id', req.params.id)
	.then((community)=>{
		knex.table('Users')
		.innerJoin('CommunityMembers', 'users.Id', '=', 'communityMembers.UserId')
		.where('communityMembers.Id', req.params.id)
		.then((members)=>{
			res.render('communityMembers',{
				data: user[0], 
				community: community[0],
				members: members, 
				join: true,
				request: false
			})
		})
	})
})


router.get('/leaveCommunity/:id',isAuthenticated(),(req,res)=>{
	communitymembers
	.findOneAndRemove({
		'UserId': req.user._id,
		'communityId': req.params.id,
	})
	.then((result) => {
		community
		.updateOne({'_id': req.params.id},{
			'$inc': {
				'Members': -1,
				'User': result.Type == 'User' ? -1 : 0
			},
		})
		.then((result)=>{
			res.redirect(`/community/communityProfile/${req.params.id}`)
		})
	})
})

router.get('/discussion/:id',(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((user)=>{
		knex('communityList')
		.where('Id', req.params.id)
		.then((community)=>{
			knex.select('name')
			.from('tags')
			.then((tags)=>{
				res.render('Discussion',{
					data: user[0], 
					community: community[0], 
					visible: true, 
					join:true, 
					request: false,
					tags
				})
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