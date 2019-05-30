var bar = document.querySelector('.bar')
var tabBar = document.querySelector('.tabBar')
var width;
function expand(){
    if(tabBar.style.width == '250px'){
        tabBar.style.width = width
    }else{
    	width = tabBar.style.width
        tabBar.style.width = '250px'
    }
}

bar.onclick = (event)=>{
    event.preventDefault()
    expand()
}

document.querySelectorAll('.bar').forEach((value)=>{
	value.onclick = expand
})
