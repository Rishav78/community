var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var path = require('path')
var multer = require('multer')
var striptags = require('striptags')
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
router.post('/updateProfilePic',(req,res)=>{
	upload(req,res,err=>{
		if(err) throw err;
		res.redirect('/profile')
	})
})

router.get('/communityList',isAuthenticated(),(req,res)=>{
	con.query('select Image, Role, Name from Users',(err,result)=>{
		return res.render('communityList',{data: result[0]})
	})
})

router.post('/communityList',isAuthenticated(),(req,res)=>{
	var data = req.body
	con.query('select * from communityList',(err,result)=>{
		if(err) throw err;
		if(data.roleFilter!='All'){
			result = result.filter((value)=>{
				return value.Role === data.roleFilter
			})
		}
		if(data.search.value){
			result = result.filter((value)=>{
				return value.CommunityName.includes(data.search.value)
			})
		}
		var record = result.filter((value,index)=>{
			if(index >= data.start && data.length>=0){
				data.length--
				return true;
			}
		})
		res.send({'recordsTotal': 1, 'recordsFiltered' : 1, data: result});
	})
})

router.get('/communitypanel',isAuthenticated(),(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		con.query(`select * from communityList join communityMembers on communityList.Id = communityMembers.Id where communityMembers.User = '${req.user}' and communityMembers.Accepted = 'True'`,(err,community)=>{
			return res.render('communitypanel',{data: result[0],community: community})
		})
	})
})

router.get('/AddCommunity',(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err;
		res.render('CreateCommunity',{created: false, data: result[0]})
	})
})

router.post('/AddCommunity/create',(req,res)=>{
	console.log(striptags(req.body.Discription))
	con.query(`select * from Users where Email = '${req.user}'`,(err,user)=>{
		if(err) throw err;
		var id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
		con.query(`insert into communityList values('${id}', '${req.body.CommunityName}', '${req.body.MembershipRule}', 'Not Added', '${req.user}', '${req.body.Discription.replace(/<[^>]*>/g, '')}', SYSDATE(), 0, 0, 0, 0, 'defaultCommunity.jpg')`,(err,result)=>{
			if(err) throw err;
			con.query(`insert into communityMembers values('${id}', '${req.user}', 'True', 'Owner')`,(err,result)=>{
				if(err) throw err;
				res.render('CreateCommunity',{created: true, data: user[0]})
			})
		});
	})
})

router.post('/updateProfilePic',(req,res)=>{
	upload(req,res,err=>{
		if(err) throw err;
		res.redirect('/profile')
	})
})

router.get('/manageCommunity/:id',(req,res)=>{
	console.log(req.params.id)
	con.query(`select * from Users where Email = '${req.user}'`,(err,user)=>{
		if(err) throw err;
		con.query(`select * from communityList where Id = '${req.params.id}'`,(err,community)=>{
			console.log(community[0])
			return res.render('manageCommunity',{data: user[0], community: community[0],visible: true, join: false})
		})
	})
})

router.post('/manageCommunity/:id',(req,res)=>{
	con.query(`select * from communityList where Id = '${req.params.id}'`,(err,result)=>{
		if(err) throw err;
		res.json(result)
	})
})

router.post('/promot',(req,res)=>{
	var data = ''
	req.on('data',chunk=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		con.query(`update CommunityMembers set Type = 'Admin' where User = '${data.user}' and Id = ${data.communityId}`,(err,result)=>{
			if(err) throw err;
			con.query(`update communityList set User = User - 1, Admin = Admin + 1 where Id = ${data.communityId}`,(err,result)=>{
				if(err) throw err;
				res.send('done')
			})
		})
	})
})

router.post('/CommunityMembers',(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		console.log(data)
		con.query(`select * from CommunityMembers join users where CommunityMembers.User = users.Email and CommunityMembers.Id = '${data}' and CommunityMembers.Accepted = 'True' and CommunityMembers.Type = 'User'`,(err,result)=>{
			if(err) throw err;
			console.log(result)
			res.json(result)
		})
	})
})

router.post('/CommunitysAdmins',(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		console.log(data)
		con.query(`select * from CommunityMembers join users where CommunityMembers.User = users.Email and CommunityMembers.Id = '${data}' and CommunityMembers.Accepted = 'True' and CommunityMembers.Type != 'User'`,(err,result)=>{
			if(err) throw err;
			console.log(result)
			res.json(result)
		})
	})
})

router.post('/Demote',(req,res)=>{
	var data = ''
	req.on('data',chunk=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		con.query(`update CommunityMembers set Type = 'User' where User = '${data.user}' and Id = ${data.communityId}`,(err,result)=>{
			if(err) throw err;
			con.query(`update communityList set User = User + 1, Admin = Admin - 1 where Id = ${data.communityId}`,(err,result)=>{
				if(err) throw err;
				res.send('done')
			})
		})
	})
})

router.post('/deleteMember',(req,res)=>{
	var data = ''
	req.on('data',chunk=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		con.query(`delete from CommunityMembers where User = '${data.user}' and Id = '${data.communityId}'`,(err,result)=>{
			if(err) throw err;
			con.query(`update communityList set Members = Members - 1, ${data.Type} = ${data.Type} - 1 where Id = '${data.communityId}'`,(err,result)=>{
				if(err) throw err;
				res.send('done')
			})
		})
	})
})

router.get('/list',(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,user)=>{
		con.query(`select * from communityList where Id not in (select Id from CommunityMembers where User = '${req.user}')`,(err,community)=>{
			res.render('joinCommunity',{data: user[0]})
		})
	})
})

router.post('/list',(req,res)=>{
	var data = ''
	req.on('data',chunk=>{
		data += chunk
	})
	req.on('end',()=>{
		if(data){
			con.query(`select * from communityList where Id not in (select Id from CommunityMembers where User = '${req.user}') and instr(CommunityName,'${data}')`,(err,community)=>{
				return res.json(community)
			})
		}else{
			con.query(`select * from communityList where Id not in (select Id from CommunityMembers where User = '${req.user}')`,(err,community)=>{
				return res.json(community)
			})
		}
	})
})

router.get('/joinCommunity/:id',(req,res)=>{
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

router.get('/communitymembers/:id',(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,user)=>{
		con.query(`select * from communityList where Id = '${req.params.id}'`,(err,community)=>{
			con.query(`select * from users join CommunityMembers on users.Email = communityMembers.User where communityMembers.Id = '${req.params.id}'`,(err,members)=>{
				console.log(community)
				res.render('communityMembers',{data: user[0], community: community[0], members: members, visible: false, join: false})
			})
		})
	})
})

router.get('/invite/:id',(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,user)=>{
		if(err) throw err;
		con.query(`select * from communityList where Id = '${req.params.id}'`,(err,community)=>{
			res.render('inviteUsers',{data: user[0], community: community[0], visible: true, join: true})
		})
	})
})

router.post('/inviteUserList/:id',(req,res)=>{
	var data = ''
	req.on('data',chunk=>{
		data += chunk
	})
	req.on('end',()=>{
		data = JSON.parse(data)
		con.query(`select * from Users where Email not in (select User from CommunityMembers where Id = '${req.params.id}') and Email not in (select User from InvitedUsers where Id = '${req.params.id}') and instr(Name, '${data.search}')`,(err,result)=>{
			if(err) throw err;
			res.json(result)
		})
	})
})

router.post('/invite/:id',(req,res)=>{
	data = ''
	req.on('data', chunk=>{
		data += chunk
	})
	req.on('end', ()=>{
		data = JSON.parse(data)
		con.query(`insert into invitedUsers values('${req.params.id}', '${data.id}')`,(err,result)=>{
			if(err) throw err;
			res.send('done');
		})
	})
})

router.get('/communityProfile/:id',(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,user)=>{
		con.query(`select * from communityList  where Id = '${req.params.id}'`,(err,community)=>{
			con.query(`select * from communityMembers join Users on communityMembers.User = Users.Email where communityMembers.Id = '${req.params.id}'`,(err,joined)=>{
				var join = joined.filter((value)=>{
					console.log(value.Email, req.user)
					return value.Email == req.user
				})
				var owner = joined.filter((value) => {
					console.log(value.User,req.user,value.Type)
					return (value.User == req.user) && (value.Type == 'Owner')
				})
				res.render('CommunityProfile',
				{
					data: user[0], 
					community: community[0], 
					join: join, 
					visible: true,
					members: joined,
					owner: owner
				})
			})
		})
	})	
})

router.get('/leaveCommunity/:id',(req,res)=>{
	con.query(`select * from communityMembers where Id = '${req.params.id}' and User = '${req.user}'`,(err,member)=>{
		if(err) throw err;
		con.query(`delete from communityMembers where Id = '${req.params.id}' and User = '${req.user}'`,(err,result)=>{
			if(err) throw err;
			console.log(member[0].Type)
			con.query(`update communityList set Members = Members - 1, ${member[0].Type} = ${member[0].Type} - 1 where Id = '${req.params.id}'`,(err,result)=>{
				if(err) throw err;
				res.redirect(`/community/communityProfile/${req.params.id}`)
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