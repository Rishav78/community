
var refresh = document.querySelector('.refresh')
var close = document.querySelector('#close')
var searchbox = document.querySelector('#number')
var search = document.querySelector('#search')
var numberOfPage = 0
var activatedIndex = 0
var rows = []

function pagination(){
	var btn = document.querySelectorAll('.pagebutton')
	btn.forEach((value)=>{
		console.log(value)
		document.querySelector('.pagination').removeChild(value)
	})
	var prev = document.createElement('button')
	prev.className = 'pagebutton'
	prev.innerHTML = 'prev'
	prev.id = 'prev'
	prev.setAttribute('onclick','prev()')
	document.querySelector('.pagination').appendChild(prev)
	for(let i=0;i<=numberOfPage;i++){
		var x = document.createElement('button')
		x.className = 'pagebutton'
		x.id = 'pagebutton' + i
		x.innerHTML = i+1
		x.setAttribute('onclick',`paginationButton(${i})`)
		document.querySelector('.pagination').appendChild(x)
	}
	var next = document.createElement('button')
	next.className = 'pagebutton'
	next.innerHTML = 'next'
	next.id = 'next'
	next.setAttribute('onclick','next()')
	document.querySelector('.pagination').appendChild(next)
	paginationButton(0)
}

function next(){
	paginationButton(activatedIndex+1)
}

function prev(){
	paginationButton(activatedIndex-1)
}

function paginationButton(i){
	activatedIndex = i
	if(i<=0){
		document.querySelector('#prev').setAttribute('disabled','true')
		document.querySelector('#prev').style.cursor = 'not-allowed';
	}else{
		document.querySelector('#prev').removeAttribute('disabled')
		document.querySelector('#prev').style.cursor = 'pointer';
	}
	if(i+1>numberOfPage){
		document.querySelector('#next').setAttribute('disabled','true')
		document.querySelector('#next').style.cursor = 'not-allowed';
	}else{
		document.querySelector('#next').removeAttribute('disabled')
		document.querySelector('#next').style.cursor = 'pointer';
	}
	var users = document.querySelectorAll('.USER')
	users.forEach((value)=>{
		document.querySelector('tbody').removeChild(value)
	})
	var limit  = i*parseInt(searchbox.value)
	for(var k=limit;k<=(limit + parseInt(searchbox.value)) && k<rows.length;k++){
		document.querySelector('tbody').appendChild(rows[k])
	}
	if(document.querySelectorAll('.USER').length==0 || (numberOfPage)*parseInt(searchbox.value)>=rows.length){
		numberOfPage--
		pagination()
	}
}

function del(e){
	var value = e.target
	var req = new XMLHttpRequest()
	var user = value.parentNode.parentNode.parentNode
	req.onload = ()=>{
		rows = rows.filter((value)=>{
			return value.firstChild.textContent.trim() != user.firstChild.textContent.trim()
		})
		paginationButton(activatedIndex)
	}
	req.open('POST','deletetag')
	// console.log(user.firstChild.textContent.trim())
	req.send(user.firstChild.textContent.trim())
}

search.onkeyup = updateData
refresh.onclick = updateData
searchbox.onchange = updateData
window.onload = updateData

function updateData(){
	var j=0
	numberOfPage = 0
	rows = []
	var obj = {
		number : searchbox.value,
		search : search.value
	}
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		var users = document.querySelectorAll('.USER')
		users.forEach((value)=>{
			document.querySelector('tbody').removeChild(value)
		})
		users = JSON.parse(req.responseText)
		users.forEach((value)=>{
			if(j>=parseInt(searchbox.value)){
				numberOfPage++;
				j=0;
			}
			var tr = document.createElement('tr')
			tr.className = 'USER'
			tr.classList.add(numberOfPage)
			var td1 = document.createElement('td')
			td1.className = 'Username'
			td1.innerHTML = value.name
			td1.style.fontWeight = 'bold'
			tr.appendChild(td1)
			var td2 = document.createElement('td')
			td2.className = 'Phone'
			td2.innerHTML = value.CreatedBy
			tr.appendChild(td2)
			var td3 = document.createElement('td')
			td3.className = 'City'
			td3.innerHTML = value.CreationDate
			tr.appendChild(td3)
			var td4 = document.createElement('td')
			td4.className = 'Action'
			td4.innerHTML = '<div style="min-width: 100px;"><i onclick="del(event)" class="fa fa-trash-o icon"></i></div>'
			tr.appendChild(td4)
			rows.push(tr)
			j++;
		})
		pagination()
	}
	req.open('POST','/tags/tagslistdata')
	req.send(search.value)
}