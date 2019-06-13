var express = require('express')
var router = express.Router()
var knex = require('./mysql.js')

router.get('/',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((result)=>{
		return res.render('Tags',{data: result[0]})
	})
})

router.post('/',isAuthenticated(),(req,res)=>{
	knex('tags')
	.where('name', req.body.tag)
	.then(function(result){
		if(result.length==0){
			var id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
			knex('tags')
			.insert({
				Id: id,
				name: req.body.tag,
				CreatedBy: req.user,
				CreationDate: knex.raw('SYSDATE()')
			})
			.then(()=>{
				return res.send('added')
			})
		}else{
			return res.send('exist')
		}
	})
})
router.get('/tagslist',isAuthenticated(),(req,res)=>{
	knex('Users')
	.where('Id', req.user)
	.then((result)=>{
		return res.render('taglist',{data: result[0]})
	})
})

router.post('/tagslist',isAuthenticated(),(req,res)=>{
	knex('tags')
	.where(knex.raw(`INSTR(name, '${req.body.search.value}')`))
	.then(function(result){
		var filtered = result.filter((value, index)=>{
    		return index>=req.body.start && req.body.length-->0
		})
		knex('tags')
		.count('Id as Total')
		.then((total)=>{
			return res.json({'recordsTotal': total[0].Total, 'recordsFiltered' : result.length, data: filtered})
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