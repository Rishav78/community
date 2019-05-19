var email = document.querySelector('.Email')
var name = document.querySelector('.name')
var dob = document.querySelector('.dob')
var gender = document.querySelector('.gender')
var phone = document.querySelector('.phoneno')
var city = document.querySelector('.city')
var interests = document.querySelector('.interests')
var userdetail = document.querySelector('.userdetail')
var expectation = document.querySelector('.expectations')
$('#datepicker').datepicker({
    'format' : 'yyyy-mm-dd',
    'autoclose' : true
});

// document.querySelector('form').onsubmit = (event)=>{
// 	event.preventDefault()
// 	var data = {
// 		name : document.querySelector('.name').value,
// 		dob : dob.value,
// 		gender : gender.value,
// 		phoneno : phone.value,
// 		city : city.value,
// 		interests : interests.value,
// 		userdetail : userdetail.value,
// 		expectations : expectation.value
// 	}
// 	var req = new XMLHttpRequest()
// 	req.onload = ()=>{
// 		window.location = '/profile'
// 	}
// 	req.open('POST','/updateInfo')
// 	req.send(JSON.stringify(data))
// }

window.onload = ()=>{
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		var data = JSON.parse(req.responseText)
		email.value = data.Email
		document.querySelector('.name').value = data.Name
		dob.value = data.DOB
		gender.value = data.Gender
		phone.value = data.Phno
		city.value = data.City
		userdetail.value = data.About
		expectation.value = data.Expectations
	}
	req.open('GET','/getInformation')
	req.send()
}

function upload(){
	document.querySelector('input[type="file"]').click()
}
