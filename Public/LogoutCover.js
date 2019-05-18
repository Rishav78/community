var cover = document.querySelector('.logoutCover')
var confirm = document.querySelector('.confirmques') 
document.querySelector('#logout').onclick = ()=>{
	cover.style.zIndex = '10'
	cover.style.opacity = '1'
	confirm.style.left = '50%'
	confirm.style.opacity = '1'
	confirm.style.bottom = '50%'
}
cover.onclick = ()=>{
	document.querySelector('.confirmques').classList.add('apply-shake')
}

document.querySelector('#no').onclick = (event)=>{
	event.cancelBubble = true;
	cover.style.zIndex = '-1'
	cover.style.opacity = '0'
	confirm.style.left = '-50%'
	confirm.style.opacity = '0'
	confirm.style.bottom = '25%'
}

document.querySelector('.confirmques').addEventListener("animationend", (e) => {
    document.querySelector('.confirmques').classList.remove("apply-shake");
});



document.querySelector('#yes').onclick = (event)=>{
	event.cancelBubble = true;
	window.location = '/Logout'
}