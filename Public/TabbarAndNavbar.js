var tabbar = document.querySelector('.tabBar')
var profile = document.querySelector('.profile')
var open = document.querySelector('.open')
var hidden = document.querySelectorAll('.hidden')
var item = document.querySelectorAll('.item')
var icon = document.querySelector('.icon')
var initial;
item.forEach((value)=>{
	value.onclick = ()=>{
		for(var i=0;i<item.length;i++){
			item[i].style.backgroundColor = '#1a1a1a'
			item[i].style.color = 'gray'
		}
		value.style.backgroundColor = 'skyblue'
		value.style.color = 'white'
	}
	value.style.color = 'gray'
})

function show(){
	if(tabbar.style.width == '300px'){
		tabbar.style.width =initial
	}else{
		// profile.style.width = '80%'
		initial = tabbar.style.width
		tabbar.style.width = '300px'
	}
}
icon.onclick = show;
open.onclick = show;


document.querySelector('#home').onclick = ()=>{
	window.location = '/home'
}
document.querySelector('#addUser').onclick = ()=>{
	window.location = '/adduser'
}
document.querySelector('#showUsers').onclick = ()=>{
	window.location = '/showusers'
}
document.querySelector('#tags').onclick = ()=>{
	window.location = '/tags'
}
document.querySelector('#changePassword').onclick = ()=>{
	window.location = '/changePassword'
}