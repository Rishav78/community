document.querySelector('#switchUser').onclick = (event)=>{
	event.preventDefault()
	// let div2 = document.querySelector('.switchPOPUP')
	let div1 = document.createElement('div')
	let div2 = document.createElement('div')
	div1.classList.add('switchCover')
	div2.classList.add('switchPOPUP')
	div2.classList.add('leftToRight')
	console.log(event.clientY)
	div2.style.top = event.clientY + 'px'
	div2.style.left = event.clientX + 'px'
	div2.innerHTML = '<h1>Switch As User</h1><span>Do you really want switch state...</span><div><a href="/communityPanel" id="switch">Yes</a><a id="exit">No</a></div>'
	document.querySelector('body').appendChild(div1)
	document.querySelector('body').appendChild(div2)

	document.querySelector('.switchPOPUP').addEventListener("animationend", (e) => {
    	document.querySelector('.switchPOPUP').classList.remove("apply-shake");
	});
	document.querySelector('#exit').onclick = ()=>{
		console.log('dfghj')
		document.querySelector('body').removeChild(div1)
		document.querySelector('body').removeChild(div2)
		
	}
	document.querySelector('.switchCover').onclick = ()=>{
		document.querySelector('.switchPOPUP').classList.add('apply-shake')
	}
}