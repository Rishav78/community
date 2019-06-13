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
			req.responseText == 'exist' ? document.querySelector('.exist').classList.add('animate') : document.querySelector('.added').classList.add('animate')
		}
		req.open('POST','tags')
		req.setRequestHeader("Content-Type", "application/json");
		req.send(JSON.stringify({
			tag: text.value
		}))
	}
}

alert.forEach((value)=>{
	value.addEventListener('animationend',()=>{
		document.querySelector('.animate').classList.remove('animate')
	})
})


showtags.onclick = ()=>{
	window.location = '/tags/tagslist'
}