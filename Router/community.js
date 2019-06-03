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
	con.query(`select Image, Role, Name from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err
		console.log(result)
		if(result[0].Role == 'User'){
			con.query(`select * from communityList join communityMembers on communityList.Id = communityMembers.Id where communityMembers.User = '${req.user}' and communityMembers.Accepted = 'True'`,(err,community)=>{
				return res.render('communitypanel_user',{data: result[0],community: community, visible: false})
			})
		}else{
			con.query('select * from communityList',(err,community)=>{
				return res.render('communitypanel_superadmin_user',{data: result[0],community: community, visible: true})
			})
		}
	})
})

router.get('/AddCommunity',(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
		if(err) throw err;
		if(result[0].Role == 'User'){
			res.render('CreateCommunity_user',{created: false, data: result[0]})
		}else{
			res.render('CreateCommunity_admin',{created: false, data: result[0]})
		}
	})
})

router.post('/AddCommunity/create',(req,res)=>{
	console.log(striptags(req.body.Discription))
	con.query(`select Role from Users where Email = '${req.user}'`,(err,role)=>{
		if(err) throw err;
		con.query('select max(Id) as Id from communityList',(err,result)=>{
			con.query(`insert into communityList values(${result[0].Id+1}, '${req.body.CommunityName}', '${req.body.MembershipRule}', 'Not Added', '${role[0].Role}', '${req.body.Discription.replace(/<[^>]*>/g, '')}', SYSDATE(), 0, 0, 0, 0, 'defaultCommunity.jpg')`,(err,result)=>{
				if(err) throw err;
				con.query(`select * from Users where Email = '${req.user}'`,(err,result)=>{
					if(result[0].Role == 'User'){
						res.render('CreateCommunity_user',{created: true, data: result[0]})
					}else{
						res.render('CreateCommunity_admin',{created: true, data: result[0]})
					}
				})
			});
		})
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
	if(!isNaN(req.params.id)){
		con.query(`select * from Users where Email = '${req.user}'`,(err,user)=>{
			if(err) throw err;
			con.query(`select * from communityList where Id = ${req.params.id}`,(err,community)=>{
				console.log(community[0])
				return res.render('manageCommunity',{data: user[0], community: community[0],visible: true})
			})
		})
	}else{
		res.send('done')
	}
})

router.post('/manageCommunity/:id',(req,res)=>{
	console.log(req.params.id)
	if(!isNaN(req.params.id)){
		con.query(`select * from communityList where Id = ${req.params.id}`,(err,result)=>{
			if(err) throw err;
			res.json(result)
		})
	}else{
		res.send('done')
	}
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
			con.query(`update communityList set Users = Users - 1, Admin = Admin + 1 where Id = ${data.communityId}`,(err,result)=>{
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
		con.query(`select * from CommunityMembers join users where CommunityMembers.User = users.Email and CommunityMembers.Id = ${data} and CommunityMembers.Accepted = 'True' and CommunityMembers.Type = 'User'`,(err,result)=>{
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
		con.query(`select * from CommunityMembers join users where CommunityMembers.User = users.Email and CommunityMembers.Id = ${data} and CommunityMembers.Accepted = 'True' and CommunityMembers.Type != 'User'`,(err,result)=>{
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
			con.query(`update communityList set Users = Users + 1, Admin = Admin - 1 where Id = ${data.communityId}`,(err,result)=>{
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
		con.query(`delete from CommunityMembers where User = '${data.user}' and Id = ${data.communityId}`,(err,result)=>{
			if(err) throw err;
			con.query(`update communityList set Members = Members - 1, ${data.Type} = ${data.Type} - 1 where Id = ${data.communityId}`,(err,result)=>{
				if(err) throw err;
				res.send('done')
			})
		})
	})
})

router.get('/list',(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,user)=>{
		con.query(`select * from communityList where Id not in (select Id from CommunityMembers where User = '${req.user}')`,(err,community)=>{
			if(user[0].Role =='User'){
				res.render('joinCommunity_user',{data: user[0]})
			}else{
				res.render('joinCommunity',{data: user[0]})
			}
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

router.post('/joinCommunity',(req,res)=>{
	var data = ''
	req.on('data',chunk=>{
		data += chunk
	})
	req.on('end',()=>{
		console.log(data)
		con.query(`select MembershipRule from communityList where Id = ${data}`,(err,result)=>{
			if(err) throw err
			if(result[0].MembershipRule == 'Direct'){
				con.query(`insert into CommunityMembers values(${data}, '${req.user}', 'True', 'User')`,(err,result)=>{
					if(err) throw err
					con.query(`update communityList set Members = Members + 1, Users = Users + 1 where Id = ${data}`,(err,result)=>{
						if(err) throw err;
					})
				})
			}else{
				con.query(`insert into CommunityMembers values(${data}, '${req.user}', 'False','User')`,(err,result)=>{
					if(err) throw err
					con.query(`update communityList set TotalReq = TotalReq + 1 where Id = ${data}`,(err,result)=>{
						if(err) throw err;
					})
				})
			}
			res.send('done');
		})
	})
})

router.get('/communitymembers/:id',(req,res)=>{
	con.query(`select * from Users where Email = '${req.user}'`,(err,user)=>{
		con.query(`select * from communityList where Id = ${req.params.id}`,(err,community)=>{
			con.query(`select * from users join CommunityMembers on users.Email = communityMembers.User where communityMembers.Id = ${req.params.id}`,(err,members)=>{
				console.log(community)
				res.render('communityMembers',{data: user[0], community: community[0], members: members, visible: false})
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