function Deactivate(){
	if(document.querySelector('.active')){
		document.querySelector('.active').classList.remove('active')
	}
}
function RemoveUser(user){
	user.parentElement.removeChild(user)
}
function EmptyUsers(){
	document.querySelector('.users').childNodes.forEach((value) => {
		console.log(value)
	  document.querySelector('.users').removeChild(value)
	})
}
function showMembers(){
	var req  = new XMLHttpRequest()
	req.onload = ()=>{
		var users = JSON.parse(req.responseText)
		Deactivate();
		document.querySelector('.noOfUsers').classList.add('active')
		EmptyUsers()
		users.forEach((value) => {
			console.log(value)
		  var div1 = `
		  		<div style="display : none">
		  			${value.Email}
		  		</div>
				<div class="block1">
					<img src="/static/${value.Image}">
				</div>
				<div class="block2">
					<span>${value.Name}</span>
				</div>
				<div class="block3">
					<i class="fa fa-chevron-up ActionIcons" onclick="Promot(event)"></i>
				</div>
				<div class="block4">
					<i class="fa fa-times ActionIcons" onclick="deleteUser(event)"></i>
				</div>
			`
			var div2 = document.createElement('div')
			div2.classList.add('block')
			div2.innerHTML = div1;
			document.querySelector('.users').appendChild(div2)
		})
	}
	req.open('POST','/community/CommunityMembers')
	req.send(document.querySelector('#communityId').textContent)
}
function Promot(event){
	var req = new XMLHttpRequest()
	var data = {
		user: event.target.parentElement.parentElement.firstElementChild.textContent.trim(),
		communityId: document.querySelector('#communityId').textContent
	}
	req.onload = ()=>{
		document.querySelector('.adminsNo').innerHTML = parseInt(document.querySelector('.adminsNo').innerHTML) + 1
		document.querySelector('.usersNo').innerHTML = parseInt(document.querySelector('.usersNo').innerHTML) - 1
		RemoveUser(event.target.parentElement.parentElement)
	}
	req.open('POST','/community/promot');
	req.send(JSON.stringify(data))
}
function Demote(event){
	var req = new XMLHttpRequest()
	var data = {
		user: event.target.parentElement.parentElement.firstElementChild.textContent.trim(),
		communityId: document.querySelector('#communityId').textContent
	}
	req.onload = ()=>{
		document.querySelector('.adminsNo').innerHTML = parseInt(document.querySelector('.adminsNo').innerHTML) - 1
		document.querySelector('.usersNo').innerHTML = parseInt(document.querySelector('.usersNo').innerHTML) + 1
		RemoveUser(event.target.parentElement.parentElement)
	}
	req.open('POST','/community/Demote');
	req.send(JSON.stringify(data))
}
function deleteUser(event){
	var req = new XMLHttpRequest()
	var data = {
		user: event.target.parentElement.parentElement.firstElementChild.textContent.trim(),
		communityId: document.querySelector('#communityId').textContent,
		Type: 'Users'
	}
	req.onload = ()=>{
		document.querySelector('.usersNo').innerHTML = parseInt(document.querySelector('.usersNo').innerHTML) - 1
		RemoveUser(event.target.parentElement.parentElement)
	}
	req.open('POST','/community/deleteMember');
	req.send(JSON.stringify(data))
}
function deleteAdmin(event){
	var req = new XMLHttpRequest()
	var data = {
		user: event.target.parentElement.parentElement.firstElementChild.textContent.trim(),
		communityId: document.querySelector('#communityId').textContent,
		Type: 'Admin'
	}
	req.onload = ()=>{
		document.querySelector('.adminsNo').innerHTML = parseInt(document.querySelector('.adminsNo').innerHTML) - 1
		RemoveUser(event.target.parentElement.parentElement)
	}
	req.open('POST','/community/deleteMember');
	req.send(JSON.stringify(data))
}
function showAdmins(){
	var req  = new XMLHttpRequest()
	req.onload = ()=>{
		console.log(req.responseText)
		var users = JSON.parse(req.responseText)
		Deactivate();
		document.querySelector('.noOfAdmins').classList.add('active')
		EmptyUsers()
		users.forEach((value) => {
		  if(value.Type == 'Admin'){
		  	var div1 = `
		  		<div style="display : none">
		  			${value.Email}
		  		</div>
				<div class="block1">
					<img src="/static/${value.Image}">
				</div>
				<div class="block2">
					<span>${value.Name}</span>
				</div>
				<div class="block3">
					<i class="fa fa-chevron-down ActionIcons" onclick="Demote(event)"></i>
				</div>
				<div class="block4">
					<i class="fa fa-times ActionIcons" onclick="deleteAdmin(event)"></i>
				</div>
			`
			var div2 = document.createElement('div')
			div2.classList.add('block')
			div2.innerHTML = div1;
			document.querySelector('.users').appendChild(div2)
		}else{
			var div1 = `
				<div style="display : none">
		  			${value.UserId}
		  		</div>
				<div class="block1">
					<img src="/static/${value.Image}">
				</div>
				<div class="block2">
					<span>${value.Name}</span>
				</div>
				<div class="block4">
					<span>owner</span>
				</div>
			`
			var div2 = document.createElement('div')
			div2.classList.add('block')
			div2.innerHTML = div1;
			document.querySelector('.users').appendChild(div2)
		}
		})
	}
	req.open('POST','/community/CommunitysAdmins')
	req.send(document.querySelector('#communityId').textContent)
}
$(document).ready(function(){
	showMembers()
})