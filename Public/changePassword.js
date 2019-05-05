var old = document.querySelector('#old')
var New = document.querySelector('#new')

document.querySelector('.submit').onclick = ()=>{
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		console.log(req.response)
	}
	req.open('POST','changePassword')
	req.send(JSON.stringify({
		old : old.value,
		New : New.value
	}))
}