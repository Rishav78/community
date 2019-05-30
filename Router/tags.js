var express = require('express')
var router = express.Router()
var mysql = require('mysql')

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

router.get('/',isAuthenticated(),(req,res)=>{
	con.query('select Image, Role, Name from Users',(err,result)=>{
		return res.render('Tags',{data: result[0]})
	})
})

router.post('/',isAuthenticated(),(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		con.query(`select * from tags where name = '${data}'`,(err,result)=>{
			if(err) throw err
			if(result.length==0){
				con.query(`insert into tags values(${Math.random()*Math.pow(10,8)}, '${data}', '${req.user}', date '12/12/12')`,(err,result)=>{
					if(err) throw err
					return res.send('added')
				})
			}else{
				return res.send('exist')
			}
		})
	})
})
router.get('/tagslist',isAuthenticated(),(req,res)=>{
	con.query('select Image, Role, Name from Users',(err,result)=>{
		return res.render('taglist2',{data: result[0]})
	})
})
router.post('/tagslistdata',isAuthenticated(),(req,res)=>{
	var data = ''
	req.on('data',(chunk)=>{
		data += chunk
	})
	req.on('end',()=>{
		con.query(`select * from tags`,(err,result)=>{
			if (err) throw err
			return res.send(result)
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