var bar = document.querySelector('.bar')
var tabBar = document.querySelector('.tabBar')
function expand(){
    if(tabBar.style.width == '250px'){
        tabBar.style.width = '50px'
    }else{
        tabBar.style.width = '250px'
    }
}
bar.onclick = (event)=>{
    event.preventDefault()
    expand()
}