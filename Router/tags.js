var express = require('express')
var router = express.Router();
const tag = require('../models/tag');

router.get('/',isAuthenticated(),(req,res)=>{
	return res.render('Tags',{data: req.user})
})

router.post('/',isAuthenticated(),(req,res)=>{
	tag
	.findOne({'name': req.body.tag})
	.then(function(result){
		if(!result){
			const newtag = new tag({
					name: req.body.tag,
					CreatedBy: req.user.Name,
			});
			newtag.save(() => res.send('added'))
		}else{
			return res.send('exist')
		}
	})
})
router.get('/tagslist',isAuthenticated(),(req,res)=>{
	return res.render('taglist',{data: req.user})
})

router.post('/tagslist',isAuthenticated(),(req,res)=>{
	const query = {};
	if(req.body.search.value)
		query.name = {$regx: new RegExp(req.body.search.value)};
	
	tag
	.find(query)
	.then(function(result){
		var filtered = result.filter((value, index)=>{
    		return index>=req.body.start && req.body.length-->0
		})
		
		tag
		.countDocuments({})
		.then((total)=>{
			return res.json({'recordsTotal': total, 'recordsFiltered' : result.length, data: filtered})
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