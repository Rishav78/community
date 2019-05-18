
var refresh = document.querySelector('.refresh')
var cover = document.querySelector('.cover')
var popup = document.querySelector('.edit')
var close = document.querySelector('#close')
var update = document.querySelector('#Update')
var PCuser = document.querySelector('.PCusers')
var userType = document.querySelector('.userType')
var child;
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

// function del(e){
// 	var value = e.target
// 	var user = value.parentNode.parentNode.parentNode
// 	var req = new XMLHttpRequest()
// 	req.onload = ()=>{
// 		console.log('deleted')
// 	}
// 	req.open('POST','deleteuser')
// 	req.send(user.firstChild.textContent.trim())
// }

function Activate(event){
	var target = event.target
	var user = event.target.parentNode.parentNode.parentNode.firstChild.textContent.trim()
	var data = {
		user : user,
		state : 'True'
	}
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		event.target.classList.remove('fa-check-circle')
		event.target.classList.add('fa-times-circle')
		event.target.setAttribute('onclick','Deactivate(event)')
	}
	req.open('POST','/Activation')
	req.send(JSON.stringify(data))
}

function Deactivate(event){
	var target = event.target
	var user = event.target.parentNode.parentNode.parentNode.firstChild.textContent.trim()
	var data = {
		user : user,
		state : 'False'
	}
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		event.target.classList.remove('fa-times-circle')
		event.target.classList.add('fa-check-circle')
		event.target.setAttribute('onclick','Activate(event)')
	}
	req.open('POST','/Activation')
	req.send(JSON.stringify(data))
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
refresh.onclick = updateData
PCuser.onchange = updateData
userType.onchange = updateData

function updateData(){
	console.log('u')
	var j=0
	numberOfPage = 0
	rows = []
	var obj = {
		status : PCuser.value,
		userType : userType.value,
	}
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		var users = document.querySelectorAll('.USER')
		// console.log(users)
		users.forEach((value)=>{
			document.querySelector('tbody').removeChild(value)
		})
		// console.log(users)
		users = JSON.parse(req.responseText)
		console.log(users)
		users.forEach((value)=>{
			var tr = document.createElement('tr')
			tr.className = 'USER'
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
				if(value.AcivationState == 'True'){
					td6.innerHTML = '<div style="min-width: 100px;"><i class="fa fa-envelope-o icon"></i><i onclick="popUp(event)" class="fa fa-edit icon"></i><i onclick="Deactivate(event)" class="fa fa-times-circle icon"></i></div>'
				}else{
					td6.innerHTML = '<div style="min-width: 100px;"><i class="fa fa-envelope-o icon"></i><i onclick="popUp(event)" class="fa fa-edit icon"></i><i onclick="Activate(event)" class="fa fa-check-circle icon"></i></div>'
				}
			}
			tr.appendChild(td6)
			document.querySelector('tbody').appendChild(tr)
		})
		var table = $('#myTable').DataTable();
		$('#myTable').on("click", ".fa-close", function(){
		  console.log($(this).parent());
		  table.row($(this).parents('tr')).remove().draw(false);
		});
	}
	req.open('POST','/admin/userlist')
	req.send(JSON.stringify(obj))
}
window.onload = updateData