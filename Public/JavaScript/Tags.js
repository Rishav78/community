var text = document.querySelector('.textBox')
var showtags = document.querySelector('.showTags')
var alert = document.querySelectorAll('.alert')
document.querySelector('.Submit').onclick = saveTag
text.onkeydown = (e)=>{
	if(e.keyCode == 13){
		saveTag()
	}
}

function saveTag(){
	if(text.value){
		var req = new XMLHttpRequest()
		req.onload = ()=>{
			text.value = ''
			if(req.responseText == 'exist'){
				console.log('fghjk')
				document.querySelector('.exist').classList.add('animate')
			}else{
				document.querySelector('.added').classList.add('animate')
			}
		}
		req.open('POST','tags')
		req.send(text.value)
	}
}

alert.forEach((value)=>{
	value.addEventListener('animationend',()=>{
		document.querySelector('.animate').classList.remove('animate')
	})
})


showtags.onclick = ()=>{
	window.location = '/tagslist'
}