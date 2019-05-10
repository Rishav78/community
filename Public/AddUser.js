var nam = document.querySelector('#name')
var email = document.querySelector('#email')
var password = document.querySelector('#Password')
var phone = document.querySelector('#phone')
var city = document.querySelector('#city')
var role = document.querySelector('#role')

// document.querySelector('form').onsubmit = (event)=>{
// 	console.log('fghjk')
// 	var isValidEmail = /^\w+(\.\w+)*@[a-zA-Z]+(\.[a-zA-Z]+)*\.[a-zA-Z]+$/
// 	var isvalidPhoneNo = /\d{10}/
// 	if(!(isValidEmail.test(email.value) && isvalidPhoneNo.test(phone.value) && validPassword(password.value))){
// 		console.log('nope')
// 		event.preventDefault()
// 	}
// 	console.log('gnm,')
// }

function validPassword(password){
	var isValidPassword1 = /[A-Z]+/
	var isValidPassword2 = /[a-z]+/
	var isValidPassword3 = /[1-9]+/
	var isValidPassword4 = /[!@#$&%_-]+/
	return isValidPassword1.test(password) && isValidPassword2.test(password) && isValidPassword3.test(password) && isValidPassword4.test(password)
}

// function add(){
// 	var data = {
// 		name : nam.value,
// 		email : email.value,
// 		password : password.value,
// 		phone : phone.value,
// 		city : city.value,
// 		role : role.value
// 	}
// 	var req = new XMLHttpRequest()
// 	req.onload = ()=>{
// 		if(req.responseText == 'User Added'){
// 			document.querySelectorAll('input').forEach((value)=>{
// 				value.value = ''
// 			})
// 			document.querySelector('.added').style.display = 'inline-block'
// 		}else{

// 		}
// 	}
// 	console.log(data)
// 	req.open('POST','adduser')
// 	req.send(JSON.stringify(data))
// }

document.querySelector('.close').onclick = ()=>{
	document.querySelector('.added').style.display = 'none'
}
