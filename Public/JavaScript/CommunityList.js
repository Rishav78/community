
var refresh = document.querySelector('.refresh')
var userType = document.querySelector('.CommunityRule')
var cross = document.querySelector('.cross')
var close = document.querySelector('.cls')
var edit = document.querySelector('.edit')
var s = document.querySelector('.editcover')

cross.onclick = cls
close.onclick = cls
s.onclick = cls
var child;

function cls(){
	edit.style.top = '-100%'
	edit.style.opacity = '0'
	console.log(s)
	s.style.display = 'none'
}
function Show(){
	edit.style.top = '50px'
	edit.style.opacity = '1'
	s.style.display = 'block'
}

// refresh.onclick = updateData
// userType.onchange = updateData

function updateData(){
	var j=0
	numberOfPage = 0
	rows = []
	var obj = {
		Rule : userType.value,
	}
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		console.log(req.response)
		var users = document.querySelectorAll('.Community')
		console.log(users)
		users.forEach((value)=>{
			document.querySelector('tbody').removeChild(value)
		})
		users = JSON.parse(req.responseText)
		console.log(users)
		users.forEach((value)=>{
			var tr = document.createElement('tr')
			tr.className = 'Community'
			var td1 = document.createElement('td')
			td1.innerHTML = value.CommunityName
			td1.style.fontWeight = 'bold'
			tr.appendChild(td1)
			var td2 = document.createElement('td')
			td2.innerHTML = value.MembershipRule
			tr.appendChild(td2)
			var td3 = document.createElement('td')
			td3.innerHTML = value.CommunityOwner
			tr.appendChild(td3)
			var td4 = document.createElement('td')
			td4.innerHTML = value.CreateDate
			tr.appendChild(td4)
			var td5 = document.createElement('td')
			td5.innerHTML = '<div style="min-width: 100px;"><i onclick="Show()" class="fa fa-edit icon"></i><i class="fa fa-info icon"></i></div>'
			tr.appendChild(td5)
			var td6 = document.createElement('td')
			td6.innerHTML = value.CommunityPic
			tr.appendChild(td6)
			var td7 = document.createElement('td')
			td7.innerHTML = value.CommunityPic
			tr.appendChild(td7)
			document.querySelector('tbody').appendChild(tr)
		})
		$('#myTable').DataTable();
	}
	req.open('POST','/community/communityList')
	req.send(JSON.stringify(obj))
}
window.onload = updateData