var tabbar = document.querySelector('.tabBar')
var profile = document.querySelector('.profile')
var open = document.querySelector('.open')
var hidden = document.querySelectorAll('.hidden')
var item = document.querySelectorAll('.item')
var icon = document.querySelector('.icon')
var initial,width;
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

var bar = document.querySelector('.bar')
var tabBar = document.querySelector('.tabBar')
function expand(){
	if(tabBar.style.width == '250px'){
		tabBar.style.width = width
	}else{
		width = tabBar.style.width
		tabBar.style.width = '250px'
	}
}
// bar.onclick = (event)=>{
// 	event.preventDefault()
// 	expand()
// }
document.querySelectorAll('.bar').forEach((value)=>{
	value.onclick = expand
})
// document.querySelector('#switch').onclick = ()=>{
// 	window.location = '/communityPanel'
// }