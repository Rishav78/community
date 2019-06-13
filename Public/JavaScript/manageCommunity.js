
function confirm(e,cb,title,content){
	$.confirm({
	  title: title,
	  content: content,
	  boxWidth: '350px',
	  useBootstrap: false,
	  buttons: {
	      'Yes': {
	          btnClass: 'btn-success',
	          action: ()=> {
	          	cb(e)
	          }
	      },
	      'No': {btnClass: 'btn-danger',}
	  }
	});
}

function Deactivate(){
	if(document.querySelector('.active')){
		document.querySelector('.active').classList.remove('active')
	}
}
function RemoveUser(user){
	user.parentElement.removeChild(user)
}
function EmptyUsers(){
	while(document.querySelector('.users').childElementCount > 0){
		document.querySelector('.users').removeChild(document.querySelector('.users').firstElementChild)
	}
}

function showInvitedUsers(){
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		var users = JSON.parse(req.responseText)
		Deactivate();
		document.querySelector('.invitedusers').classList.add('active')
		EmptyUsers()
		if(!users.length){
			document.querySelector('.users').innerHTML = `<div class="noUserFound">No any user </div>`;
		}else{
			users.forEach((value) => {
			  var div1 = `
			  		<div style="display : none">
			  			${value.Id}
			  		</div>
					<div class="block1">
						<img src="/static/${value.Image}">
					</div>
					<div class="block2">
						<a href="/viewProfile/${value.UserId}">${value.Name}</a>
					</div>
					<div class="block4">
						<i class="fa fa-times ActionIcons" onclick="confirm(event, deleteInvited, 'Cancel Invitation', 'Do you really want cancel invitation ?')"></i>
					</div>
				`
				var div2 = document.createElement('div')
				div2.classList.add('block')
				div2.innerHTML = div1;
				document.querySelector('.users').appendChild(div2)
			})
		}
	}
	req.open('GET',`/community/invitedUsers/${document.querySelector('#communityId').textContent}`)
	req.send()
}

function showRequests(){
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		var users = JSON.parse(req.responseText)
		Deactivate();
		document.querySelector('.request').classList.add('active')
		EmptyUsers()
		if(!users.length){
			document.querySelector('.users').innerHTML = `<div class="noUserFound">No any user </div>`;
		}else{
			users.forEach((value) => {
			  var div1 = `
			  		<div style="display : none">
			  			${value.Id}
			  		</div>
					<div class="block1">
						<img src="/static/${value.Image}">
					</div>
					<div class="block2">
						<a href="/viewProfile/${value.UserId}">${value.Name}</a>
					</div>
					<div class="block4">
						<div class="option">
							<button class="optionButton" onclick="showOptions(event)">Option</button>
							<ul class="options"><li onclick="acceptReq()">Accept</li><li>Reject</li>
							</ul>
						</div>
					</div>
				`
				var div2 = document.createElement('div')
				div2.classList.add('block')
				div2.innerHTML = div1;
				document.querySelector('.users').appendChild(div2)
			})
		}
	}
	req.open('GET',`/community/requests/${document.querySelector('#communityId').textContent}`)
	req.send()
}
function showMembers(){
	var req  = new XMLHttpRequest()
	req.onload = ()=>{
		var users = JSON.parse(req.responseText)
		Deactivate();
		document.querySelector('.noOfUsers').classList.add('active')
		EmptyUsers()
		if(!users.length){
			document.querySelector('.users').innerHTML = `<div class="noUserFound">No any user </div>`;
		}else{
			users.forEach((value) => {
			  var div1 = `
					<div class="block1">
						<img src="/static/${value.Image}">
					</div>
					<div class="block2">
						<a href="/viewProfile/${value.UserId}">${value.Name}</a>
					</div>
					<div class="block3">
						<i class="fa fa-chevron-up ActionIcons" onclick="confirm('${value.Id}',Promot,'Confirm promote!','Do you really want promote this user?')"></i>
					</div>
					<div class="block4">
						<i class="fa fa-times ActionIcons" onclick="confirm(event,deleteUser,'Really want remove ?','Do you really want remove this user?')"></i>
					</div>
				`
				var div2 = document.createElement('div')
				div2.classList.add('block')
				div2.innerHTML = div1;
				document.querySelector('.users').appendChild(div2)
			})
		}
	}
	req.open('GET',`/community/CommunityMembers/${document.querySelector('#communityId').textContent}`)
	req.send()
}
function Promot(Id){
	var req = new XMLHttpRequest()
	var data = {
		communityId: document.querySelector('#communityId').textContent
	}
	req.onload = ()=>{
		document.querySelector('.adminsNo').innerHTML = parseInt(document.querySelector('.adminsNo').innerHTML) + 1
		document.querySelector('.usersNo').innerHTML = parseInt(document.querySelector('.usersNo').innerHTML) - 1
		showMembers()
	}
	req.set
	req.open('POST',`/community/promot/${Id}`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data))
}
function deleteInvited(event){
	var req = new XMLHttpRequest()
	var data = {
		user: event.target.parentElement.parentElement.firstElementChild.textContent.trim(),
	}
	req.onload = ()=>{
		document.querySelector('.invitedNo').innerHTML = parseInt(document.querySelector('.invitedNo').innerHTML) - 1
		showInvitedUsers()
	}
	req.open('POST',`/community/deleteInvite/${document.querySelector('#communityId').textContent}`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data))
}

function Demote(Id){
	var req = new XMLHttpRequest()
	var data = {
		communityId: document.querySelector('#communityId').textContent
	}
	req.onload = ()=>{
		document.querySelector('.adminsNo').innerHTML = parseInt(document.querySelector('.adminsNo').innerHTML) - 1
		document.querySelector('.usersNo').innerHTML = parseInt(document.querySelector('.usersNo').innerHTML) + 1
		showAdmins()
	}
	req.open('POST',`/community/Demote/${Id}`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data))
}

function deleteUser(event){
	var req = new XMLHttpRequest()
	var data = {
		user: event.target.parentElement.parentElement.firstElementChild.textContent.trim(),
		Type: 'User'
	}
	req.onload = ()=>{
		document.querySelector('.usersNo').innerHTML = parseInt(document.querySelector('.usersNo').innerHTML) - 1
		showMembers()
	}
	req.open('POST',`/community/delete/${document.querySelector('#communityId').textContent}`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data))
}

function deleteAdmin(event){
	var req = new XMLHttpRequest()
	var data = {
		user: event.target.parentElement.parentElement.firstElementChild.textContent.trim(),
		Type: 'Admin'
	}
	req.onload = ()=>{
		document.querySelector('.adminssNo').innerHTML = parseInt(document.querySelector('.adminsNo').innerHTML) - 1
		showMembers()
	}
	req.open('POST',`/community/delete/${document.querySelector('#communityId').textContent}`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data))
}

function showAdmins(){
	var req  = new XMLHttpRequest()
	req.onload = ()=>{
		var users = JSON.parse(req.responseText)
		Deactivate();
		document.querySelector('.noOfAdmins').classList.add('active')
		EmptyUsers()
		if(!users.length){
			document.querySelector('.users').innerHTML = `<div class="noUserFound">No any user </div>`;
		}else{
			users.forEach((value) => {
			  if(value.Type == 'Admin'){
			  	var div1 = `
			  		<div style="display : none">
			  			${value.Id}
			  		</div>
					<div class="block1">
						<img src="/static/${value.Image}">
					</div>
					<div class="block2">
						<a href="/viewProfile/${value.UserId}">${value.Name}</a>
					</div>
					<div class="block3">
						<i class="fa fa-chevron-down ActionIcons" onclick="confirm('${value.Id}',Demote,'Confirm demotee!','Do you really want demote this user?')"></i>
					</div>
					<div class="block4">
						<i class="fa fa-times ActionIcons" onclick="confirm(event,deleteAdmin,'Really want remove ?','Do you really want remove this user?')"></i>
					</div>
				`
				
				}else{
					var div1 = `
						<div style="display : none">
				  			${value.UserId}
				  		</div>
						<div class="block1">
							<img src="/static/${value.Image}">
						</div>
						<div class="block2">
							<a href="/viewProfile/${value.UserId}">${value.Name}</a>
						</div>
						<div class="block4">
							<span class="owner">owner</span>
						</div>
					`
				}

				var div2 = document.createElement('div')
				div2.classList.add('block')
				div2.innerHTML = div1;
				document.querySelector('.users').appendChild(div2)
			})
		}
	}
	req.open('GET',`/community/CommunitysAdmins/${document.querySelector('#communityId').textContent}`)
	req.send()
}
$(document).ready(function(){
	showMembers()
})