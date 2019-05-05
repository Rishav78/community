
var refresh = document.querySelector('.refresh')
var cover = document.querySelector('.cover')
var popup = document.querySelector('.edit')
var close = document.querySelector('#close')
var update = document.querySelector('#Update')
var searchbox = document.querySelector('#number')
var PCuser = document.querySelector('.PCusers')
var userType = document.querySelector('.userType')
var search = document.querySelector('#search')
var child;
var numberOfPage = 0
var activatedIndex = 0
var rows = []
close.onclick = hidePopup
function hidePopup(){
	cover.style.zIndex = '-1'
	cover.style.opacity = '0'
	popup.style.top = '-200%'
	popup.style.opacity = '0'
}

function popUp(e){
	console.log(e)
	var value = e.target
	var users = value.parentNode.parentNode.parentNode
	child = value.parentNode.parentNode.parentNode.childNodes
	for(var i=0;i<child.length-1;i++){
		if(child[i].nodeType == 1){
			document.querySelector('#' + child[i].classList[0]).value =  (child[i].textContent).trim()
		}
	}
	cover.style.zIndex = '4'
	cover.style.opacity = '0.6'
	popup.style.opacity = '1'
	popup.style.top = '0px'
}

function pagination(){
	var btn = document.querySelectorAll('.pagebutton')
	btn.forEach((value)=>{
		console.log(value)
		document.querySelector('.pagination').removeChild(value)
	})
	var prev = document.createElement('button')
	prev.className = 'pagebutton'
	prev.innerHTML = 'Previous'
	prev.id = 'prev'
	prev.setAttribute('onclick','prev()')
	document.querySelector('.pagination').appendChild(prev)
	for(let i=0;i<=numberOfPage;i++){
		var x = document.createElement('button')
		x.className = 'pagebutton'
		x.innerHTML = i+1
		x.setAttribute('onclick',`paginationButton(${i})`)
		document.querySelector('.pagination').appendChild(x)
	}
	var next = document.createElement('button')
	next.className = 'pagebutton'
	next.innerHTML = 'Next'
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
	var user = value.parentNode.parentNode.parentNode
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		rows = rows.filter((value)=>{
			return value.firstChild.textContent.trim() != user.firstChild.textContent.trim()
		})
		paginationButton(activatedIndex)
	}
	req.open('POST','deleteuser')
	req.send(user.firstChild.textContent.trim())
}

update.onclick = ()=>{
	var data = {
		Email : document.querySelector('#Username').value,
		Phone : document.querySelector('#Phone').value,
		City : document.querySelector('#City').value,
		Status : document.querySelector('#Status').value,
		Role : document.querySelector('#Role').value,
	}
	for(var i=0;i<child.length-1;i++){
		if(child[i].nodeType == 1){
			child[i].textContent = document.querySelector('#' + child[i].classList[0]).value
		}
	}
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		hidePopup()
	}
	req.open('POST','update')
	req.send(JSON.stringify(data))
}
search.onkeyup = updateData
refresh.onclick = updateData
PCuser.onchange = updateData
userType.onchange = updateData
searchbox.onchange = updateData

function updateData(){
	var j=0
	numberOfPage = 0
	rows = []
	var obj = {
		number : searchbox.value,
		status : PCuser.value,
		userType : userType.value,
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
			tr.id = value.Id
			tr.className = 'USER'
			tr.classList.add(numberOfPage)
			var td1 = document.createElement('td')
			td1.className = 'Username'
			td1.innerHTML = value.Email
			td1.style.fontWeight = 'bold'
			tr.appendChild(td1)
			var td2 = document.createElement('td')
			td2.className = 'Phone'
			td2.innerHTML = value.Phno
			tr.appendChild(td2)
			var td3 = document.createElement('td')
			td3.className = 'City'
			td3.innerHTML = value.City
			tr.appendChild(td3)
			var td4 = document.createElement('td')
			td4.className = 'Status'
			td4.innerHTML = value.Status
			tr.appendChild(td4)
			var td5 = document.createElement('td')
			td5.className = 'Role'
			td5.innerHTML = value.Role
			tr.appendChild(td5)
			var td6 = document.createElement('td')
			td6.className = 'Action'
			if(value.Role == 'Superadmin'){
				td6.innerHTML = '<div style="min-width: 100px;"><i  class="fa fa-envelope-o icon"></i></div>'
			}else{
				td6.innerHTML = '<div style="min-width: 100px;"><i class="fa fa-envelope-o icon"></i><i onclick="popUp(event)" class="fa fa-edit icon"></i><i onclick="del(event)" class="fa fa-close icon"></i></div>'
			}
			tr.appendChild(td6)
			rows.push(tr)
			j++;
		})
		pagination()
	}
	req.open('POST','users')
	req.send(JSON.stringify(obj))
}
window.onload = updateData