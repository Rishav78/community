var text = document.querySelector('.textBox')
var showtags = document.querySelector('.showTags')
console.log('dfghj')
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
		}
		req.open('POST','tags')
		req.send(text.value)
	}
}

showtags.onclick = ()=>{
	window.location = '/tagslist'
}