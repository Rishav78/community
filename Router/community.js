var express = require('express')
var router = express.Router()
var con = require('./mysql.js')
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
	con.query('select Image, Role, Name from Users',(err,result)=>{
		return res.render('communityList',{
			data: result[0]
		})
	})
})

router.post('/communityList',isAuthenticated(),(req,res)=>{
	var array = ['CommunityName', 'MembershipRule', 'CommunityLocation', 'CommunityOwner', 'CreateDate', ]
	con.query(`select * from communityList order by ${array[req.body.order[0].column]} ${req.body.order[0].dir}`,(err,result)=>{
		if(err) throw err;
		if(req.body.roleFilter!='All'){
			result = result.filter((value)=>{
				return value.Role === req.body.roleFilter
			})
		}
		if(req.body.search.value){
			result = result.filter((value)=>{
				return value.CommunityName.includes(req.body.search.value)
			})
		}
		var record = result.filter((value,index)=>{
			if(index >= req.body.start && req.body.length>=0){
				req.body.length--
				return true;
			}
		})
		res.send({'recordsTotal': 1, 'recordsFiltered' : 1, data: result});
	})
})

router.get('/communitypanel',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Id = '${req.user}'`,(err,result)=>{
		if(err) throw err
		con.query(`select * from communityList join communityMembers on communityList.Id = communityMembers.Id where communityMembers.UserId = '${req.user}' and communityMembers.Accepted = 'True'`,(err,community)=>{
			console.log(community)
			return res.render('communitypanel',{
				data: result[0],
				community: community
			})
		})
	})
})

router.get('/AddCommunity',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Id = '${req.user}'`,(err,result)=>{
		if(err) throw err;
		res.render('CreateCommunity',{
			created: false,
			data: result[0]
		})
	})
})

router.post('/AddCommunity/create',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Id = '${req.user}'`,(err,user)=>{
		if(err) throw err;
		var id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
		con.query(`insert into communityList values('${id}', '${req.body.CommunityName}', '${req.body.MembershipRule}', 'Not Added', '${req.user}', '${req.body.Discription.replace(/<[^>]*>/g, '')}', SYSDATE(), 0, 0, 0, 0, 'defaultCommunity.jpg')`,(err,result)=>{
			if(err) throw err;
			con.query(`insert into communityMembers values('${id}', '${req.user}', 'True', 'Owner')`,(err,result)=>{
				if(err) throw err;
				res.render('CreateCommunity',{
					created: true, 
					data: user[0]
				})
			})
		});
	})
})

router.post('/updateProfilePic',isAuthenticated(),(req,res)=>{
	upload(req,res,err=>{
		if(err) throw err;
		res.redirect('/profile')
	})
})

router.get('/manageCommunity/:id',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Id = '${req.user}'`,(err,user)=>{
		if(err) throw err;
		con.query(`select * from communityList where Id = '${req.params.id}'`,(err,community)=>{
			return res.render('manageCommunity',{
				data: user[0], 
				community: community[0], 
				join: true,
				request: false
			})
		})
	})
})

router.post('/manageCommunity/:id',isAuthenticated(),(req,res)=>{
	con.query(`select * from communityList where Id = '${req.params.id}'`,(err,result)=>{
		if(err) throw err;
		res.json(result)
	})
})

router.post('/promot',isAuthenticated(),(req,res)=>{
	var data = ''
	req.on('data',chunk=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		con.query(`update CommunityMembers set Type = 'Admin' where UserId = '${data.user}' and Id = '${data.communityId}'`,(err,result)=>{
			if(err) throw err;
			con.query(`update communityList set User = User - 1 where Id = '${data.communityId}'`,(err,result)=>{
				if(err) throw err;
				res.send('done')
			})
		})
	})
})

router.post('/CommunityMembers',isAuthenticated(),(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		con.query(`select * from CommunityMembers join users where CommunityMembers.UserId = users.Id and CommunityMembers.Id = '${data}' and CommunityMembers.Accepted = 'True' and CommunityMembers.Type = 'User'`,(err,result)=>{
			if(err) throw err;
			res.json(result)
		})
	})
})

router.post('/CommunitysAdmins',isAuthenticated(),(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		con.query(`select * from CommunityMembers join users where CommunityMembers.UserId = users.Id and CommunityMembers.Id = '${data}' and CommunityMembers.Accepted = 'True' and CommunityMembers.Type != 'User'`,(err,result)=>{
			if(err) throw err;
			res.json(result)
		})
	})
})

router.post('/Demote',isAuthenticated(),(req,res)=>{
	var data = ''
	req.on('data',chunk=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		con.query(`update CommunityMembers set Type = 'User' where UserId = '${data.user}' and Id = '${data.communityId}'`,(err,result)=>{
			if(err) throw err;
			con.query(`update communityList set User = User + 1 where Id = '${data.communityId}'`,(err,result)=>{
				if(err) throw err;
				res.send('done')
			})
		})
	})
})

router.post('/delete',isAuthenticated(),(req,res)=>{
	var data = ''
	req.on('data',chunk=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		con.query(`delete from CommunityMembers where User = '${data.user}' and Id = '${data.communityId}'`,(err,result)=>{
			if(err) throw err;
			con.query(`update communityList set Members = Members - 1 where Id = '${data.communityId}'`,(err,result)=>{
				if(err) throw err;
				if(data.Type == 'User'){
					con.query(`update communityList set User = User - 1 where Id = '${data.communityId}'`,(err,result)=>{
						if(err) throw err;
						res.send('done')
					})
				}else {
					res.send('done');
				}
			})
		})
	})
})

router.get('/list',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Id = '${req.user}'`,(err,user)=>{
		// con.query(`select * from communityList where Id not in (select Id from CommunityMembers where UserId = '${req.user}')`,(err,community)=>{
			res.render('joinCommunity',{
				data: user[0]
			})
		// })
	})
})

router.post('/list',isAuthenticated(),(req,res)=>{
	var data = ''
	req.on('data',chunk=>{
		data += chunk
	})
	req.on('end',()=>{
		if(data){
			con.query(`select * from communityList where Id not in (select Id from CommunityMembers where UserId = '${req.user}') and instr(CommunityName,'${data}')`,(err,community)=>{
				return res.json(community)
			})
		}else{
			con.query(`select * from communityList where Id not in (select Id from CommunityMembers where UserId = '${req.user}')`,(err,community)=>{
				console.log(community)
				return res.json(community)
			})
		}
	})
})

router.get('/joinCommunity/:id',isAuthenticated(),(req,res)=>{
	con.query(`select MembershipRule from communityList where Id = '${req.params.id}'`,(err,result)=>{
		if(err) throw err
		if(result[0].MembershipRule == 'Direct'){
			con.query(`insert into CommunityMembers values('${req.params.id}', '${req.user}', 'True', 'User')`,(err,result)=>{
				if(err) throw err
				con.query(`update communityList set Members = Members + 1, User = User + 1 where Id = '${req.params.id}'`,(err,result)=>{
					if(err) throw err;
				})
			})
		}else{
			con.query(`insert into CommunityMembers values('${req.params.id}', '${req.user}', 'False','User')`,(err,result)=>{
				if(err) throw err
				con.query(`update communityList set TotalReq = TotalReq + 1 where Id = '${req.params.id}'`,(err,result)=>{
					if(err) throw err;
				})
			})
		}
		res.redirect(`/community/communityProfile/${req.params.id}`);
	})
})

router.get('/communitymembers/:id',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Id = '${req.user}'`,(err,user)=>{
		con.query(`select * from communityList where Id = '${req.params.id}'`,(err,community)=>{
			con.query(`select * from users join CommunityMembers on users.Id = communityMembers.UserId where communityMembers.Id = '${req.params.id}'`,(err,members)=>{
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
})

router.get('/invite/:id',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Id = '${req.user}'`,(err,user)=>{
		if(err) throw err;
		con.query(`select * from communityList where Id = '${req.params.id}'`,(err,community)=>{
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
	var data = ''
	req.on('data',chunk=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		con.query(`select * from Users where Id not in (select UserId from CommunityMembers where Id = '${req.params.id}') and Id not in (select UserId from InvitedUsers where Id = '${req.params.id}') and instr(Name, '${data.search}')`,(err,result)=>{
			if(err) throw err;
			console.log(result)
			res.json(result)
		})
	})
})

router.post('/invite/:id',isAuthenticated(),(req,res)=>{
	data = ''
	req.on('data', chunk=>{
		data += chunk
	})
	req.on('end', ()=>{
		data = JSON.parse(data)
		con.query(`insert into invitedUsers values('${req.params.id}', '${data.id}')`,(err,result)=>{
			con.query(`update communityList set Invited = Invited + 1 where Id = '${req.params.id}'`,(err,result)=>{
				if(err) throw err;
				res.send('done')
			})
		})
	})
})

router.get('/communityProfile/:id',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Id = '${req.user}'`,(err,user)=>{
		con.query(`select * from communityList  where Id = '${req.params.id}'`,(err,community)=>{
			con.query(`select * from communityMembers join Users on communityMembers.UserId = Users.Id where communityMembers.Id = '${req.params.id}'`,(err,joined)=>{
				var requested
				var join = joined.filter((value)=>{
					return value.UserId == req.user
				})
				console.log(join)
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
	con.query(`select * from communityMembers where Id = '${req.params.id}' and UserId = '${req.user}'`,(err,member)=>{
		if(err) throw err;
		con.query(`delete from communityMembers where Id = '${req.params.id}' and UserId = '${req.user}'`,(err,result)=>{
			if(err) throw err;
			console.log(member[0].Type)
			var q = `update communityList set Members = Members - 1`
			if(member[0].Type == 'User'){
				q = q + `, User = User - 1`
			}
			q = q + ` where Id = '${req.params.id}'`
			console.log(q)
			con.query(q,(err,result)=>{
				res.redirect(`/community/communityProfile/${req.params.id}`)
			})
		})
	})
})

router.get('/requests/:id',isAuthenticated(),(req,res)=>{
	con.query(`select * from communityMembers join Users on communityMembers.UserId = Users.Id where communityMembers.Id = '${req.params.id}' and Accepted = 'False'`,(err,request)=>{
		if(err) throw err;
		res.json(request)
	})
})

router.get('/invitedUsers/:id',isAuthenticated(),(req,res)=>{
	con.query(`select * from invitedUsers join Users on invitedUsers.UserId = Users.Id where invitedUsers.Id = '${req.params.id}'`,(err,request)=>{
		if(err) throw err;
		res.json(request)
	})
})

router.post('/deleteInvite/:id',isAuthenticated(),(req,res)=>{
	var data = ''
	req.on('data', chunk=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		con.query(`delete from invitedUsers where Id = '${req.params.id}' and UserId = '${data.user}'`,(err,result)=>{
			if(err) throw err;
			con.query(`update communityList set invited = invited - 1 where Id = '${req.params.id}'`,(err,result)=>{
				if(err) throw err;
				res.send('done')
			})
		})
	})
})

router.get('/editCommunity/:id',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Id = '${req.user}'`,(err,user)=>{
		con.query(`select * from communityList where Id = '${req.params.id}'`,(err,community)=>{
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
	var data = req.body
	con.query(`update communityList set CommunityName = '${req.body.CommunityName}', MembershipRule = '${req.body.MembershipRule}', Discription = '${req.body.Discription.replace(/<[^>]*>/g, '')}' where Id = '${req.params.id}'`,(err,result)=>{
		if(err) throw err;
		res.redirect(`/community/communityprofile/${req.params.id}`)
	})
})

router.post('/acceptReq/:id',isAuthenticated(),(req,res)=>{
	console.log(req.params.id)
	var data = ''
	req.on('data', chunk=>{
		data += chunk
	})
	req.on('end',()=>{
		console.log(data)
		data = JSON.parse(data)
		con.query(`update communityMembers set Accepted = 'True' where Id = '${req.params.id}' and UserId = '${data.user}'`,(err,result)=>{
			if(err) throw err;
			con.query(`update communityList set TotalReq = TotalReq - 1, Members = Members + 1, User = User + 1 where Id = '${req.params.id}'`,(err,result)=>{
				if(err) throw err;
				res.send('done')
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