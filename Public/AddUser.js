var nam = document.querySelector('#name')
var email = document.querySelector('#email')
var password = document.querySelector('#Password')
var phone = document.querySelector('#phone')
var city = document.querySelector('#city')
var role = document.querySelector('#role')

function add(){
	console.log(nam.value)
	var data = {
		name : nam.value,
		email : email.value,
		password : password.value,
		phone : phone.value,
		city : city.value,
		role : role.value
	}
	var req = new XMLHttpRequest()
	req.onload = {
	}
	console.log(data)
	req.open('POST','adduser')
	req.send(JSON.stringify(data))
}