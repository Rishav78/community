
var refresh = document.querySelector('.refresh')
var close = document.querySelector('#close')
var searchbox = document.querySelector('#number')
var search = document.querySelector('#search')

function del(e){
	var value = e.target
	var req = new XMLHttpRequest()
	var user = value.parentNode.parentNode.parentNode
	req.onload = ()=>{
		console.log('deleted')
	}
	req.open('POST','deletetag')
	// console.log(user.firstChild.textContent.trim())
	req.send(user.firstChild.textContent.trim())
}

refresh.onclick = updateData
window.onload = updateData
function updateData(){
	console.log('vbnm,')
	var j=0
	numberOfPage = 0
	rows = []
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		var users = JSON.parse(req.responseText)
		console.log(users)
		users.forEach((value)=>{
			var tr = document.createElement('tr')
			tr.className = 'USER'
			tr.classList.add(numberOfPage)
			var td1 = document.createElement('td')
			td1.className = 'Username'
			td1.innerHTML = value.name
			td1.style.fontWeight = 'bold'
			td1.style.textAlign = 'center'
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
			document.querySelector('tbody').appendChild(tr)
			j++;
		})
		var table = $('#myTable').DataTable();
		$('#myTable').on("click", ".fa-trash-o", function(){
		  console.log($(this).parent());
		  table.row($(this).parents('tr')).remove().draw(false);
		});
	}
	req.open('POST','tagslistdata')
	req.send()
}