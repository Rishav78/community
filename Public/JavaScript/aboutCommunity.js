document.querySelector('.dropdown > i').onclick = ()=>{
	if(document.querySelector('.dropdown > ul').classList.contains('hidedropdown')){
		document.querySelector('.dropdown > ul').classList.remove('hidedropdown')
		document.querySelector('.dropdown > ul').classList.add('showdropdown')
	}else{
		document.querySelector('.dropdown > ul').classList.remove('showdropdown')
		document.querySelector('.dropdown > ul').classList.add('hidedropdown')
	}
}