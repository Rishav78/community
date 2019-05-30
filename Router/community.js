var express = require('express')
var router = express.Router()
var mysql = require('mysql')
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
		if(result[0].Role == 'User'){
			return res.render('communitypanel_user',{data: result[0]})
		}else{
			return res.render('communitypanel_superadmin_user',{data: result[0]})
		}
	})
})

router.get('/AddCommunity',(req,res)=>{
	res.render('CreateCommunity',{created: false})
})

router.post('/AddCommunity/create',(req,res)=>{
	con.query(`select Role from Users where Email = '${req.user}'`,(err,role)=>{
		if(err) throw err;
		con.query(`insert into communityList(CommunityName, Discription, MembershipRule, CommunityLocation, CreateDate, CommunityOwner) values('${req.body.CommunityName}', '${req.body.Discription}', '${req.body.MembershipRule}', 'Not Added', SYSDATE(), '${role[0].Role}')`,(err,result)=>{
			if(err) throw err;
			res.render('CreateCommunity',{created: true})
		});
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