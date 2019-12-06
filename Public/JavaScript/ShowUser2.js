var refresh = document.querySelector('.refresh')
var popup = document.querySelector('.edit')
var close = document.querySelector('#close')
var update = document.querySelector('#editsubmit')
var PCuser = document.querySelector('.status')
var userType = document.querySelector('.Role')
var alert = document.querySelectorAll('.a')
let table, ids;
var child;

function sendMail(event){
	console.log('rishav')
	msg = ''
	document.querySelector('.trumbowyg-editor').childNodes.forEach((value)=>{
		msg += value.textContent.replace(/<[^>]*>/g, '');
	})
	var data = {
		to: document.querySelector('.to').value,
		subject: document.querySelector('.subject').value,
		msg
	}
	var req = new XMLHttpRequest
	req.onload = ()=>{
		console.log('Mail Send')
		document.querySelector('.mailContainer').classList.add('animatereverse')
	}
	req.open('POST','/admin/userlist/sendMail')
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data))
}

function showUpdateBox(id) {
	let req = new XMLHttpRequest();
	
	req.onload = () => {
		ids = id;
		const user = JSON.parse(req.response);
		document.querySelector('#eheading').innerHTML = `Update ${user.Email}`;
		$('#username').val(user.Email);
		$('#phone').val(user.Phno);
		$('#city').val(user.City);
		$('#status').val(user.Status ? 'Confirmed' : 'Pending');
		$('#role').val(user.Role);

	}

	req.open('GET', `/admin/userlist/${id}`);
	req.send();
	// child = event.target.parentNode.parentNode.parentNode.parentNode.childNodes
	// document.querySelector('#eheading').innerHTML = `Update ${child[1].textContent.trim()}`
	// for(var i=0;i<child.length-1;i++){
	// 	if(child[i].nodeType == 1){
	// 		console.log(document.querySelector('#' + child[i].classList[0]))
	// 		document.querySelector('#' + child[i].classList[0]).value = child[i].textContent.trim()
	// 	}
	// }
}

function switchRole(e, msg, user, state, name){
	$.confirm({
	  title: msg,
	  content: "Do you really want switch state...",
	  boxWidth: '350px',
	  useBootstrap: false,
	  buttons: {
	      'Yes': {
	          btnClass: 'btn-success',
	          action: function () {
	            changeActivationState(e, user, state, name)
	          }
	      },
	      'No': {btnClass: 'btn-danger',}
	  }
	});
}

function changeActivationState(e, user, state, name){
	const target = e.target;
	// var user = target.parentNode.parentNode.parentNode.firstElementChild.textContent.trim()
	// var state = target.classList.contains('fa-check-circle') ? true : false
	console.log(user)
	var data = {
		state : state, 
	}
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		if(target.classList.contains('fa-check-circle')){
			target.classList.remove('fa-check-circle')
			target.classList.add('fa-times-circle')
			target.setAttribute('onclick','switchRole(event,"Deactivate User")')
			document.querySelector('.added').innerHTML = `User ${name} Activated`
			document.querySelector('.added').classList.add('animate')
		}else{
			target.classList.remove('fa-times-circle')
			target.classList.add('fa-check-circle')
			target.setAttribute('onclick','switchRole(event,"Activate User")')
			document.querySelector('.exist').innerHTML =`User ${name} Deactivated`
			document.querySelector('.exist').classList.add('animate')
		}
	}
	req.open('PUT',`/activation/${user}`)
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data))
}

alert.forEach((value)=>{
	value.addEventListener('animationend',()=>{
		document.querySelector('.animate').classList.remove('animate')
	})
})

update.onclick = ()=>{
	var data = {
		Email : document.querySelector('#username').value,
		Phone : document.querySelector('#phone').value,
		City : document.querySelector('#city').value,
		Status : document.querySelector('#status').value === 'Pending' ? false : true,
		Role : document.querySelector('#role').value,
	}
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		table.ajax.reload();
	}
	req.open('POST',`userlist/update/${ids}`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data))
}


$(document).ready(function(){
	table = $('#myTable').DataTable({
		"lengthMenu": [5, 10, 25, 50],
		"serverSide": true,
        "processing": true,
		"ajax": {
	        url: '/admin/userlist',
	        type: 'POST',
	        "data": function ( d ) {
	          d.roleFilter   = $('.Role').val();
	          d.statusFilter = $('.Status').val();
	        },
	     },
	     "columns": [
            { title : "Usename/Email", "data": "Email", 'sClass':'username'},
            { title : "Phone", "data": "Phno", 'sClass':'phone'},
            { title : "City", "data": "City", 'sClass':'city'},
            { title : "Status", "data": null, 'sClass':'status'},
            { title : "Role", "data": "Role", 'sClass':'role'},
            { title : "Active", "data": "ActivationState", 'sClass':'active',visible: false },
            { title : "Actions","data": null, 'orderable' : false, 'sClass':'action'}
        ],
        "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
			$('td:eq(3)', nRow).html( aData.Status ? 'Confirm' : 'Pending');
        	if(aData.Role === 'superadmin'){
        		console.log(aData.Role)
        		$('td:eq(5)', nRow).html( '<div style="min-width: 100px;"><i onclick="nodeMailer(event)" class="fa fa-envelope-o icon"></i></div>' );
        	}else{
        		if(aData.ActivationState == true){
	        		$('td:eq(5)', nRow).html( `<div style="min-width: 150px;"><i onclick="nodeMailer(event)" class="fa fa-envelope-o icon"></i><a data-toggle="modal" data-target="#editModal"><i onclick="showUpdateBox('${aData._id}')" class="fa fa-edit icon"></i></a><i onclick="switchRole(event, 'Deactivate User?', '${aData._id}', ${0}, '${aData.Name}')" class="fa fa-times-circle icon"></i></div>` );
	        	}else{
	        		$('td:eq(5)', nRow).html( `<div style="min-width: 150px;"><i onclick="nodeMailer(event)" class="fa fa-envelope-o icon"></i><a data-toggle="modal" data-target="#editModal"><i onclick="showUpdateBox('${aData._id}')" class="fa fa-edit icon"></i></a><i onclick="switchRole(event, 'Activate User?', '${aData._id}', ${1}, '${aData.Name}')" class="fa fa-check-circle icon"></i></div>`);
	        	}
        	}
        }
	});
	$('.Status').on('change', function () {
	    table.ajax.reload(null, false);
	});
	$('.Role').on('change', function () {
	    table.ajax.reload(null, false);
	});
	$('.refresh').on('click', function () {
	    table.ajax.reload(null, false);
	});
})