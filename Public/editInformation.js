$('#datepicker').datepicker({
    'format' : 'yyyy-mm-dd',
    'autoclose' : true
});
document.querySelector('form').onsubmit = (event)=>{
	event.preventDefault()
	var data = {
		name : document.querySelector('.name').value,
		dob : document.querySelector('.dob').value,
		gender : document.querySelector('.gender').value,
		phoneno : document.querySelector('.phoneno').value,
		city : document.querySelector('.city').value,
		interests : document.querySelector('.interests').value,
		userdetail : document.querySelector('.userdetail').value,
		expectations : document.querySelector('.expectations').value
	}
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		console.log('sdfgh')
	}
	req.open('POST','/updateInfo')
	req.send(JSON.stringify(data))
}