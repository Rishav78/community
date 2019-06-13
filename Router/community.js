var express = require('express')
var router = express.Router()
var knex = require('./mysql.js')
var path = require('path')
var multer = require('multer')
var striptags = require('striptags')


const storage = multer.diskStorage({
	destination: './Public/Files',
	filename: function(req, file, cb){
		con.query(`update Users set Image = '${req.user + path.extname(file.originalname)}' where Id = '${req.user}'`)
		cb(null, req.user + path.extname(file.originalname))
	}
})

const upload = multer({
	storage: storage,
}).single('file');

router.post('/updateProfilePic',(req,res)=>{
	upload(req,res,err=>{
		if(err) throw err;
		res.redirect('/profile')
	})
})

router.get('/communityList',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((result)=>{
		return res.render('communityList',{
			data: result[0]
		})
	})
})

router.post('/communityList',isAuthenticated(),(req,res)=>{
	var array = ['CommunityName', 'MembershipRule', 'CommunityLocation', 'CommunityOwner', 'CreateDate', ]
	knex.table('Users').innerJoin('communityList', 'Users.Id', '=', 'communityList.CommunityOwner')
	.where(function(){
		knex.raw(`instr(CommunityName, '${req.body.search.value}')`)
		if(req.body.MembershipRule != 'All'){
			this.andWhere('MembershipRule', req.body.MembershipRule)
		}
	})
	.orderBy(array[req.body.order[0].column], req.body.order[0].dir)
	.then((result)=>{
		var record = result.filter((value,index)=>{
			if(index >= req.body.start && req.body.length>0){
				req.body.length--
				return true;
			}
		})
		knex('communityList')
		.count('Id as Id')
		.then((count)=>{
			res.send({'recordsTotal': count[0].Id, 'recordsFiltered' : result.length, data: record});
		})
	})
})

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

router.get('/communitypanel',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((result)=>{
		knex.table('communityList').innerJoin('communityMembers','communityList.Id','=','communityMembers.Id')
		.where('communityMembers.UserId', req.user)
		.andWhere('communityMembers.Accepted', 'True')
		.then((community)=>{
			return res.render('communitypanel',{
				data: result[0],
				community: community
			})
		})
	})
})

router.get('/AddCommunity',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id',req.user)
	.then((result)=>{
		res.render('CreateCommunity',{
			created: false,
			data: result[0]
		})
	})
})

router.post('/AddCommunity/create',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((user)=>{
		var id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
		knex('communityList')
		.insert({
			Id,
			CommunityName:req.body.CommunityName,
			MembershipRule:req.body.MembershipRule,
			CommunityLocation:'Not Added',
			CommunityOwner:req.user,
			Discription:req.body.Discription.replace(/<[^>]*>/g, ''),
			CreateDate:knex.raw('SYSDATE()'),
			TotalReq:0,
			Members:0,
			User:0,
			Invited:0,
			CommunityPic:'defaultCommunity.jpg',
			Status:'Activate',
		})
		.then(()=>{
			knex('communityMembers')
			.insert({
				Id,
				UserId: req.user,
				Accepted: 'True',
				Type: 'Owner',
			})
			.then(()=>{
				res.render('CreateCommunity',{
					created: true, 
					data: user[0]
				})
			})
		})
	})
})

router.post('/updateProfilePic',isAuthenticated(),(req,res)=>{
	upload(req,res,err=>{
		if(err) throw err;
		res.redirect('/profile')
	})
})

router.get('/manageCommunity/:id',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((user)=>{
		knex('communityList')
		.where('Id', req.params.id)
		.then((community)=>{
			if(community[0].Status=='Activate'){
				return res.render('manageCommunity',{
					data: user[0], 
					community: community[0], 
					join: true,
					request: false
				})
			}else{
				return res.render('404NotFound',{msg: 'Error: This community is deactivated or may be deleted by superadmin'})
			}
		})
	})
})

router.post('/manageCommunity/:id',isAuthenticated(),(req,res)=>{
	knex('communityList')
	.where('Id', req.params.id)
	.then((result)=>{
		res.json(result)
	})
})

router.post('/promot/:id',isAuthenticated(),(req,res)=>{
	knex('communityMembers')
	.where('UserId', req.params.id)
	.andWhere('Id', req.body.communityId)
	.update({
		Type: 'Admin'
	})
	.then(()=>{
		knex('communityList')
		.where('Id', req.body.communityId)
		.update({
			User: knex.raw('User - 1')
		})
		.then(()=>{
			res.send('done')
		})
	})
})

router.get('/CommunityMembers/:id',isAuthenticated(),(req,res)=>{
	knex.table('CommunityMembers').innerJoin('Users', function(){
		this.on('CommunityMembers.UserId', '=', 'users.Id')
	})
	.where('CommunityMembers.Id', '=', req.params.id)
	.andWhere('CommunityMembers.Accepted', '=', 'True')
	.andWhere('CommunityMembers.Type', '=', 'User')
	.then((result)=>{
		res.json(result)
	})
})

router.get('/CommunitysAdmins/:id',isAuthenticated(),(req,res)=>{
	knex.table('CommunityMembers')
	.innerJoin('Users', function(){
		this.on('CommunityMembers.UserId', '=', 'users.Id')
	})
	.where('CommunityMembers.Id', '=', req.params.id)
	.andWhere('CommunityMembers.Accepted', '=', 'True')
	.andWhere('CommunityMembers.Type', '!=', 'User')
	.then((result)=>{
		res.json(result)
	})
})

router.post('/Demote/:id',isAuthenticated(),(req,res)=>{
	knex('communityMembers')
	.where('UserId', req.params.id)
	.andWhere('Id', req.body.communityId)
	.update({
		Type: 'User'
	})
	.then((result)=>{
		knex('communityList')
		.where('Id', req.body.communityId)
		.update({
			User: knex.raw('User + 1')
		})
		.then(()=>{
			res.send('done')
		})
	})
})

router.post('/delete/:id',isAuthenticated(),(req,res)=>{
	knex('communityMembers')
	.where('User', req.body.user)
	.andWhere('Id', req.params.id)
	.del()
	.then(()=>{
		knex('communityList')
		.where('Id', req.params.id)
		.update({
			Members: knex.raw('Members - 1')
		})
		.then(()=>{
			if(req.body.Type == 'User'){
				knex('communityList')
				.where('Id', req.params.id)
				.update({
					User: knex.raw('User - 1')
				})
				.then(()=>{
					res.send('done')
				})
			}else {
				res.send('done');
			}
		})
	})

})

router.get('/list',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((user)=>{
		res.render('joinCommunity',{
				data: user[0]
			})
	})
})

router.post('/list',isAuthenticated(),(req,res)=>{
	knex('communityList')
	.where(function(){
		this.whereNotIn('Id',function(){
			this.select('Id')
			.from('communityMembers')
			.where('UserId', req.user)
		})
	})
	.andWhere(knex.raw(`instr(CommunityName, '${req.body.search}')`))
	.andWhere('Status', 'Activate')
	.then((community)=>{
		return res.json(community)
	})
})

router.get('/joinCommunity/:id',isAuthenticated(),(req,res)=>{
	knex.select('MembershipRule')
	.from('communityList')
	.where('Id', req.params.id)
	.then((result)=>{
		if(result[0].MembershipRule == 'Direct'){
			knex('CommunityMembers')
			.insert({
				Id: req.params.id,
				UserId: req.user,
				Accepted: 'True',
				Type: 'User'
			})
			.then(()=>{
				knex('communityList')
				.where('Id', req.params.id)
				.update({
					Members: knex.raw('Members + 1'),
					User: knex.raw('User + 1'),
				})
			})
		}else{
			knex('CommunityMembers')
			.insert({
				Id: req.params.id,
				UserId: req.user,
				Accepted: 'False',
				Type: 'User'
			})
			.then(()=>{
				knex('communityList')
				.where('Id', req.params.id)
				.update({
					TotalReq: knex.raw('TotalReq + 1'),
				})
			})
		}
		res.redirect(`/community/communityProfile/${req.params.id}`);
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

router.get('/invite/:id',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((user)=>{
		knex('communityList')
		.where('Id', req.params.id)
		.then((community)=>{
			res.render('inviteUsers',{
				data: user[0],
				community: community[0],
			 	join: true,
				request: false
			})
		})
	})
})

router.post('/inviteUserList/:id',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where(function(){
		this.whereNotIn('Id', function(){
			this.select('UserId')
			.from('communityMembers')
			.where('Id', req.params.id)
		})
	})
	.andWhere(function(){
		this.whereNotIn('Id', function(){
			this.select('UserId')
			.from('InvitedUsers')
			.where('Id', req.params.id)
		})
	})
	.andWhere(knex.raw(`INSTR(Name, '${req.body.search}')`))
	.then((result)=>{
		res.json(result)
	})
})

router.post('/invite/:id',isAuthenticated(),(req,res)=>{
	knex('invitedUsers')
	.insert({
		Id: req.params.id,
		UserId: req.body.id
	})
	.then(()=>{
		knex('communityList')
		.where('Id', req.params.id)
		.update({
			Invited: knex.raw('Invited + 1')
		})
		.then(()=>{
			res.send('done')
		})
	})
})

router.get('/communityProfile/:id',isAuthenticated(),(req,res)=>{
	knex('User')
	.where('Id', req.user)
	.then((user)=>{
		knex('communityList')
		.where('Id', req.params.id)
		.then((community)=>{
			knex.table('communityMembers')
			.innerJoin('Users','communityMembers.UserId', '=', 'Users.Id')
			.where('communityMembers.Id', req.params.id)
			.then((joined)=>{
				var requested
				var join = joined.filter((value)=>{
					return value.UserId == req.user
				})
				if(join[0]){
					requested = join[0].Accepted == 'False'
				}
				join = join.length > 0 && join[0].Accepted == 'True'
				var owner = joined.filter((value) => {
					return (value.UserId == req.user) && (value.Type == 'Owner')
				})
				res.render('CommunityProfile',
				{
					data: user[0], 
					community: community[0], 
					join: join, 
					request :requested,
					members: joined,
					owner: owner
				})
			})
		})
	})	
})

router.get('/leaveCommunity/:id',isAuthenticated(),(req,res)=>{
	knex('communityMembers')
	.where('Id', req.params.id)
	.andWhere('UserId', req.user)
	.then((member)=>{
		knex('communityMembers')
		.where('Id', req.params.id)
		.andWhere('UserId', req.user)
		.del()
		.then((result)=>{
			knex('communityList')
			.where('Id', req.params.id)
			.update({
				Members: knex.raw('Members - 1'),
				User: member[0].Type == 'User' ? knex.raw('User - 1') : knex.raw('User')
			})
			.then((result)=>{
				res.redirect(`/community/communityProfile/${req.params.id}`)
			})
		})
	})
})

router.get('/requests/:id',isAuthenticated(),(req,res)=>{
	knex.table('communityMembers')
	.innerJoin('Users','communityMembers.UserId', '=','Users.Id')
	.where('communityMembers.Id', req.params.id)
	andWhere('Accepted', 'False')
	.then((request)=>{
		res.json(request)
	})
})

router.get('/invitedUsers/:id',isAuthenticated(),(req,res)=>{
	knex.table('invitedUsers').innerJoin('Users', 'invitedUsers.UserId', '=', 'Users.Id')
	.where('invitedUsers.Id', req.params.id)
	.then((request)=>{
		res.json(request)
	})
})

router.post('/deleteInvite/:id',isAuthenticated(),(req,res)=>{
	knex('invitedUsers')
	.where('Id', req.params.id)
	.andWhere('UserId', req.body.user)
	.del()
	.then(()=>{
		knex('communityList')
		.where('Id', req.params.id)
		.update({
			invited: knex.raw('invited - 1')
		})
		.then(()=>{
			res.send('done')
		})
	})
})

router.get('/editCommunity/:id',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((user)=>{
		knex('communityList')
		.where('Id', req.params.id)
		.then((community)=>{
			res.render('editCommunity',{
				data: user[0], 
				community: community[0], 
				join: true,
				request: false,
			})
		})
	})	
})

router.post('/editCommunity/:id',isAuthenticated(),(req,res)=>{
	knex('communityList')
	.where('Id', req.params.id)
	.update({
		CommunityName: req.body.CommunityName,
		MembershipRule: req.body.MembershipRule,
		Discription: req.body.Discription.replace(/<[^>]*>/g, '')
	})
	.then(()=>{
		res.redirect(`/community/communityprofile/${req.params.id}`)
	})
})

router.post('/acceptReq/:id',isAuthenticated(),(req,res)=>{
	knex('communityMembers')
	.where('Id', req.params.id)
	.andWhere('UserId', req.body.user)
	.update({
		Accepted: 'True'
	})
	.then(()=>{
		knex('communityList')
		.where('Id', req.params.id)
		.update({
			TotalReq: knex.raw('TotalReq - 1'),
			members: knex.raw('members + 1')
		})
		.then(()=>{
			res.send('done')
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