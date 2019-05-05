var cover = document.querySelector('.logoutCover')
var confirm = document.querySelector('.confirmques') 
document.querySelector('#logout').onclick = ()=>{
	cover.style.zIndex = '10'
	cover.style.opacity = '1'
	confirm.style.left = '50%'
	confirm.style.opacity = '1'
	confirm.style.bottom = '25%'
}
cover.onclick = ()=>{
	cover.style.zIndex = '-1'
	cover.style.opacity = '0'
	confirm.style.left = '0'
	confirm.style.opacity = '0'
	confirm.style.bottom = '0'
}
document.querySelector('#yes').onclick = ()=>{
	window.location = '/Logout'
}